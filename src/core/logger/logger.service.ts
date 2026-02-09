/**
 * LOGGER SERVICE - NATT-OS
 */

import { ILogger, LogLevel, LogEntry } from './logger.interface';

export class LoggerService implements ILogger {
  private context?: string;
  private traceId?: string;
  
  constructor(context?: string) {
    this.context = context;
  }
  
  setContext(context: string): ILogger {
    const logger = new LoggerService(context);
    logger.traceId = this.traceId;
    return logger;
  }
  
  setTraceId(traceId: string): ILogger {
    const logger = new LoggerService(this.context);
    logger.traceId = traceId;
    return logger;
  }
  
  debug(message: string, data?: Record<string, unknown>): void {
    this.log('DEBUG', message, data);
  }
  
  info(message: string, data?: Record<string, unknown>): void {
    this.log('INFO', message, data);
  }
  
  warn(message: string, data?: Record<string, unknown>): void {
    this.log('WARN', message, data);
  }
  
  error(message: string, error?: Error, data?: Record<string, unknown>): void {
    this.log('ERROR', message, { ...data, error: error?.message, stack: error?.stack });
  }
  
  fatal(message: string, error?: Error, data?: Record<string, unknown>): void {
    this.log('FATAL', message, { ...data, error: error?.message, stack: error?.stack });
  }
  
  private log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      context: this.context,
      trace_id: this.traceId,
      data,
    };
    
    const prefix = `[${new Date(entry.timestamp).toISOString()}] [${level}]`;
    const ctx = this.context ? ` [${this.context}]` : '';
    const trace = this.traceId ? ` [${this.traceId}]` : '';
    
    const output = `${prefix}${ctx}${trace} ${message}`;
    
    switch (level) {
      case 'DEBUG':
        console.debug(output, data || '');
        break;
      case 'INFO':
        console.info(output, data || '');
        break;
      case 'WARN':
        console.warn(output, data || '');
        break;
      case 'ERROR':
      case 'FATAL':
        console.error(output, data || '');
        break;
    }
  }
}

export const logger = new LoggerService('NATT-OS');
