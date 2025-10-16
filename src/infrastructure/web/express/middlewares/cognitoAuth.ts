import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../../config/logger';

// Extender Request para incluir user info de Cognito
export interface CognitoAuthenticatedRequest extends Request {
  user?: {
    sub: string;           // User ID de Cognito
    'cognito:groups'?: string[];     // Grupos de Cognito
    username: string;
    iss: string;
    client_id: string;
    origin_jti: string;
    event_id: string;
    scope: string;
    auth_time: number;
    token_use: string;
    iat: number;
    exp: number;
    jti: string;
    [key: string]: any;
  };
}

// Configuración del verificador de Cognito
export class CognitoJWTManager {
  private static accessTokenVerifier: any;
  private static isInitialized = false;
  private static initializationError: string | null = null;

  // Inicialización explícita y síncrona
  static initialize(): void {
    if (this.isInitialized) return;

    logger.info('🚀 Initializing Cognito JWT verifiers...');
    const userPoolId = process.env.COGNITO_USER_POOL_ID;
    const clientId = process.env.COGNITO_CLIENT_ID;

    logger.debug('Cognito Config Check:', {
      userPoolId: userPoolId ? '✅ Set' : '❌ Missing',
      clientId: clientId ? '✅ Set' : '❌ Missing',
      nodeEnv: process.env.NODE_ENV
    });

    if (!userPoolId || !clientId) {
      const errorMsg = 'COGNITO_USER_POOL_ID and COGNITO_CLIENT_ID must be set in environment variables';
      this.initializationError = errorMsg;
      logger.error('❌ Cognito initialization failed:', errorMsg);
      throw new Error(errorMsg);
    }

    try {
      // Verificador para Access tokens
      this.accessTokenVerifier = CognitoJwtVerifier.create({
        userPoolId: userPoolId,
        tokenUse: 'access',
        clientId: clientId,
      });

      this.isInitialized = true;
      logger.info('✅ Cognito JWT verifiers initialized successfully', {
        userPoolId: userPoolId.substring(0, 10) + '...',
        clientId: clientId.substring(0, 10) + '...'
      });
    } catch (error: any) {
      this.initializationError = error.message;
      logger.error('❌ Cognito verifier creation failed:', error);
      throw error;
    }
  }

  // Verificar si está inicializado
  static checkInitialization(): void {
    if (!this.isInitialized && this.initializationError) {
      throw new Error(`CognitoJWTManager not initialized: ${this.initializationError}`);
    }
    if (!this.isInitialized) {
      throw new Error('CognitoJWTManager not initialized. Call initialize() first.');
    }
  }

  static async verifyAccessToken(token: string) {
    this.checkInitialization();

    try {
      const decoded = await this.accessTokenVerifier.verify(token);

      // Log seguro - solo información no sensible
      logger.info('✅ Token verified successfully', {
        tokenUse: decoded.token_use,
        username: decoded.username,
        clientId: decoded.client_id,
        issuer: decoded.iss,
        issuedAt: new Date(decoded.iat * 1000).toISOString(),
        expiresAt: new Date(decoded.exp * 1000).toISOString(),
        groups: decoded['cognito:groups'] || [],
        hasGroups: (decoded['cognito:groups'] || []).length > 0,
        groupCount: (decoded['cognito:groups'] || []).length
      });

      return decoded;
    } catch (error: any) {
      logger.warn('Access token verification failed:', error);

      if (error.message?.includes('expired')) {
        throw new Error('TOKEN_EXPIRED');
      } else if (error.message?.includes('invalid') || error.message?.includes('signature')) {
        throw new Error('INVALID_TOKEN');
      } else if (error.message?.includes('too early')) {
        throw new Error('TOKEN_NOT_ACTIVE');
      } else {
        throw new Error('COGNITO_VERIFICATION_FAILED');
      }
    }
  }

  // Método para obtener estado de inicialización
  static getStatus() {
    return {
      isInitialized: this.isInitialized,
      initializationError: this.initializationError,
      hasUserPoolId: !!process.env.COGNITO_USER_POOL_ID,
      hasClientId: !!process.env.COGNITO_CLIENT_ID,
    };
  }
}

