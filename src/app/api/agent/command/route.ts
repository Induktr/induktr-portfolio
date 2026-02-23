import { NextResponse, NextRequest } from "next/server";
import { botManager } from "@/features/telegram-bot/index";
import { storage } from "@/shared/api/database/storage";

const verifyAgent = (req: NextRequest) => {
  const secret = req.headers.get('x-agent-secret');
  const expectedSecret = process.env.AGENT_SECRET_KEY;

  if (!expectedSecret || secret !== expectedSecret) {
    return false;
  }
  return true;
};

export async function POST(req: NextRequest) {
  if (!verifyAgent(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized agent access' }, { status: 401 });
  }

  try {
    const { command, params } = await req.json();

    switch (command) {
      case 'notify':
        if (!params.chatId || !params.message) {
          return NextResponse.json({ success: false, message: 'Missing chatId or message' }, { status: 400 });
        }
        if (process.env.TELEGRAM_BOT_TOKEN) {
           botManager.initialize(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
        }
        await botManager.sendNotification(params.chatId, params.message);
        return NextResponse.json({ success: true, message: `Notification sent to ${params.chatId}` });

      case 'broadcast':
        if (!params.message) {
          return NextResponse.json({ success: false, message: 'Missing message' }, { status: 400 });
        }
        if (process.env.TELEGRAM_BOT_TOKEN) {
           botManager.initialize(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
        }
        const allChatIds = await storage.getAllChatIds();
        
        const results = await Promise.allSettled(
          allChatIds.map((id: string) => botManager.sendNotification(id, params.message))
        );
        
        const successCount = results.filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled').length;
        return NextResponse.json({ 
          success: true, 
          message: `Broadcast sent. Successful: ${successCount}/${allChatIds.length}` 
        });

      case 'status':
        const leadsCount = (await storage.getAllLeads()).length;
        const usersCount = await storage.getUsersCount();
        const activeChats = (await storage.getAllChatIds()).length;
        
        return NextResponse.json({
          success: true,
          data: {
            leads: leadsCount,
            admins: usersCount,
            activeBotUsers: activeChats,
            uptime: process.uptime(),
            nodeVersion: process.version,
            memory: process.memoryUsage()
          }
        });

      default:
        return NextResponse.json({ success: false, message: `Unknown command: ${command}` }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to execute command', 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
