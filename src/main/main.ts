import { app, BrowserWindow, globalShortcut, Menu, ipcMain } from 'electron';
import Store from 'electron-store';
import { AppSettings, WindowSize, CameraDevice } from '@shared/types';
import { WindowManager } from './window-manager';
import { SettingsManager } from './settings-manager';
import { ErrorHandler } from './error-handler';

export class FloatingCamApp {
  private windowManager: WindowManager;
  private settingsManager: SettingsManager;
  private store: Store<AppSettings>;
  private errorHandler: ErrorHandler;

  constructor() {
    // Initialize error handling first
    this.errorHandler = ErrorHandler.getInstance();
    
    this.setupApp();
    this.store = new Store<AppSettings>({
      defaults: this.getDefaultSettings(),
    });
    this.settingsManager = new SettingsManager(this.store);
    this.windowManager = new WindowManager(this.settingsManager);
  }

  private setupApp(): void {
    // Handle app events
    app.whenReady().then(() => this.onReady());
    app.on('window-all-closed', this.onWindowAllClosed.bind(this));
    app.on('activate', this.onActivate.bind(this));
    app.on('before-quit', this.onBeforeQuit.bind(this));
    app.on('will-quit', this.onWillQuit.bind(this));

    // Security: Prevent new window creation
    app.on('web-contents-created', (_event, contents) => {
      contents.setWindowOpenHandler(({ url }) => {
        this.errorHandler.logWarn(`Blocked navigation to: ${url}`);
        return { action: 'deny' };
      });
    });

    // Handle protocol for deep links (future use)
    app.setAsDefaultProtocolClient('floating-cam');
  }

  private async onReady(): Promise<void> {
    try {
      this.errorHandler.logInfo('App ready, initializing...');
      
      // Create main window
      await this.windowManager.createMainWindow();
      
      // Setup global shortcuts
      this.setupGlobalShortcuts();
      
      // Setup IPC handlers
      this.setupIpcHandlers();
      
      // Remove default menu
      Menu.setApplicationMenu(null);
      
      // Hide dock icon on macOS
      if (process.platform === 'darwin') {
        app.dock.hide();
      }
      
      this.errorHandler.logInfo('App initialization complete');
    } catch (error) {
      this.errorHandler.logError('Failed to initialize app:', error);
      app.quit();
    }
  }

  private onWindowAllClosed(): void {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private onActivate(): void {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.windowManager.createMainWindow();
    }
  }

  private onBeforeQuit(): void {
    this.errorHandler.logInfo('App quitting...');
    this.windowManager.saveWindowState();
  }

  private onWillQuit(): void {
    // Unregister all shortcuts
    globalShortcut.unregisterAll();
  }

  private setupGlobalShortcuts(): void {
    const settings = this.settingsManager.getSettings();
    
    if (!settings.enableGlobalShortcuts) {
      return;
    }

    try {
      // Toggle DevTools
      globalShortcut.register('CommandOrControl+Alt+I', () => {
        this.windowManager.toggleDevTools();
      });

      // Refresh camera
      globalShortcut.register('CommandOrControl+Alt+R', () => {
        this.windowManager.refreshCamera();
      });

      // Toggle window visibility
      globalShortcut.register('CommandOrControl+Alt+T', () => {
        this.windowManager.toggleWindowVisibility();
      });

      this.errorHandler.logInfo('Global shortcuts registered');
    } catch (error) {
      this.errorHandler.logError('Failed to register global shortcuts:', error);
    }
  }

  private setupIpcHandlers(): void {
    // Window management
    ipcMain.handle('window:get-size', (): WindowSize | null => {
      return this.windowManager.getWindowSize();
    });

    ipcMain.handle('window:set-size', (_, size: WindowSize): boolean => {
      return this.windowManager.setWindowSize(size);
    });

    ipcMain.handle('window:minimize', (): void => {
      this.windowManager.minimizeWindow();
    });

    ipcMain.handle('window:close', (): void => {
      this.windowManager.closeWindow();
    });

    ipcMain.handle('window:toggle-always-on-top', (): boolean => {
      return this.windowManager.toggleAlwaysOnTop();
    });

    // Settings
    ipcMain.handle('settings:get', (): AppSettings => {
      return this.settingsManager.getSettings();
    });

    ipcMain.handle('settings:set', (_, settings: Partial<AppSettings>): void => {
      this.settingsManager.updateSettings(settings);
      this.windowManager.applySettings(this.settingsManager.getSettings());
    });

    ipcMain.handle('settings:reset', (): AppSettings => {
      const defaultSettings = this.getDefaultSettings();
      this.settingsManager.resetSettings();
      this.windowManager.applySettings(defaultSettings);
      return defaultSettings;
    });

    // Camera
    ipcMain.handle('camera:refresh', (): void => {
      this.windowManager.refreshCamera();
    });

    ipcMain.handle('camera:get-devices', async (): Promise<CameraDevice[]> => {
      // This would need to be implemented with proper device enumeration
      return [];
    });

    ipcMain.handle('camera:set-device', (_event, deviceId: string): void => {
      // Implementation for camera device switching
      this.errorHandler.logInfo(`Camera device changed to: ${deviceId}`);
    });

    // App
    ipcMain.handle('app:get-version', (): string => {
      return app.getVersion();
    });

    ipcMain.handle('app:quit', (): void => {
      app.quit();
    });

    ipcMain.handle('app:show-about', (): void => {
      // Show about dialog
      this.errorHandler.logInfo('About dialog requested');
    });
  }

  private getDefaultSettings(): AppSettings {
    return {
      flipped: true,
      circular: false,
      borderRadius: 16,
      opacity: 1,
      windowSize: { width: 360, height: 480 },
      startMinimized: false,
      enableGlobalShortcuts: true,
      autoStart: false,
      theme: 'auto',
    };
  }
}

// Initialize app
new FloatingCamApp();