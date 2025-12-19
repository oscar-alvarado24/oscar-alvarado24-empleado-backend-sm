import * as crypto from 'crypto';
import { logger } from '../../infrastructure/config/logger';


export class CryptoService {
  private secretKey: Buffer;
  private algorithm = 'aes-256-gcm';

  constructor(secretKeyBase64: string) {
    this.secretKey = Buffer.from(secretKeyBase64, 'base64');
    
    if (this.secretKey.length !== 32) {
      throw new Error('La clave debe ser base64 de 32 bytes (256 bits)');
    }
  }

  async encrypt(data: string): Promise<string> {
    const iv = crypto.randomBytes(12);
    
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv) as crypto.CipherGCM;
    
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final()
    ]);
    
    const authTag = cipher.getAuthTag();
    
    const combined = Buffer.concat([iv, encrypted, authTag]);
    
    // Convertir a Base64 URL-safe (sin padding)
    return combined.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  async decrypt(encryptedData: string): Promise<string> {
    // Convertir de Base64 URL-safe a Base64 estándar
    let base64Standard = encryptedData
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Agregar padding si es necesario
    while (base64Standard.length % 4) {
      base64Standard += '=';
    }
    logger.debug(`data to decrypt: ${base64Standard}`);
    const combined = Buffer.from(base64Standard, 'base64');
    logger.debug(`data combined: ${combined}`);
    const iv = combined.subarray(0, 12);
    logger.debug(`iv: ${iv}`);
    const authTag = combined.subarray(combined.length - 16);
    logger.debug(`authTag: ${authTag}`);
    const encrypted = combined.subarray(12, combined.length - 16);
    logger.debug(`encrypted: ${encrypted}`);
    
    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv) as crypto.DecipherGCM;
    logger.debug(`decipher: ${decipher}`);
    decipher.setAuthTag(authTag);
    logger.debug(`decipher with AuthTag: ${decipher}`);
    
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    logger.debug(`decrypted: ${decrypted}`);
    const decryptedString= decrypted.toString('utf8');
    logger.debug(`Decrypted data: ${decryptedString}`);
    return decryptedString;
  }
}