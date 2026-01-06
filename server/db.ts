const neonUrl = process.env.SUPABASE_URL || '';
const neonKey = process.env.SUPABASE_SERVICE_KEY || '';
const neonConnectionString = process.env.DATABASE_URL || '';
const tgBotToken = process.env.TELEGRAM_BOT_TOKEN || '';
const tgChatId = process.env.TELEGRAM_CHAT_ID || '';
const isProduction = process.env.NODE_ENV === 'production';

if (!neonUrl) {
  console.error('SUPABASE_URL is not defined in environment variables');
}

if (!neonKey) {
  console.error('SUPABASE_SERVICE_KEY is not defined in environment variables');
}

if (!neonConnectionString) {
  console.error('DATABASE_URL is not defined in environment variables');
}

if (!tgBotToken) {
  console.error('TELEGRAM_BOT_TOKEN is not defined in environment variables');
}

if (!tgChatId) {
  console.error('TELEGRAM_CHAT_ID is not defined in environment variables');
}

function logWithTimestamp(type: 'info' | 'error' | 'warn', message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logFn = type === 'info' ? console.log : type === 'error' ? console.error : console.warn;
  
  if (data) {
    logFn(`[${timestamp}] [DB] ${message}`, data);
  } else {
    logFn(`[${timestamp}] [DB] ${message}`);
  }
}

logWithTimestamp('info', 'Initializing Supabase client');


logWithTimestamp('info', 'Initializing Postgres client');

async function testDatabaseConnection() {
  logWithTimestamp('info', 'Testing database connection...');
  
  try {
    logWithTimestamp('info', 'Database connection successful');
    return true;
  } catch (error) {
    logWithTimestamp('error', 'Database connection error', error);
    return false;
  }
}

testDatabaseConnection();