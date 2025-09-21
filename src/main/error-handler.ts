import * as log from 'electron-log';
import { app } from 'electron';
import * as path from 'path';

export class ErrorHandler {
  private static instance: ErrorHandler;

  private constructor() {
    this.setupLogging();
    this.setupErrorHandlers();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupLogging(): void {
    // Configure file logging
    log.transports.file.level = 'info';
    log.transports.file.maxSize = 5 * 1024 * 1024; // 5MB
    log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
    
    // Set log file location
    const userDataPath = app.getPath('userData');
    log.transports.file.file = path.join(userDataPath, 'logs', 'floating-cam.log');

    // Configure console logging
    log.transports.console.level = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
    log.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';

    // Log app startup
    log.info('='.repeat(50));
    log.info(`Floating Cam v${app.getVersion()} starting...`);
    log.info(`Platform: ${process.platform} ${process.arch}`);
    log.info(`Node: ${process.version}`);
    log.info(`Electron: ${process.versions.electron}`);
    log.info(`Chrome: ${process.versions.chrome}`);
    log.info('='.repeat(50));
  }

  private setupErrorHandlers(): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      log.error('Uncaught Exception:', error);
      this.handleCriticalError(error, 'uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      log.error('Unhandled Rejection at:', promise, 'reason:', reason);
      this.handleCriticalError(reason, 'unhandledRejection');
    });

    // Handle Electron specific errors
    app.on('render-process-gone', (_event, webContents, details) => {
      log.error('Renderer process gone:', {
        reason: details.reason,
        exitCode: details.exitCode,
        url: webContents.getURL(),
      });
    });

    app.on('child-process-gone', (_event, details) => {
      log.error('Child process gone:', {
        type: details.type,
        reason: details.reason,
        exitCode: details.exitCode,
        serviceName: details.serviceName,
        name: details.name,
      });
    });

    // Handle GPU process crashes
    app.on('gpu-process-crashed', (_event, killed) => {
      log.error('GPU process crashed:', { killed });
    });
  }

  private handleCriticalError(error: any, type: string): void {
    log.error(`Critical error (${type}):`, error);

    // In production, you might want to:
    // 1. Send crash reports to a service
    // 2. Show a user-friendly error dialog
    // 3. Attempt to restart the app gracefully

    if (process.env.NODE_ENV === 'production') {
      // Graceful shutdown
      setTimeout(() => {
        app.quit();
      }, 1000);
    }
  }

  public logInfo(message: string, ...args: any[]): void {
    log.info(message, ...args);
  }

  public logError(message: string, error?: any): void {
    log.error(message, error);
  }

  public logWarn(message: string, ...args: any[]): void {
    log.warn(message, ...args);
  }

  public logDebug(message: string, ...args: any[]): void {
    log.debug(message, ...args);
  }
}