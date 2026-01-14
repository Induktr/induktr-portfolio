import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { envInfo } from '../constants/env';
import { serverInfo } from '../constants/server';

dotenv.config();
export const handleEnvCheck = (req: Request, res: Response) => {
  try {
    const missingEnvVars = [];
    if (!process.env.DATABASE_URL) missingEnvVars.push('DATABASE_URL');
    if (!process.env.TELEGRAM_BOT_TOKEN) missingEnvVars.push('TELEGRAM_BOT_TOKEN');
    if (!process.env.TELEGRAM_CHAT_ID) missingEnvVars.push('TELEGRAM_CHAT_ID');
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
      console.error('Error during environment check:', error);

      return res.status(500).json({
        success: false,
        message: 'Error during environment check',
        error: error.message || 'Unknown error'
      });
    }
  }
} 