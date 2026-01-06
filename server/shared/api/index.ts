import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import handleEnvCheck from './env-check';
import handleSendLead from './send-lead';
import { log } from '../logger';

const logWithTimestamp = (level: string, message: string, error?: any) => {
  log(`${level.toUpperCase()}: ${message} ${error ? JSON.stringify(error) : ''}`, 'API');
};

const router = Router();

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    logWithTimestamp('error', `JSON Parse Error: ${err.message}`);
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
      error: err.message
    });
  }
  next(err);
});

router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

router.get('/env-check', handleEnvCheck);

router.post('/send-lead', handleSendLead);

router.get('/env-info', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || 'development',
    platform: process.platform,
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  });
});

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

const wrapAsync = (router: Router) => {
  const methods = ['get', 'post', 'put', 'delete', 'patch'];
  
  methods.forEach(method => {
    const original = (router as any)[method];
    (router as any)[method] = function(path: string, ...handlers: Function[]) {
      const wrappedHandlers = handlers.map(handler => 
        typeof handler === 'function' ? asyncHandler(handler) : handler
      );
      return original.call(this, path, ...wrappedHandlers);
    };
  });
  
  return router;
};

wrapAsync(router);

router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logWithTimestamp('error', `API Error: ${err.message}`, err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal API Error';
  
  res.status(status).json({
    success: false,
    message,
    error: {
      type: err.name || 'APIError',
      details: err.details || undefined,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString()
  });
});

export default router; 