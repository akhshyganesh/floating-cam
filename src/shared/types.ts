export interface WindowSize {
  width: number;
  height: number;
}

export interface CameraDevice {
  deviceId: string;
  label: string;
  kind: string;
}

export interface CameraSettings {
  flipped: boolean;
  circular: boolean;
  borderRadius: number;
  opacity: number;
  windowSize: WindowSize;
}

export interface AppSettings extends CameraSettings {
  startMinimized: boolean;
  enableGlobalShortcuts: boolean;
  autoStart: boolean;
  theme: 'dark' | 'light' | 'auto';
}

export interface IpcChannels {
  // Window management
  'window:get-size': () => Promise<WindowSize | null>;
  'window:set-size': (size: WindowSize) => Promise<boolean>;
  'window:minimize': () => Promise<void>;
  'window:close': () => Promise<void>;
  'window:toggle-always-on-top': () => Promise<boolean>;

  // Settings
  'settings:get': () => Promise<AppSettings>;
  'settings:set': (settings: Partial<AppSettings>) => Promise<void>;
  'settings:reset': () => Promise<AppSettings>;

  // Camera
  'camera:refresh': () => Promise<void>;
  'camera:get-devices': () => Promise<CameraDevice[]>;
  'camera:set-device': (deviceId: string) => Promise<void>;

  // App
  'app:get-version': () => Promise<string>;
  'app:quit': () => Promise<void>;
  'app:show-about': () => Promise<void>;
}

export type IpcChannelKeys = keyof IpcChannels;

export interface ElectronAPI {
  invoke<T extends IpcChannelKeys>(
    channel: T,
    ...args: Parameters<IpcChannels[T]>
  ): ReturnType<IpcChannels[T]>;
  
  // Event listeners
  onSettingsChanged: (callback: (settings: AppSettings) => void) => void;
  onCameraError: (callback: (error: string) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}