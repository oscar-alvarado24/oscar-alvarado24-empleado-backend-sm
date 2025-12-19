import { createLogger, format, transports } from 'winston';

const getLogLevel = (): string => {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'prod':
      return 'info';
    case 'staging':
      return 'warn';
    case 'test':
      return 'error';
    case 'development':
    default:
      return 'debug';
  }
};

export const logger = createLogger({
  level: getLogLevel(),
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});
