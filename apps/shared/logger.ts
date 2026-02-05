
/**
 * 📝 SHARED LOGGER - OMEGA STANDARD
 */
export class Logger {
  private serviceName: string;

  constructor(service: string) {
    this.serviceName = service;
  }

  private log(level: 'INFO' | 'WARN' | 'ERROR' | 'SECURE', message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      service: this.serviceName,
      message,
      ...meta,
      correlationId: (window as any).currentCorrelationId || 'N/A'
    };

    const colorMap = {
      INFO: 'color: #3b82f6',
      WARN: 'color: #f59e0b',
      ERROR: 'color: #ef4444; font-weight: bold',
      SECURE: 'color: #10b981; font-weight: bold'
    };

    console.log(`%c[${timestamp}] [${level}] [${this.serviceName}] ${message}`, colorMap[level], meta || '');
    
    // Trong thực tế, push logs về Shard Logging (Team 3)
    return logEntry;
  }

  info(msg: string, meta?: any) { return this.log('INFO', msg, meta); }
  warn(msg: string, meta?: any) { return this.log('WARN', msg, meta); }
  error(msg: string, meta?: any) { return this.log('ERROR', msg, meta); }
  secure(msg: string, meta?: any) { return this.log('SECURE', msg, meta); }
}

export const logger = new Logger('team2-shared');
