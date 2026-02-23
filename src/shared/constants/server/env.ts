export const envInfo = {
    NODE_ENV: process.env.NODE_ENV || 'not set',
    DATABASE_URL: process.env.DATABASE_URL || 'not set',
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || 'not set',
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || 'not set',
    VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
    VERCEL_REGION: process.env.VERCEL_REGION || 'not set',
    VERCEL_URL: process.env.VERCEL_URL || 'not set',
    npm_package_version: process.env.npm_package_version || 'not set'
};
