import { createDatabase } from './database';
import { createDataBus } from './data-bus';
import { createNotificationQueue } from './notification-queue';
import { bootEnabledModules } from './module-boot';
const db = createDatabase({ path: '../../data/lensing.db' });
const dataBus = createDataBus();
const notifications = createNotificationQueue();
// Listen for ANY data bus message
dataBus.onMessage((msg) => {
    console.log('DATA BUS MESSAGE:', msg.channel, msg.plugin_id);
});
const logger = {
    debug: (msg, data) => console.log('[DEBUG]', msg, data ?? ''),
    info: (msg, data) => console.log('[INFO]', msg, data ?? ''),
    error: (msg, err) => console.error('[ERROR]', msg, err ?? ''),
};
console.log('Booting enabled modules...');
try {
    const modules = bootEnabledModules(db, { dataBus, notifications }, logger);
    console.log('Booted modules:', modules.map(m => m.id));
}
catch (err) {
    console.error('Boot failed:', err);
}
// Wait for async refreshes to complete
setTimeout(() => {
    console.log('\nData bus channels after 8s:', dataBus.getChannels());
    for (const ch of dataBus.getChannels()) {
        const latest = dataBus.getLatest(ch);
        console.log(`  ${ch}:`, latest ? 'has data' : 'null');
    }
    db.close();
    notifications.close();
    dataBus.close();
    process.exit(0);
}, 8000);
//# sourceMappingURL=__debug_boot.js.map