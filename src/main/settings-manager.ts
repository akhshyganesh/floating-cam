import Store from 'electron-store';
import { AppSettings } from '@shared/types';
import { ErrorHandler } from './error-handler';

export class SettingsManager {
  private store: Store<AppSettings>;
  private errorHandler: ErrorHandler;

  constructor(store: Store<AppSettings>) {
    this.store = store;
    this.errorHandler = ErrorHandler.getInstance();
  }

  public getSettings(): AppSettings {
    try {
      return this.store.store;
    } catch (error) {
      this.errorHandler.logError('Failed to get settings:', error);
      return this.getDefaultSettings();
    }
  }

  public updateSettings(partialSettings: Partial<AppSettings>): void {
    try {
      this.store.set(partialSettings);
      this.errorHandler.logInfo('Settings updated:', partialSettings);
    } catch (error) {
      this.errorHandler.logError('Failed to update settings:', error);
    }
  }

  public resetSettings(): void {
    try {
      this.store.clear();
      this.errorHandler.logInfo('Settings reset to defaults');
    } catch (error) {
      this.errorHandler.logError('Failed to reset settings:', error);
    }
  }

  public getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
    try {
      return this.store.get(key);
    } catch (error) {
      this.errorHandler.logError(`Failed to get setting ${String(key)}:`, error);
      return this.getDefaultSettings()[key];
    }
  }

  public setSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): void {
    try {
      this.store.set(key, value);
      this.errorHandler.logInfo(`Setting ${String(key)} updated:`, value);
    } catch (error) {
      this.errorHandler.logError(`Failed to set setting ${String(key)}:`, error);
    }
  }

  public exportSettings(): AppSettings {
    return this.getSettings();
  }

  public importSettings(settings: Partial<AppSettings>): void {
    try {
      // Validate settings before importing
      const validatedSettings = this.validateSettings(settings);
      this.store.set(validatedSettings);
      this.errorHandler.logInfo('Settings imported successfully');
    } catch (error) {
      this.errorHandler.logError('Failed to import settings:', error);
    }
  }

  private validateSettings(settings: Partial<AppSettings>): Partial<AppSettings> {
    const validated: Partial<AppSettings> = {};

    // Validate each setting
    if (typeof settings.flipped === 'boolean') {
      validated.flipped = settings.flipped;
    }

    if (typeof settings.circular === 'boolean') {
      validated.circular = settings.circular;
    }

    if (
      typeof settings.borderRadius === 'number' &&
      settings.borderRadius >= 0 &&
      settings.borderRadius <= 50
    ) {
      validated.borderRadius = settings.borderRadius;
    }

    if (
      typeof settings.opacity === 'number' &&
      settings.opacity >= 0.1 &&
      settings.opacity <= 1
    ) {
      validated.opacity = settings.opacity;
    }

    if (settings.windowSize && typeof settings.windowSize === 'object') {
      const { width, height } = settings.windowSize;
      if (
        typeof width === 'number' &&
        typeof height === 'number' &&
        width >= 160 &&
        width <= 1600 &&
        height >= 160 &&
        height <= 1600
      ) {
        validated.windowSize = { width, height };
      }
    }

    if (typeof settings.startMinimized === 'boolean') {
      validated.startMinimized = settings.startMinimized;
    }

    if (typeof settings.enableGlobalShortcuts === 'boolean') {
      validated.enableGlobalShortcuts = settings.enableGlobalShortcuts;
    }

    if (typeof settings.autoStart === 'boolean') {
      validated.autoStart = settings.autoStart;
    }

    if (
      typeof settings.theme === 'string' &&
      ['dark', 'light', 'auto'].includes(settings.theme)
    ) {
      validated.theme = settings.theme as 'dark' | 'light' | 'auto';
    }

    return validated;
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