import type {
  AgentServiceInstance,
  AgentServiceOptions,
  AgentTool,
  AuditEntry,
  AgentAlert,
  AgentTaskResult,
  ConditionRule,
  LlmMessage,
} from '@lensing/types';

const MAX_TOOL_ITERATIONS = 10;

function nowIso(): string {
  return new Date().toISOString();
}

export function createAgentService(options: AgentServiceOptions): AgentServiceInstance {
  const { dataBus, notificationQueue, sceneManager, llmProvider } = options;

  let closed = false;
  const auditLog: AuditEntry[] = [];
  const tools: AgentTool[] = [];

  // --- Helpers ---

  function addAudit(entry: Omit<AuditEntry, 'timestamp'>): void {
    auditLog.push({ timestamp: nowIso(), ...entry });
  }

  function wrapTool(tool: AgentTool): AgentTool {
    return {
      ...tool,
      async execute(params) {
        try {
          const result = await tool.execute(params);
          addAudit({ action: 'tool_call', tool: tool.name, params, result });
          return result;
        } catch (err) {
          const error = err instanceof Error ? err.message : String(err);
          addAudit({ action: 'tool_call', tool: tool.name, params, error });
          throw err;
        }
      },
    };
  }

  // --- Built-in tools ---

  function registerBuiltIns(): void {
    tools.push(
      wrapTool({
        name: 'query_data_bus',
        description: 'Query the latest data from a data bus channel',
        input_schema: {
          type: 'object',
          properties: { channel: { type: 'string' } },
          required: ['channel'],
        },
        async execute(params) {
          return dataBus.getLatest(params['channel'] as string);
        },
      }),

      wrapTool({
        name: 'list_channels',
        description: 'List all available data bus channels',
        input_schema: { type: 'object', properties: {} },
        async execute() {
          return dataBus.getChannels();
        },
      }),

      wrapTool({
        name: 'emit_notification',
        description: 'Emit a notification to the user',
        input_schema: {
          type: 'object',
          properties: {
            source: { type: 'string' },
            priority: { type: 'string', enum: ['info', 'warning', 'urgent'] },
            title: { type: 'string' },
            body: { type: 'string' },
          },
          required: ['source', 'priority', 'title'],
        },
        async execute(params) {
          return notificationQueue.emit({
            source: params['source'] as string,
            priority: params['priority'] as 'info' | 'warning' | 'urgent',
            title: params['title'] as string,
            body: params['body'] as string | undefined,
          });
        },
      }),

      wrapTool({
        name: 'switch_scene',
        description: 'Switch the display to a named scene',
        input_schema: {
          type: 'object',
          properties: { scene: { type: 'string' } },
          required: ['scene'],
        },
        async execute(params) {
          return sceneManager.switchTo(params['scene'] as string);
        },
      }),

      wrapTool({
        name: 'get_active_scene',
        description: 'Get the name of the currently active scene',
        input_schema: { type: 'object', properties: {} },
        async execute() {
          return sceneManager.getActiveSceneName();
        },
      })
    );
  }

  registerBuiltIns();

  // --- Tool lookup ---

  function findTool(name: string): AgentTool | undefined {
    return tools.find((t) => t.name === name);
  }

  // --- Agent loop ---

  async function runAgentLoop(
    initialMessages: LlmMessage[]
  ): Promise<{ response: string; toolCallsMade: number }> {
    const messages = [...initialMessages];
    const toolDefs = tools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.input_schema,
    }));

    let toolCallsMade = 0;
    let iterations = 0;

    while (iterations < MAX_TOOL_ITERATIONS) {
      const response = await llmProvider.chat(messages, toolDefs);

      if (response.stop_reason === 'end_turn' || !response.tool_calls?.length) {
        return { response: response.content, toolCallsMade };
      }

      // Execute all tool calls in this turn
      for (const tc of response.tool_calls) {
        const tool = findTool(tc.name);
        let resultContent: string;

        if (tool) {
          try {
            const result = await tool.execute(tc.input);
            resultContent = JSON.stringify(result);
            toolCallsMade++;
          } catch (err) {
            resultContent = `Error: ${err instanceof Error ? err.message : String(err)}`;
            toolCallsMade++;
          }
        } else {
          resultContent = `Error: unknown tool "${tc.name}"`;
        }

        messages.push({
          role: 'tool_result',
          content: resultContent,
          tool_use_id: tc.id,
        });
      }

      iterations++;
    }

    // Hit max iterations — return informative message
    return {
      response: `Agent exceeded maximum iterations (${MAX_TOOL_ITERATIONS}). No conclusion reached.`,
      toolCallsMade,
    };
  }

  // --- Public interface ---

  const instance: AgentServiceInstance = {
    getTools(): AgentTool[] {
      return closed ? [] : [...tools];
    },

    registerTool(tool: AgentTool): void {
      if (closed) return;
      tools.push(wrapTool(tool));
    },

    async executeTask(prompt: string): Promise<AgentTaskResult> {
      addAudit({ action: 'execute_task', params: { prompt } });

      const messages: LlmMessage[] = [{ role: 'user', content: prompt }];
      const { response, toolCallsMade } = await runAgentLoop(messages);

      return {
        response,
        tool_calls_made: toolCallsMade,
        audit_entries: [...auditLog],
      };
    },

    async generateMorningBrief(): Promise<string> {
      addAudit({ action: 'morning_brief' });

      const channels = dataBus.getChannels();
      const channelData: Record<string, unknown> = Object.create(null);

      for (const ch of channels) {
        const latest = dataBus.getLatest(ch);
        if (latest) {
          channelData[ch] = latest.data;
        }
      }

      const dataSection =
        channels.length > 0
          ? channels
              .map((ch) => `${ch}: ${JSON.stringify(channelData[ch] ?? 'no data')}`)
              .join('\n')
          : 'No channel data available.';

      const prompt = `Generate a concise morning brief from the following data:\n\n${dataSection}\n\nProvide a friendly summary.`;

      const messages: LlmMessage[] = [{ role: 'user', content: prompt }];
      const response = await llmProvider.chat(messages);
      return response.content;
    },

    evaluateConditions(rules: ConditionRule[]): AgentAlert[] {
      addAudit({ action: 'evaluate_conditions', params: { ruleCount: rules.length } });

      const alerts: AgentAlert[] = [];

      for (const rule of rules) {
        const data: Record<string, unknown> = Object.create(null);

        for (const ch of rule.channels) {
          const latest = dataBus.getLatest(ch);
          data[ch] = latest?.data;
        }

        const alert = rule.evaluate(data);
        if (alert) {
          alerts.push(alert);

          if (alert.action === 'notify') {
            notificationQueue.emit({
              source: 'agent',
              priority: 'info',
              title: alert.message,
            });
          }
        }
      }

      return alerts;
    },

    getAuditLog(): AuditEntry[] {
      return closed ? [] : [...auditLog];
    },

    clearAuditLog(): void {
      auditLog.length = 0;
    },

    close(): void {
      closed = true;
      tools.length = 0;
      auditLog.length = 0;
    },
  };

  return instance;
}
