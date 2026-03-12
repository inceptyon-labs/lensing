/** Format a list of scenes and optional schedule for display */
export function listScenes(options) {
    const { scenes, activeSceneName, scheduleEntries } = options;
    const lines = [];
    lines.push('Available scenes:');
    for (const scene of scenes) {
        const marker = scene.name === activeSceneName ? ' * (active)' : '';
        lines.push(`  - ${scene.name}${marker}`);
    }
    if (scheduleEntries && scheduleEntries.length > 0) {
        lines.push('');
        lines.push('Schedule:');
        for (const entry of scheduleEntries) {
            lines.push(`  ${entry.time}  →  ${entry.sceneName}`);
        }
    }
    return lines.join('\n');
}
/** Validate and return result for switching to a scene */
export function switchScene(options) {
    const { sceneName, availableScenes } = options;
    if (!sceneName) {
        return { success: false, error: 'Scene name is required' };
    }
    if (!availableScenes.includes(sceneName)) {
        return {
            success: false,
            error: `Unknown scene: "${sceneName}". Available scenes: ${availableScenes.join(', ')}`,
        };
    }
    return { success: true, sceneName };
}
//# sourceMappingURL=scene.js.map