import { Router, Request, Response } from 'express';
import { botManager } from '../../bot';
import { storage } from '../../storage';
import { log } from '../../vite';

const router = Router();

// Middleware for Agent secret verification
const verifyAgent = (req: Request, res: Response, next: any) => {
  const secret = req.headers['x-agent-secret'];
  const expectedSecret = process.env.AGENT_SECRET_KEY;

  if (!expectedSecret || secret !== expectedSecret) {
    log(`Unauthorized agent access attempt from ${req.ip}`, 'AgentBridge');
    return res.status(401).json({ success: false, message: 'Unauthorized agent access' });
  }
  next();
};

/**
 * COMMANDS:
 * - "notify": { "chatId": string, "message": string }
 * - "broadcast": { "message": string }
 * - "status": {}
 */
router.post('/command', verifyAgent, async (req: Request, res: Response) => {
  const { command, params } = req.body;

  log(`Received command from agent: ${command}`, 'AgentBridge');

  try {
    switch (command) {
      case 'notify':
        if (!params.chatId || !params.message) {
          return res.status(400).json({ success: false, message: 'Missing chatId or message for notify command' });
        }
        await botManager.sendNotification(params.chatId, params.message);
        return res.json({ success: true, message: `Notification sent to ${params.chatId}` });

      case 'broadcast':
        if (!params.message) {
          return res.status(400).json({ success: false, message: 'Missing message for broadcast command' });
        }
        const allChatIds = await storage.getAllChatIds();
        log(`Broadcasting message to ${allChatIds.length} users`, 'AgentBridge');
        
        // Use Promise.allSetled to continue even if some fails
        const results = await Promise.allSettled(
          allChatIds.map(id => botManager.sendNotification(id, params.message))
        );
        
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        return res.json({ 
          success: true, 
          message: `Broadcast message sent. Successful: ${successCount}/${allChatIds.length}` 
        });

      case 'status':
        const leadsCount = (await storage.getAllLeads()).length;
        const usersCount = await storage.getUsersCount();
        const activeChats = (await storage.getAllChatIds()).length;
        
        return res.json({
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
        return res.status(400).json({ success: false, message: `Unknown command: ${command}` });
    }
  } catch (error) {
    log(`Command error: ${error}`, 'AgentBridge');
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to execute command', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
});

export default router;
