import { Request, Response, NextFunction } from 'express';

// CORS Configuration
export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Lista de dominios permitidos
    const allowedOrigins = [
      'http://localhost:3000',     // React dev
      'http://localhost:3001',     // Otro puerto local
      'http://localhost:4200',     // Angular dev
      'https://tu-frontend.com',   // Producción
      'https://tu-app.vercel.app', // Vercel
      // Agrega más según necesites
    ];

    // En desarrollo, permite requests sin origin (Postman, etc.)
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permite cookies y headers de auth
  optionsSuccessStatus: 200, // Para IE11
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
  ],
  exposedHeaders: ['Authorization'], // Headers que el frontend puede leer
};

// CORS más permisivo para desarrollo
export const corsDevOptions = {
  origin: true, // Permite cualquier origen
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
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

// Helmet configuration para seguridad adicional
export const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false, // Puede causar problemas con algunos frontends
};

// Rate limiting middleware simple
const requestCounts = new Map();

export const simpleRateLimit = (
  windowMs: number = 15 * 60 * 1000, // 15 minutos
  max: number = 100 // max requests por ventana
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - windowMs;

    // Limpiar requests antiguos
    if (requestCounts.has(clientIP)) {
      const requests = requestCounts.get(clientIP)!.filter((time: number) => time > windowStart);
      requestCounts.set(clientIP, requests);
    }

    // Obtener requests actuales
    const requests = requestCounts.get(clientIP) || [];

    if (requests.length >= max) {
      res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again later.`,
        retryAfter: Math.ceil(windowMs / 1000),
      });
      return;
    }

    // Agregar request actual
    requests.push(now);
    requestCounts.set(clientIP, requests);

    next();
  };
};