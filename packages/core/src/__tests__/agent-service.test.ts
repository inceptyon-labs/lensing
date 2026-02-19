import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createAgentService } from '../agent-service';
import type {
  AgentServiceInstance,
  AgentServiceOptions,
  LlmProvider,
  LlmResponse,
  DataBusInstance,
  SceneManagerInstance,
  ConditionRule,
  AgentAlert,
} from '@lensing/types';

function createMockDataBus(): DataBusInstance {
  return {
    publish: vi.fn(),
    subscribe: vi.fn(() => () => {}),
    getLatest: vi.fn(),
    getChannels: vi.fn(() => []),
    onMessage: vi.fn(() => () => {}),
    clear: vi.fn(),
    close: vi.fn(),
  };
}

function createMockSceneManager(): SceneManagerInstance {
  return {
    getScenes: vi.fn(() => []),
    getScene: vi.fn(),
    getActiveScene: vi.fn(() => ({ name: 'ambient', layout: [], active_plugins: [] })),
    getActiveSceneName: vi.fn(() => 'ambient'),
    switchTo: vi.fn((name: string) => ({ name, layout: [], active_plugins: [] })),
    addScene: vi.fn(),
    updateScene: vi.fn(),
    removeScene: vi.fn(),
    onSceneChange: vi.fn(() => () => {}),
    close: vi.fn(),
  };
}

function createMockNotificationQueue() {
  return {
    emit: vi.fn(() => 'notif-1'),
    list: vi.fn(() => []),
    markRead: vi.fn(),
    dismiss: vi.fn(),
    clear: vi.fn(),
    onNotification: vi.fn(() => () => {}),
    close: vi.fn(),
  };
}

function createMockLlm(responses: LlmResponse[]): LlmProvider {
  let callIndex = 0;
  return {
    chat: vi.fn(async () => {
      const response = responses[callIndex] ?? {
        content: 'No more responses',
        stop_reason: 'end_turn' as const,
      };
      callIndex++;
      return response;
    }),
  };
}

