const MAX_TOOL_ITERATIONS = 10;
function nowIso() {
    return new Date().toISOString();
}
function isValidPriority(val) {
    return val === 'info' || val === 'warning' || val === 'urgent';
}
export function createAgentService(options) {
    const { dataBus, notificationQueue, sceneManager, llmProvider } = options;
    let closed = false;
    const auditLog = [];
    const tools = [];
    // --- Helpers ---
    function addAudit(entry) {
        auditLog.push({ timestamp: nowIso(), ...entry });
    }
    function wrapTool(tool) {
        return {
            ...tool,
            async execute(params) {
                try {
                    const result = await tool.execute(params);
                    addAudit({ action: 'tool_call', tool: tool.name, params, result });
                    return result;
                }
                catch (err) {
                    const error = err instanceof Error ? err.message : String(err);
                    addAudit({ action: 'tool_call', tool: tool.name, params, error });
                    throw err;
                }
            },
        };
    }
    // --- Built-in tools ---
    function registerBuiltIns() {
        tools.push(wrapTool({
            name: 'query_data_bus',
            description: 'Query the latest data from a data bus channel',
            input_schema: {
                type: 'object',
                properties: { channel: { type: 'string' } },
                required: ['channel'],
            },
            async execute(params) {
                return dataBus.getLatest(params['channel']);
            },
        }), wrapTool({
            name: 'list_channels',
            description: 'List all available data bus channels',
            input_schema: { type: 'object', properties: {} },
            async execute() {
                return dataBus.getChannels();
            },
        }), wrapTool({
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
                const priority = params['priority'];
                if (!isValidPriority(priority)) {
                    throw new Error(`Invalid priority: ${priority}`);
                }
                return notificationQueue.emit({
                    source: params['source'],
                    priority,
                    title: params['title'],
                    body: params['body'],
                });
            },
        }), wrapTool({
            name: 'switch_scene',
            description: 'Switch the display to a named scene',
            input_schema: {
                type: 'object',
                properties: { scene: { type: 'string' } },
                required: ['scene'],
            },
            async execute(params) {
                return sceneManager.switchTo(params['scene']);
            },
        }), wrapTool({
            name: 'get_active_scene',
            description: 'Get the name of the currently active scene',
            input_schema: { type: 'object', properties: {} },
            async execute() {
                return sceneManager.getActiveSceneName();
            },
        }));
    }
    registerBuiltIns();
    // --- Tool lookup ---
    function findTool(name) {
        return tools.find((t) => t.name === name);
    }
    // --- Agent loop ---
    async function runAgentLoop(initialMessages) {
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
                let resultContent;
                if (tool) {
                    try {
                        const result = await tool.execute(tc.input);
                        resultContent = JSON.stringify(result ?? null);
                        toolCallsMade++;
                    }
                    catch (err) {
                        resultContent = JSON.stringify({
                            error: err instanceof Error ? err.message : String(err),
                        });
                        toolCallsMade++;
                    }
                }
                else {
                    resultContent = JSON.stringify({ error: `unknown tool "${tc.name}"` });
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
    const instance = {
        getTools() {
            return closed ? [] : [...tools];
        },
        registerTool(tool) {
            if (closed)
                return;
            tools.push(wrapTool(tool));
        },
        async executeTask(prompt) {
            if (closed)
                return { response: '', tool_calls_made: 0, audit_entries: [] };
            addAudit({ action: 'execute_task', params: { prompt } });
            const messages = [{ role: 'user', content: prompt }];
            const { response, toolCallsMade } = await runAgentLoop(messages);
            return {
                response,
                tool_calls_made: toolCallsMade,
                audit_entries: [...auditLog],
            };
        },
        async generateMorningBrief() {
            if (closed)
                return '';
            addAudit({ action: 'morning_brief' });
            const channels = dataBus.getChannels();
            const channelData = Object.create(null);
            for (const ch of channels) {
                const latest = dataBus.getLatest(ch);
                if (latest) {
                    channelData[ch] = latest.data;
                }
            }
            const dataSection = channels.length > 0
                ? channels
                    .map((ch) => `${ch}: ${JSON.stringify(channelData[ch] ?? 'no data')}`)
                    .join('\n')
                : 'No channel data available.';
            const prompt = `Generate a concise morning brief from the following data:\n\n${dataSection}\n\nProvide a friendly summary.`;
            const messages = [{ role: 'user', content: prompt }];
            const response = await llmProvider.chat(messages);
            return response.content;
        },
        evaluateConditions(rules) {
            if (closed)
                return [];
            addAudit({ action: 'evaluate_conditions', params: { ruleCount: rules.length } });
            const alerts = [];
            for (const rule of rules) {
                try {
                    const data = Object.create(null);
                    for (const ch of rule.channels) {
                        const latest = dataBus.getLatest(ch);
                        data[ch] = latest?.data;
                    }
                    const alert = rule.evaluate(data);
                    if (alert) {
                        alerts.push(alert);
                        if (alert.action === 'notify') {
                            try {
                                notificationQueue.emit({
                                    source: 'agent',
                                    priority: 'info',
                                    title: alert.message,
                                });
                            }
                            catch {
                                // Continue evaluation if notification fails
                            }
                        }
                    }
                }
                catch {
                    // Continue evaluation if rule evaluation fails
                }
            }
            return alerts;
        },
        getAuditLog() {
            return closed ? [] : [...auditLog];
        },
        clearAuditLog() {
            auditLog.length = 0;
        },
        close() {
            closed = true;
            tools.length = 0;
            auditLog.length = 0;
        },
    };
    return instance;
}
//# sourceMappingURL=agent-service.js.map