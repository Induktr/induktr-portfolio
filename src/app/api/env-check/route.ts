import { NextResponse } from "next/server";

export async function GET() {
  try {
    const missingEnvVars = [];
    if (!process.env.DATABASE_URL) missingEnvVars.push('DATABASE_URL');
    if (!process.env.TELEGRAM_BOT_TOKEN) missingEnvVars.push('TELEGRAM_BOT_TOKEN');
    if (!process.env.TELEGRAM_CHAT_ID) missingEnvVars.push('TELEGRAM_CHAT_ID');
    
    // In Vercel, these are usually provided
    if (!process.env.VERCEL_ENV) missingEnvVars.push('VERCEL_ENV');

    return NextResponse.json({
      success: true,
      message: 'Environment check completed',
      environment: process.env.NODE_ENV,
      health: {
        missingEnvVars,
        isHealthy: missingEnvVars.length === 0
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Error during environment check',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
