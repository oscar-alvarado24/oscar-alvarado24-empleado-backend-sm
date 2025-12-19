import { Request, Response, NextFunction } from 'express';
import { logger } from '../../../../config/logger';
// CORS Configuration
export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
   logger.debug('=== CORS DEBUG ===');
   logger.debug('Origin recibido:', origin);
   logger.debug('NODE_ENV:', process.env.NODE_ENV);
   logger.debug('==================');
    // Lista de dominios/patrones permitidos
    const allowedOrigins = [
      /^https:\/\/.*\.execute-api\.us-east-1\.amazonaws\.com$/,
      /^https?:\/\/.*\.elb\.us-east-1\.amazonaws\.com$/,
      /^https:\/\/.*\.amplifyapp\.com$/
    ];


    // En desarrollo, permite requests sin origin (Postman, curl, etc.)
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // Permite orígenes locales en desarrollo
    if (process.env.NODE_ENV === 'development' && origin ) {
      return callback(null, true);
    }

    // Verifica si el origin coincide con algún patrón de producción
    if (origin) {
      const isAllowed = allowedOrigins.some(allowed => {
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return allowed === origin;
      });

      if (isAllowed) {
        return callback(null, true);
      }
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Forwarded-For',
    'X-Real-IP',
  ],
  exposedHeaders: ['Accept'],
  maxAge: 86400,
};


export const corsDevOptions = {
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
  ],
};

export const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
};

const requestCounts = new Map();

export const simpleRateLimit = (
  windowMs: number = 15 * 60 * 1000,
  max: number = 100
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    if (requestCounts.has(clientIP)) {
      const requests = requestCounts.get(clientIP)!.filter((time: number) => time > windowStart);
      requestCounts.set(clientIP, requests);
    }

    const requests = requestCounts.get(clientIP) || [];

    if (requests.length >= max) {
      res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again later.`,
        retryAfter: Math.ceil(windowMs / 1000),
      });
      return;
    }

    requests.push(now);
    requestCounts.set(clientIP, requests);

    next();
  };
};