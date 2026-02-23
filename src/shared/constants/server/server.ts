export const serverInfo = {
    timestamp: new Date().toISOString(),
    platform: process.platform,
    nodeVersion: process.version,
    uptimeSeconds: process.uptime(),
    memoryUsage: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB'
    }
};
