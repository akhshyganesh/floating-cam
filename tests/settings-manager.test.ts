import { SettingsManager } from '../src/main/settings-manager';
import Store from 'electron-store';
import { AppSettings } from '../src/shared/types';

// Mock electron-store
jest.mock('electron-store');
const MockedStore = Store as jest.MockedClass<typeof Store>;

// Mock ErrorHandler
jest.mock('../src/main/error-handler', () => ({
  ErrorHandler: {
    getInstance: jest.fn(() => ({
      logInfo: jest.fn(),
      logError: jest.fn(),
      logWarn: jest.fn(),
      logDebug: jest.fn(),
    })),
  },
}));

describe('SettingsManager', () => {
  let settingsManager: SettingsManager;
  let mockStore: jest.Mocked<Store<AppSettings>>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockStore = {
      store: {
        flipped: true,
        circular: false,
        borderRadius: 16,
        opacity: 1,
        windowSize: { width: 360, height: 480 },
        startMinimized: false,
        enableGlobalShortcuts: true,
        autoStart: false,
        theme: 'auto' as const,
      },
      get: jest.fn(),
      set: jest.fn(),
      clear: jest.fn(),
    } as any;

    MockedStore.mockImplementation(() => mockStore);
    settingsManager = new SettingsManager(mockStore);
  });

  describe('getSettings', () => {
    it('should return settings from store', () => {
      const settings = settingsManager.getSettings();
      expect(settings).toEqual(mockStore.store);
    });

    it('should return default settings on error', () => {
      mockStore.store = undefined as any;
      Object.defineProperty(mockStore, 'store', {
        get: () => {
          throw new Error('Store error');
        },
      });

      const settings = settingsManager.getSettings();
      expect(settings).toEqual({
        flipped: true,
        circular: false,
        borderRadius: 16,
        opacity: 1,
        windowSize: { width: 360, height: 480 },
        startMinimized: false,
        enableGlobalShortcuts: true,
        autoStart: false,
        theme: 'auto',
      });
    });
  });

  describe('updateSettings', () => {
    it('should update settings in store', () => {
      const partialSettings = { flipped: false, opacity: 0.8 };
      settingsManager.updateSettings(partialSettings);
      expect(mockStore.set).toHaveBeenCalledWith(partialSettings);
    });
  });

  describe('resetSettings', () => {
    it('should clear the store', () => {
      settingsManager.resetSettings();
      expect(mockStore.clear).toHaveBeenCalled();
    });
  });

  describe('validateSettings', () => {
    it('should validate and filter valid settings', () => {
      const invalidSettings = {
        flipped: false,
        borderRadius: 100, // Invalid: > 50
        opacity: 2, // Invalid: > 1
        windowSize: { width: 100, height: 200 }, // Invalid: width < 160
        theme: 'invalid' as any, // Invalid theme
      };

      settingsManager.importSettings(invalidSettings);

      expect(mockStore.set).toHaveBeenCalledWith({
        flipped: false,
        // borderRadius, opacity, windowSize, theme should be filtered out
      });
    });
  });
});