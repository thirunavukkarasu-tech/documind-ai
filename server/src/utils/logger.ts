import { env } from '../config/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const COLORS = {
  debug: '\x1b[36m',   // Cyan
  info: '\x1b[32m',    // Green
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  reset: '\x1b[0m',
};

class Logger {
  private minLevel: number;

  constructor() {
    this.minLevel = LOG_LEVELS[env.LOG_LEVEL];
  }

  private formatLog(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(data && { data }),
    };
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (LOG_LEVELS[level] < this.minLevel) {
      return;
    }

    const entry = this.formatLog(level, message, data);
    const color = COLORS[level];
    const reset = COLORS.reset;

    console.log(
      `${color}[${entry.timestamp}] [${level.toUpperCase()}]${reset} ${message}`,
      data ? JSON.stringify(data, null, 2) : ''
    );
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: unknown): void {
    if (error instanceof Error) {
      this.log('error', message, {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      this.log('error', message, error);
    }
  }
}

export const logger = new Logger();