// Inicialización inmediata al cargar el módulo
try {
  CognitoJWTManager.initialize();
} catch (error: any) {
  logger.error('Failed to initialize CognitoJWTManager during module load:', error.message);
}

export const authenticateCognitoToken = async (
  req: CognitoAuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Verificar que Cognito esté inicializado
    CognitoJWTManager.checkInitialization();

    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      res.status(401).json({
        error: 'Access Denied',
        message: 'No token provided',
        code: 'NO_TOKEN'
      });
      return;
    }

    const decoded = await CognitoJWTManager.verifyAccessToken(token);
    req.user = decoded;

    logger.info(`✅ Cognito user authenticated: ${decoded.username}`, {
      username: decoded.username,
      groups: decoded['cognito:groups'] || []
    });
    next();

  } catch (error: any) {
    logger.warn(`Cognito authentication failed: ${error.message}`);

    // Si hay error de inicialización, responder con error del servidor
    if (error.message.includes('not initialized')) {
      res.status(500).json({
        error: 'Server Configuration Error',
        message: 'Authentication service is not properly configured',
        code: 'AUTH_SERVICE_UNAVAILABLE'
      });
      return;
    }

    switch (error.message) {
      case 'TOKEN_EXPIRED':
        res.status(401).json({
          error: 'Token Expired',
          message: 'Token has expired, please login again',
          code: 'TOKEN_EXPIRED'
        });
        break;
      case 'INVALID_TOKEN':
        res.status(401).json({
          error: 'Invalid Token',
          message: 'Token is invalid or malformed',
          code: 'INVALID_TOKEN'
        });
        break;
      case 'TOKEN_NOT_ACTIVE':
        res.status(401).json({
          error: 'Token Not Active',
          message: 'Token is not yet valid',
          code: 'TOKEN_NOT_ACTIVE'
        });
        break;
      default:
        res.status(401).json({
          error: 'Authentication Failed',
          message: 'Could not verify token with Cognito',
          code: 'COGNITO_AUTH_FAILED'
        });
    }
  }
};

// Los demás métodos (requireCognitoGroup, excludeCognitoGroup) se mantienen igual...
export const requireCognitoGroup = (...groups: string[]) => {
  return (req: CognitoAuthenticatedRequest, res: Response, next: NextFunction): void => {
    logger.info(`🔐 Checking required Cognito groups: ${groups.join(', ')}`);
    logger.info(`User groups: ${req.user ? (req.user['cognito:groups'] || []).join(', ') : 'No user info'}`);
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication Required',
        message: 'You must be authenticated to access this resource',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    const userGroups = req.user['cognito:groups'] || [];
    const hasRequiredGroup = groups.some(group => userGroups.includes(group));

    if (!hasRequiredGroup) {
      logger.warn(`User ${req.user.username} lacks required groups`, {
        required: groups,
        userGroups: userGroups
      });

      res.status(403).json({
        error: 'Insufficient Permissions',
        message: `Access denied. Required groups (any of): ${groups.join(', ')}`,
        userGroups: userGroups,
        code: 'INSUFFICIENT_GROUPS'
      });
      return;
    }

    logger.info(`✅ User has required group access: ${userGroups.join(', ')}`);
    next();
  };
};

export const excludeCognitoGroup = (...groups: string[]) => {
  return (req: CognitoAuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication Required',
        message: 'You must be authenticated to access this resource',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    const userGroups = req.user['cognito:groups'] || [];
    const hasExcludedGroup = groups.some(group => userGroups.includes(group));

    if (hasExcludedGroup) {
      logger.warn(`User ${req.user.username} belongs to excluded group`, {
        excluded: groups,
        userGroups: userGroups
      });

      res.status(403).json({
        error: 'Access Denied',
        message: `Access denied. Excluded groups: ${groups.join(', ')}`,
        code: 'GROUP_EXCLUDED'
      });
      return;
    }

    next();
  };
};