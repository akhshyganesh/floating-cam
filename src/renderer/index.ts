/// <reference lib="dom" />
import './styles.css';
import { AppSettings } from '@shared/types';

class FloatingCamRenderer {
  private videoElement: HTMLVideoElement;
  private currentStream: MediaStream | null = null;
  private settings: AppSettings;
  private isResizing = false;

  // UI Elements
  private elements: { [key: string]: HTMLElement } = {};

  constructor() {
    this.initializeElements();
    
    // Initialize with default settings first
    this.settings = this.getDefaultSettings();
    
    // Get video element
    this.videoElement = this.elements.video as HTMLVideoElement;
    if (!this.videoElement) {
      throw new Error('Video element not found');
    }
    
    this.setupEventListeners();
    
    // Load settings and initialize camera asynchronously
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.loadSettings();
    await this.initializeCamera();
  }

  private initializeElements(): void {
    const elementIds = [
      'video', 'toggleBtn', 'closeOverlayBtn', 'controlsOverlay',
      'flipBtn', 'circleBtn', 'opacityBtn', 'settingsBtn',
      'radiusRange', 'radiusValue', 'sizePanel', 'widthInput',
      'heightInput', 'applySizeBtn', 'resizeHandle', 'errorMessage',
      'retryBtn', 'advancedPanel', 'globalShortcuts', 'autoStart',
      'themeSelect', 'exportBtn', 'importBtn', 'resetBtn'
    ];

    elementIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        this.elements[id] = element;
      } else {
        console.warn(`Element with ID '${id}' not found`);
      }
    });

    // Verify critical elements exist
    if (!this.elements.video) {
      throw new Error('Critical element "video" not found in DOM');
    }
  }

  private async loadSettings(): Promise<void> {
    try {
      this.settings = await window.electronAPI.invoke('settings:get');
      this.applySettings();
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Keep using default settings already initialized
    }
  }

  private setupEventListeners(): void {
    // Control overlay
    this.elements.toggleBtn?.addEventListener('click', () => this.showControls());
    this.elements.closeOverlayBtn?.addEventListener('click', () => this.hideControls());
    this.elements.controlsOverlay?.addEventListener('click', (e) => {
      if (e.target === this.elements.controlsOverlay) {
        this.hideControls();
      }
    });

    // Camera controls
    this.elements.flipBtn?.addEventListener('click', () => this.toggleFlip());
    this.elements.circleBtn?.addEventListener('click', () => this.toggleCircle());
    this.elements.opacityBtn?.addEventListener('click', () => this.cycleOpacity());
    this.elements.retryBtn?.addEventListener('click', () => this.initializeCamera());

    // Border radius
    this.elements.radiusRange?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.updateBorderRadius(parseInt(target.value));
    });

    // Window size controls
    this.elements.settingsBtn?.addEventListener('click', () => this.toggleSizePanel());
    this.elements.applySizeBtn?.addEventListener('click', () => this.applyWindowSize());

    // Preset buttons
    document.querySelectorAll('.presets button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        this.applyPreset(target.dataset.preset || '');
      });
    });

    // Resize handle
    this.setupResizeHandle();

    // Advanced settings
    this.elements.globalShortcuts?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      this.updateSetting('enableGlobalShortcuts', target.checked);
    });

    this.elements.autoStart?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      this.updateSetting('autoStart', target.checked);
    });

    this.elements.themeSelect?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.updateSetting('theme', target.value as 'dark' | 'light' | 'auto');
    });

    this.elements.exportBtn?.addEventListener('click', () => this.exportSettings());
    this.elements.importBtn?.addEventListener('click', () => this.importSettings());
    this.elements.resetBtn?.addEventListener('click', () => this.resetSettings());

    // Listen for settings changes from main process
    window.electronAPI.onSettingsChanged((newSettings) => {
      this.settings = newSettings;
      this.applySettings();
    });

    // Listen for camera errors
    window.electronAPI.onCameraError((error) => {
      this.showError(error);
    });

    // Prevent context menu
    window.addEventListener('contextmenu', e => e.preventDefault());

    // Initialize radius value display
    if (this.elements.radiusValue) {
      const radiusRange = this.elements.radiusRange as HTMLInputElement;
      this.elements.radiusValue.textContent = `${radiusRange.value}%`;
    }
  }

  private async initializeCamera(): Promise<void> {
    try {
      this.hideError();
      
      if (this.currentStream) {
        this.currentStream.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      this.videoElement.srcObject = stream;
      this.currentStream = stream;
      
      // Apply current settings
      this.applySettings();
      
    } catch (error) {
      console.error('Failed to access camera:', error);
      this.showError('Camera permission denied or unavailable');
    }
  }

  private showError(message: string): void {
    if (this.elements.errorMessage) {
      const errorText = this.elements.errorMessage.querySelector('.error-text');
      if (errorText) errorText.textContent = message;
      this.elements.errorMessage.removeAttribute('hidden');
    }
    if (this.videoElement) {
      this.videoElement.style.display = 'none';
    }
  }

  private hideError(): void {
    if (this.elements.errorMessage) {
      this.elements.errorMessage.setAttribute('hidden', '');
    }
    if (this.videoElement) {
      this.videoElement.style.display = 'block';
    }
  }

  private applySettings(): void {
    if (!this.settings) return;

    // Apply flip
    this.videoElement.style.transform = this.settings.flipped ? 'scaleX(-1)' : 'scaleX(1)';

    // Apply circle mode
    document.body.classList.toggle('circle', this.settings.circular);

    // Apply border radius (if not in circle mode)
    if (!this.settings.circular) {
      this.videoElement.style.borderRadius = `${this.settings.borderRadius}%`;
    }

    // Apply opacity
    this.videoElement.style.opacity = this.settings.opacity.toString();

    // Update UI controls
    const radiusRange = this.elements.radiusRange as HTMLInputElement;
    if (radiusRange) {
      radiusRange.value = this.settings.borderRadius.toString();
      if (this.elements.radiusValue) {
        this.elements.radiusValue.textContent = `${this.settings.borderRadius}%`;
      }
    }

    // Update advanced settings
    const globalShortcuts = this.elements.globalShortcuts as HTMLInputElement;
    if (globalShortcuts) {
      globalShortcuts.checked = this.settings.enableGlobalShortcuts;
    }

    const autoStart = this.elements.autoStart as HTMLInputElement;
    if (autoStart) {
      autoStart.checked = this.settings.autoStart;
    }

    const themeSelect = this.elements.themeSelect as HTMLSelectElement;
    if (themeSelect) {
      themeSelect.value = this.settings.theme;
    }
  }

  private showControls(): void {
    this.elements.controlsOverlay?.removeAttribute('hidden');
  }

  private hideControls(): void {
    this.elements.controlsOverlay?.setAttribute('hidden', '');
    this.elements.sizePanel?.setAttribute('hidden', '');
    this.elements.advancedPanel?.setAttribute('hidden', '');
  }

  private toggleFlip(): void {
    const newFlipped = !this.settings.flipped;
    this.updateSetting('flipped', newFlipped);
  }

  private toggleCircle(): void {
    const newCircular = !this.settings.circular;
    this.updateSetting('circular', newCircular);
  }

  private cycleOpacity(): void {
    const opacities = [1, 0.9, 0.75, 0.6, 0.4];
    const currentIndex = opacities.indexOf(this.settings.opacity);
    const nextIndex = (currentIndex + 1) % opacities.length;
    this.updateSetting('opacity', opacities[nextIndex]);
  }

  private updateBorderRadius(value: number): void {
    if (this.elements.radiusValue) {
      this.elements.radiusValue.textContent = `${value}%`;
    }
    
    if (!this.settings.circular) {
      this.videoElement.style.borderRadius = `${value}%`;
    }
    
    this.updateSetting('borderRadius', value);
  }

  private toggleSizePanel(): void {
    if (this.elements.sizePanel?.hasAttribute('hidden')) {
      this.showSizePanel();
    } else {
      this.elements.sizePanel?.setAttribute('hidden', '');
    }
  }

  private async showSizePanel(): Promise<void> {
    try {
      const size = await window.electronAPI.invoke('window:get-size');
      if (size) {
        const widthInput = this.elements.widthInput as HTMLInputElement;
        const heightInput = this.elements.heightInput as HTMLInputElement;
        if (widthInput) widthInput.value = size.width.toString();
        if (heightInput) heightInput.value = size.height.toString();
      }
      this.elements.sizePanel?.removeAttribute('hidden');
    } catch (error) {
      console.error('Failed to get window size:', error);
    }
  }

  private async applyWindowSize(): Promise<void> {
    try {
      const widthInput = this.elements.widthInput as HTMLInputElement;
      const heightInput = this.elements.heightInput as HTMLInputElement;
      
      const width = parseInt(widthInput.value);
      const height = parseInt(heightInput.value);
      
      if (width && height) {
        await window.electronAPI.invoke('window:set-size', { width, height });
      }
    } catch (error) {
      console.error('Failed to set window size:', error);
    }
  }

  private async applyPreset(preset: string): Promise<void> {
    try {
      const [ratioW, ratioH] = preset.split(':').map(Number);
      if (!ratioW || !ratioH) return;

      const currentSize = await window.electronAPI.invoke('window:get-size');
      if (!currentSize) return;

      const newWidth = currentSize.width;
      const newHeight = Math.round(newWidth * (ratioH / ratioW));
      
      await window.electronAPI.invoke('window:set-size', { width: newWidth, height: newHeight });
      
      const heightInput = this.elements.heightInput as HTMLInputElement;
      if (heightInput) heightInput.value = newHeight.toString();
    } catch (error) {
      console.error('Failed to apply preset:', error);
    }
  }

  private setupResizeHandle(): void {
    if (!this.elements.resizeHandle) return;

    let startX: number, startY: number, startW: number, startH: number;

    this.elements.resizeHandle.addEventListener('mousedown', async (e) => {
      e.preventDefault();
      
      try {
        const size = await window.electronAPI.invoke('window:get-size');
        if (!size) return;

        this.isResizing = true;
        startX = e.screenX;
        startY = e.screenY;
        startW = size.width;
        startH = size.height;
        
        document.body.classList.add('resizing');
      } catch (error) {
        console.error('Failed to start resize:', error);
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isResizing) {
        this.isResizing = false;
        document.body.classList.remove('resizing');
      }
    });

    window.addEventListener('mousemove', async (e) => {
      if (!this.isResizing) return;

      try {
        const dx = e.screenX - startX;
        const dy = e.screenY - startY;
        const newW = Math.max(160, startW + dx);
        const newH = Math.max(160, startH + dy);
        
        await window.electronAPI.invoke('window:set-size', { width: newW, height: newH });
        
        const widthInput = this.elements.widthInput as HTMLInputElement;
        const heightInput = this.elements.heightInput as HTMLInputElement;
        if (widthInput) widthInput.value = newW.toString();
        if (heightInput) heightInput.value = newH.toString();
      } catch (error) {
        console.error('Failed to resize window:', error);
      }
    });
  }

  private async updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> {
    try {
      this.settings[key] = value;
      await window.electronAPI.invoke('settings:set', { [key]: value });
      this.applySettings();
    } catch (error) {
      console.error(`Failed to update setting ${String(key)}:`, error);
    }
  }

  private async exportSettings(): Promise<void> {
    try {
      const settings = await window.electronAPI.invoke('settings:get');
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'floating-cam-settings.json';
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export settings:', error);
    }
  }

  private importSettings(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const settings = JSON.parse(text);
        await window.electronAPI.invoke('settings:set', settings);
      } catch (error) {
        console.error('Failed to import settings:', error);
      }
    });

    input.click();
  }

  private async resetSettings(): Promise<void> {
    try {
      if (confirm('Reset all settings to defaults?')) {
        const defaultSettings = await window.electronAPI.invoke('settings:reset');
        this.settings = defaultSettings;
        this.applySettings();
      }
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FloatingCamRenderer();
});