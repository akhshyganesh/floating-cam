import { contextBridge, ipcRenderer } from 'electron';
import { ElectronAPI, AppSettings, IpcChannels, IpcChannelKeys } from '@shared/types';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  invoke<T extends IpcChannelKeys>(
    channel: T,
    ...args: Parameters<IpcChannels[T]>
  ): ReturnType<IpcChannels[T]> {
    // @ts-expect-error - ipcRenderer.invoke returns Promise<any> but our typed interface expects specific Promise types
    return ipcRenderer.invoke(channel, ...args);
  },

  onSettingsChanged: (callback: (settings: AppSettings) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, settings: AppSettings) => {
      callback(settings);
    };
    ipcRenderer.on('settings-changed', subscription);
    
    // Return unsubscribe function
    return () => ipcRenderer.removeListener('settings-changed', subscription);
  },

  onCameraError: (callback: (error: string) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, error: string) => {
      callback(error);
    };
    ipcRenderer.on('camera-error', subscription);
    
    // Return unsubscribe function
    return () => ipcRenderer.removeListener('camera-error', subscription);
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', electronAPI);
  } catch (error) {
    console.error('Failed to expose electronAPI:', error);
  }
} else {
  // @ts-ignore (define in dts file)
  window.electronAPI = electronAPI;
}