describe('AgentService', () => {
  let agent: AgentServiceInstance;
  let dataBus: ReturnType<typeof createMockDataBus>;
  let sceneManager: ReturnType<typeof createMockSceneManager>;
  let notificationQueue: ReturnType<typeof createMockNotificationQueue>;
  let llm: LlmProvider;

  beforeEach(() => {
    dataBus = createMockDataBus();
    sceneManager = createMockSceneManager();
    notificationQueue = createMockNotificationQueue();
    llm = createMockLlm([{ content: 'Hello', stop_reason: 'end_turn' }]);

    agent = createAgentService({
      dataBus,
      notificationQueue,
      sceneManager,
      llmProvider: llm,
    });
  });

  describe('tool registration', () => {
    it('should register 5 built-in tools on creation', () => {
      const tools = agent.getTools();
      expect(tools).toHaveLength(5);
      const names = tools.map((t) => t.name);
      expect(names).toEqual(
        expect.arrayContaining([
          'query_data_bus',
          'list_channels',
          'emit_notification',
          'switch_scene',
          'get_active_scene',
        ])
      );
    });

    it('should allow registering a custom tool', () => {
      agent.registerTool({
        name: 'custom_tool',
        description: 'A custom tool',
        input_schema: { type: 'object', properties: {} },
        execute: async () => 'custom result',
      });

      const tools = agent.getTools();
      expect(tools).toHaveLength(6);
      expect(tools.find((t) => t.name === 'custom_tool')).toBeDefined();
    });
  });

  describe('built-in tool execution', () => {
    it('should execute query_data_bus tool', async () => {
      (dataBus.getLatest as ReturnType<typeof vi.fn>).mockReturnValue({
        channel: 'weather',
        data: { temp: 72 },
        timestamp: '2026-01-01T00:00:00Z',
        plugin_id: 'weather-plugin',
      });

      const tool = agent.getTools().find((t) => t.name === 'query_data_bus')!;
      const result = await tool.execute({ channel: 'weather' });

      expect(dataBus.getLatest).toHaveBeenCalledWith('weather');
      expect(result).toEqual({
        channel: 'weather',
        data: { temp: 72 },
        timestamp: '2026-01-01T00:00:00Z',
        plugin_id: 'weather-plugin',
      });
    });

    it('should execute list_channels tool', async () => {
      (dataBus.getChannels as ReturnType<typeof vi.fn>).mockReturnValue([
        'weather',
        'calendar',
        'news',
      ]);

      const tool = agent.getTools().find((t) => t.name === 'list_channels')!;
      const result = await tool.execute({});

      expect(result).toEqual(['weather', 'calendar', 'news']);
    });

    it('should execute emit_notification tool', async () => {
      const tool = agent.getTools().find((t) => t.name === 'emit_notification')!;
      const result = await tool.execute({
        source: 'agent',
        priority: 'info',
        title: 'Test notification',
        body: 'Test body',
      });

      expect(notificationQueue.emit).toHaveBeenCalledWith({
        source: 'agent',
        priority: 'info',
        title: 'Test notification',
        body: 'Test body',
      });
      expect(result).toBe('notif-1');
    });

    it('should execute switch_scene tool', async () => {
      const tool = agent.getTools().find((t) => t.name === 'switch_scene')!;
      const result = await tool.execute({ scene: 'morning' });

      expect(sceneManager.switchTo).toHaveBeenCalledWith('morning');
      expect(result).toEqual({ name: 'morning', layout: [], active_plugins: [] });
    });

    it('should execute get_active_scene tool', async () => {
      const tool = agent.getTools().find((t) => t.name === 'get_active_scene')!;
      const result = await tool.execute({});

      expect(result).toBe('ambient');
    });
  });

  describe('audit log', () => {
    it('should record tool executions in audit log', async () => {
      const tool = agent.getTools().find((t) => t.name === 'list_channels')!;
      await tool.execute({});

      const log = agent.getAuditLog();
      expect(log).toHaveLength(1);
      expect(log[0].action).toBe('tool_call');
      expect(log[0].tool).toBe('list_channels');
      expect(log[0].timestamp).toBeDefined();
    });

    it('should include params and result in audit entries', async () => {
      (dataBus.getLatest as ReturnType<typeof vi.fn>).mockReturnValue({
        channel: 'weather',
        data: { temp: 72 },
        timestamp: '2026-01-01T00:00:00Z',
        plugin_id: 'weather-plugin',
      });

      const tool = agent.getTools().find((t) => t.name === 'query_data_bus')!;
      await tool.execute({ channel: 'weather' });

      const log = agent.getAuditLog();
      expect(log[0].params).toEqual({ channel: 'weather' });
      expect(log[0].result).toBeDefined();
    });

    it('should record errors in audit log', async () => {
      (sceneManager.switchTo as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error('Unknown scene');
      });

      const tool = agent.getTools().find((t) => t.name === 'switch_scene')!;

      await expect(tool.execute({ scene: 'nonexistent' })).rejects.toThrow('Unknown scene');

      const log = agent.getAuditLog();
      expect(log).toHaveLength(1);
      expect(log[0].error).toBe('Unknown scene');
    });

    it('should clear audit log', async () => {
      const tool = agent.getTools().find((t) => t.name === 'list_channels')!;
      await tool.execute({});

      expect(agent.getAuditLog()).toHaveLength(1);

      agent.clearAuditLog();
      expect(agent.getAuditLog()).toHaveLength(0);
    });
  });

  describe('agent loop (executeTask)', () => {
    it('should execute a simple task with no tool calls', async () => {
      const result = await agent.executeTask('What time is it?');

      expect(result.response).toBe('Hello');
      expect(result.tool_calls_made).toBe(0);
    });

    it('should handle single-turn tool calling', async () => {
      (dataBus.getChannels as ReturnType<typeof vi.fn>).mockReturnValue(['weather']);

      llm = createMockLlm([
        {
          content: '',
          stop_reason: 'tool_use',
          tool_calls: [{ id: 'tc1', name: 'list_channels', input: {} }],
        },
        {
          content: 'Available channels: weather',
          stop_reason: 'end_turn',
        },
      ]);

      agent = createAgentService({ dataBus, notificationQueue, sceneManager, llmProvider: llm });
      const result = await agent.executeTask('List channels');

      expect(result.response).toBe('Available channels: weather');
      expect(result.tool_calls_made).toBe(1);
    });

    it('should handle multi-turn tool calling', async () => {
      (dataBus.getLatest as ReturnType<typeof vi.fn>).mockReturnValue({
        channel: 'weather',
        data: { temp: 72 },
        timestamp: '2026-01-01T00:00:00Z',
        plugin_id: 'weather-plugin',
      });

      llm = createMockLlm([
        {
          content: '',
          stop_reason: 'tool_use',
          tool_calls: [{ id: 'tc1', name: 'list_channels', input: {} }],
        },
        {
          content: '',
          stop_reason: 'tool_use',
          tool_calls: [{ id: 'tc2', name: 'query_data_bus', input: { channel: 'weather' } }],
        },
        {
          content: 'The weather is 72°F',
          stop_reason: 'end_turn',
        },
      ]);

      agent = createAgentService({ dataBus, notificationQueue, sceneManager, llmProvider: llm });
      const result = await agent.executeTask('What is the weather?');

      expect(result.response).toBe('The weather is 72°F');
      expect(result.tool_calls_made).toBe(2);
    });

    it('should handle LLM errors gracefully', async () => {
      llm = {
        chat: vi.fn(async () => {
          throw new Error('API rate limit');
        }),
      };

      agent = createAgentService({ dataBus, notificationQueue, sceneManager, llmProvider: llm });
      await expect(agent.executeTask('test')).rejects.toThrow('API rate limit');
    });

    it('should limit tool call iterations to prevent infinite loops', async () => {
      // LLM always requests tool calls
      llm = createMockLlm(
        Array(20).fill({
          content: '',
          stop_reason: 'tool_use',
          tool_calls: [{ id: 'tc', name: 'list_channels', input: {} }],
        })
      );

      agent = createAgentService({ dataBus, notificationQueue, sceneManager, llmProvider: llm });
      const result = await agent.executeTask('Loop forever');

      // Should stop after max iterations (10) and return what it has
      expect(result.tool_calls_made).toBeLessThanOrEqual(10);
    });

    it('should record executeTask in audit log', async () => {
      await agent.executeTask('Hello');

      const log = agent.getAuditLog();
      expect(log.length).toBeGreaterThanOrEqual(1);
      expect(log[0].action).toBe('execute_task');
    });
  });

  describe('morning brief', () => {
    it('should gather data from data bus channels and generate brief via LLM', async () => {
      (dataBus.getChannels as ReturnType<typeof vi.fn>).mockReturnValue([
        'weather',
        'calendar',
        'news',
      ]);
      (dataBus.getLatest as ReturnType<typeof vi.fn>).mockImplementation((ch: string) => ({
        channel: ch,
        data: { summary: `${ch} data` },
        timestamp: '2026-01-01T00:00:00Z',
        plugin_id: `${ch}-plugin`,
      }));

      llm = createMockLlm([
        {
          content: 'Good morning! Here is your brief: sunny skies, 2 meetings, top headlines.',
          stop_reason: 'end_turn',
        },
      ]);

      agent = createAgentService({ dataBus, notificationQueue, sceneManager, llmProvider: llm });
      const brief = await agent.generateMorningBrief();

      expect(brief).toContain('Good morning');
      expect(llm.chat).toHaveBeenCalledTimes(1);

      // Verify the LLM was called with data from channels
      const callArgs = (llm.chat as ReturnType<typeof vi.fn>).mock.calls[0];
      const userMessage = callArgs[0].find((m: { role: string }) => m.role === 'user');
      expect(userMessage.content).toContain('weather');
      expect(userMessage.content).toContain('calendar');
    });

    it('should handle missing channels gracefully', async () => {
      (dataBus.getChannels as ReturnType<typeof vi.fn>).mockReturnValue([]);

      llm = createMockLlm([
        {
          content: 'No data available for your morning brief.',
          stop_reason: 'end_turn',
        },
      ]);

      agent = createAgentService({ dataBus, notificationQueue, sceneManager, llmProvider: llm });
      const brief = await agent.generateMorningBrief();

      expect(brief).toBeDefined();
      expect(typeof brief).toBe('string');
    });

    it('should handle channels with no data', async () => {
      (dataBus.getChannels as ReturnType<typeof vi.fn>).mockReturnValue(['weather', 'calendar']);
      (dataBus.getLatest as ReturnType<typeof vi.fn>).mockReturnValue(undefined);

      llm = createMockLlm([
        {
          content: 'Brief with limited data.',
          stop_reason: 'end_turn',
        },
      ]);

      agent = createAgentService({ dataBus, notificationQueue, sceneManager, llmProvider: llm });
      const brief = await agent.generateMorningBrief();

      expect(brief).toBeDefined();
    });

    it('should record morning brief generation in audit log', async () => {
      (dataBus.getChannels as ReturnType<typeof vi.fn>).mockReturnValue([]);
      llm = createMockLlm([{ content: 'Brief', stop_reason: 'end_turn' }]);

      agent = createAgentService({ dataBus, notificationQueue, sceneManager, llmProvider: llm });
      await agent.generateMorningBrief();

      const log = agent.getAuditLog();
      expect(log.some((e) => e.action === 'morning_brief')).toBe(true);
    });
  });

  describe('condition evaluation', () => {
    it('should detect matching conditions and return alerts', () => {
      (dataBus.getLatest as ReturnType<typeof vi.fn>).mockImplementation((ch: string) => {
        if (ch === 'weather')
          return { data: { pollen: 'high' }, channel: ch, timestamp: '', plugin_id: '' };
        if (ch === 'calendar')
          return { data: { nextEvent: 'outdoor run' }, channel: ch, timestamp: '', plugin_id: '' };
        return undefined;
      });

      const rules: ConditionRule[] = [
        {
          name: 'pollen-outdoor',
          channels: ['weather', 'calendar'],
          evaluate(data) {
            const weather = data['weather'] as { pollen?: string } | undefined;
            const calendar = data['calendar'] as { nextEvent?: string } | undefined;
            if (weather?.pollen === 'high' && calendar?.nextEvent?.includes('outdoor')) {
              return {
                condition: 'pollen-outdoor',
                message: 'High pollen with outdoor event',
                action: 'notify',
              };
            }
            return null;
          },
        },
      ];

      const alerts = agent.evaluateConditions(rules);
      expect(alerts).toHaveLength(1);
      expect(alerts[0].condition).toBe('pollen-outdoor');
    });

    it('should return empty array when no conditions match', () => {
      (dataBus.getLatest as ReturnType<typeof vi.fn>).mockReturnValue(undefined);

      const rules: ConditionRule[] = [
        {
          name: 'always-false',
          channels: ['weather'],
          evaluate() {
            return null;
          },
        },
      ];

      const alerts = agent.evaluateConditions(rules);
      expect(alerts).toHaveLength(0);
    });

    it('should emit notifications for alerts with action=notify', () => {
      (dataBus.getLatest as ReturnType<typeof vi.fn>).mockReturnValue({
        data: { triggered: true },
        channel: 'test',
        timestamp: '',
        plugin_id: '',
      });

      const rules: ConditionRule[] = [
        {
          name: 'test-alert',
          channels: ['test'],
          evaluate() {
            return { condition: 'test', message: 'Alert!', action: 'notify' };
          },
        },
      ];

      agent.evaluateConditions(rules);

      expect(notificationQueue.emit).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'agent',
          title: 'Alert!',
        })
      );
    });

    it('should record condition evaluation in audit log', () => {
      const rules: ConditionRule[] = [];
      agent.evaluateConditions(rules);

      const log = agent.getAuditLog();
      expect(log.some((e) => e.action === 'evaluate_conditions')).toBe(true);
    });
  });

  describe('close', () => {
    it('should prevent operations after close', () => {
      agent.close();
      expect(agent.getTools()).toHaveLength(0);
      expect(agent.getAuditLog()).toHaveLength(0);
    });
  });
});
