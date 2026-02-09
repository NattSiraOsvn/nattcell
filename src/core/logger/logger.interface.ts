/**
 * LOGGER INTERFACE - NATT-OS
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  context?: string;
  trace_id?: string;
  data?: Record<string, unknown>;
}

export interface ILogger {
  debug(message: string, data?: Record<string, unknown>): void;
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, error?: Error, data?: Record<string, unknown>): void;
  fatal(message: string, error?: Error, data?: Record<string, unknown>): void;
  
  setContext(context: string): ILogger;
  setTraceId(traceId: string): ILogger;
}
