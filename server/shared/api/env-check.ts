import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();
export default function handleEnvCheck(req: Request, res: Response) {
  try {
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      DATABASE_URL: process.env.DATABASE_URL || 'not set',
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || 'not set',
      MY_CHAT_ID: process.env.MY_CHAT_ID || 'not set',
      VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
      VERCEL_REGION: process.env.VERCEL_REGION || 'not set',
      VERCEL_URL: process.env.VERCEL_URL || 'not set',
      npm_package_version: process.env.npm_package_version || 'not set'
    };

    const serverInfo = {
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

    const missingEnvVars = [];
    if (!process.env.DATABASE_URL) missingEnvVars.push('DATABASE_URL');
    if (!process.env.TELEGRAM_BOT_TOKEN) missingEnvVars.push('TELEGRAM_BOT_TOKEN');
    if (!process.env.MY_CHAT_ID) missingEnvVars.push('MY_CHAT_ID');
    if (!process.env.VERCEL_ENV) missingEnvVars.push('VERCEL_ENV');
    if (!process.env.VERCEL_REGION) missingEnvVars.push('VERCEL_REGION');
    if (!process.env.VERCEL_URL) missingEnvVars.push('VERCEL_URL');
    if (!process.env.npm_package_version) missingEnvVars.push('npm_package_version');

    return res.status(200).json({
      success: true,
      message: 'Environment check completed',
      envInfo,
      serverInfo,
      health: {
        missingEnvVars,
        isHealthy: missingEnvVars.length === 0
      }
    });
  } catch (error) {
    if(error instanceof Error) {
      logWithTimestamp('error', 'Error during environment check', error);

      return res.status(500).json({
        success: false,
        message: 'Error during environment check',
        error: error.message || 'Unknown error'
      });
    }
  }
} 