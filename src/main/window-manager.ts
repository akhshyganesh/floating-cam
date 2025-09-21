import { BrowserWindow } from 'electron';
import * as path from 'path';
import { AppSettings, WindowSize } from '@shared/types';
import { SettingsManager } from './settings-manager';
import { ErrorHandler } from './error-handler';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  private settingsManager: SettingsManager;
  private errorHandler: ErrorHandler;

  constructor(settingsManager: SettingsManager) {
    this.settingsManager = settingsManager;
    this.errorHandler = ErrorHandler.getInstance();
  }

  public async createMainWindow(): Promise<BrowserWindow> {
    const settings = this.settingsManager.getSettings();

    const windowOptions: Electron.BrowserWindowConstructorOptions = {
      width: settings.windowSize.width,
      height: settings.windowSize.height,
      minWidth: 160,
      minHeight: 160,
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      resizable: true,
      hasShadow: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        webSecurity: true,
        allowRunningInsecureContent: false,
        experimentalFeatures: false,
      },
      show: !settings.startMinimized,
    };

    // Add macOS specific options
    if (process.platform === 'darwin') {
      windowOptions.vibrancy = 'under-window';
      windowOptions.visualEffectState = 'active';
    }

    this.mainWindow = new BrowserWindow(windowOptions);

    // Set window properties
    this.mainWindow.setAlwaysOnTop(true, 'screen-saver');
    this.mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

    // Load the renderer - HTML file is in parent dist directory
    await this.mainWindow.loadFile(path.join(__dirname, '..', 'index.html'));

    // Setup window event handlers
    this.setupWindowEvents();

    // Apply initial settings
    this.applySettings(settings);

    this.errorHandler.logInfo('Main window created successfully');
    return this.mainWindow;
  }

  private setupWindowEvents(): void {
    if (!this.mainWindow) return;

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    this.mainWindow.on('resize', () => {
      this.saveWindowState();
    });

    this.mainWindow.on('move', () => {
      this.saveWindowState();
    });

    // Prevent navigation
    this.mainWindow.webContents.on('will-navigate', (event, url) => {
      if (!url.startsWith('file://')) {
        event.preventDefault();
        this.errorHandler.logWarn(`Blocked navigation to: ${url}`);
      }
    });
  }

  public getWindowSize(): WindowSize | null {
    if (!this.mainWindow) return null;
    const [width, height] = this.mainWindow.getSize();
    return { width, height };
  }

  public setWindowSize(size: WindowSize): boolean {
    if (!this.mainWindow) return false;

    try {
      const width = Math.max(160, Math.min(1600, Math.floor(size.width)));
      const height = Math.max(160, Math.min(1600, Math.floor(size.height)));
      
      this.mainWindow.setSize(width, height, true);
      
      // Update settings
      this.settingsManager.updateSettings({
        windowSize: { width, height },
      });
      
      return true;
    } catch (error) {
      this.errorHandler.logError('Failed to set window size:', error);
      return false;
    }
  }

  public minimizeWindow(): void {
    if (this.mainWindow && !this.mainWindow.isMinimized()) {
      this.mainWindow.minimize();
    }
  }

  public closeWindow(): void {
    if (this.mainWindow) {
      this.mainWindow.close();
    }
  }

  public toggleAlwaysOnTop(): boolean {
    if (!this.mainWindow) return false;
    
    const isAlwaysOnTop = this.mainWindow.isAlwaysOnTop();
    this.mainWindow.setAlwaysOnTop(!isAlwaysOnTop, 'screen-saver');
    return !isAlwaysOnTop;
  }

  public toggleDevTools(): void {
    if (!this.mainWindow) return;
    
    if (this.mainWindow.webContents.isDevToolsOpened()) {
      this.mainWindow.webContents.closeDevTools();
    } else {
      this.mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  }

  public refreshCamera(): void {
    if (this.mainWindow) {
      this.mainWindow.webContents.reloadIgnoringCache();
    }
  }

  public toggleWindowVisibility(): void {
    if (!this.mainWindow) return;
    
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.mainWindow.show();
    }
  }

  public applySettings(settings: AppSettings): void {
    if (!this.mainWindow) return;

    try {
      // Apply window size
      if (settings.windowSize) {
        this.setWindowSize(settings.windowSize);
      }

      // Send settings to renderer
      this.mainWindow.webContents.send('settings-changed', settings);
      
      this.errorHandler.logInfo('Settings applied to window');
    } catch (error) {
      this.errorHandler.logError('Failed to apply settings:', error);
    }
  }

  public saveWindowState(): void {
    if (!this.mainWindow) return;

    try {
      const size = this.getWindowSize();
      if (size) {
        this.settingsManager.updateSettings({ windowSize: size });
      }
    } catch (error) {
      this.errorHandler.logError('Failed to save window state:', error);
    }
  }

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }
}