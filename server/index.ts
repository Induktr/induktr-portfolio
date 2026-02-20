import "./load-env";
import path from "path";
import { registerRoutes } from "./routes";

// Set default NODE_ENV if not provided
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

console.log(`🔧 Running in ${process.env.NODE_ENV} mode`);

import express, { 
  Request, 
  Response, 
  NextFunction 
} from "express";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import cors from "cors";
import apiRoutes from "./shared/api";

const app = express();
export { app };

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-CSRF-Token',
      'X-Client-Info',
      'apikey',
      'X-Supabase-Auth',
      'Access-Control-Allow-Origin',
    ],
    maxAge: 86400,
  })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

app.use('/api', apiRoutes);

import { botManager } from "./bot";

(async () => {
  const server = registerRoutes(app);

  // Telegram Webhook Endpoint
  app.post("/api/webhook/telegram", async (req, res) => {
    try {
      botManager.processUpdate(req.body);
      res.sendStatus(200);
    } catch (error) {
      console.error("Webhook Error:", error);
      res.sendStatus(500);
    }
  });

  // Initialize Telegram Bot (only once or when needed)
  if (process.env.TELEGRAM_BOT_TOKEN) {
    const isWebhook = !!process.env.TELEGRAM_WEBHOOK_URL;
    botManager.initialize(process.env.TELEGRAM_BOT_TOKEN, { polling: !isWebhook });
    
    // In Vercel/Production, we only set the webhook if it's not local development
    if (isWebhook && process.env.NODE_ENV === "production") {
      botManager.setWebHook(`${process.env.TELEGRAM_WEBHOOK_URL}/api/webhook/telegram`).catch(err => {
        console.error("Failed to set Telegram Webhook:", err);
      });
    }
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Server Error:`, err);
    
    if (res.headersSent) {
      return _next(err);
    }
    
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;
    
    res.status(status).json({
      success: false,
      message: message,
      error: {
        type: err.name || 'ServerError',
        ...(stack && { stack }),
        details: err.details || undefined,
      },
      timestamp
    });
  });

  app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = Number.parseInt(process.env.PORT || "5000", 10);
  if (process.env.VERCEL !== "1") {
    server.listen(PORT, "0.0.0.0", () => {
      log(`Server running on port ${PORT} in ${app.get("env")} mode`);
      log(`Telegram Bot Token: ${process.env.TELEGRAM_BOT_TOKEN ? "CONFIGURED ✅" : "MISSING ❌"}`);
      log(`Telegram Chat ID: ${process.env.TELEGRAM_CHAT_ID ? "CONFIGURED ✅" : "MISSING ❌"}`);
    });
  }
})();

export default app;