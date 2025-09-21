# Floating Cam

[![CI/CD](https://github.com/akhshyganesh/floating-cam/actions/workflows/ci.yml/badge.svg)](https://github.com/akhshyganesh/floating-cam/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/akhshyganesh/floating-cam)](https://github.com/akhshyganesh/floating-cam/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A production-ready, cross-platform floating always-on-top mirror camera window built with Electron and TypeScript. Perfect for video calls, content creation, streaming, and monitoring yourself during presentations.

## ✨ Features

### Core Features
- **Always on Top**: Stays visible above all other windows
- **Frameless & Transparent**: Clean, minimal design that doesn't obstruct your workflow
- **Draggable Interface**: Move the window by dragging the toolbar
- **Resizable**: Adjust size using OS window controls or the built-in resize handle
- **Live Camera Mirror**: Real-time camera feed with horizontal flip toggle
- **Cross-Platform**: Works on macOS, Windows, and Linux

### Camera Controls
- **Flip Camera**: Toggle horizontal mirroring for natural mirror effect
- **Circle Mode**: Switch between rectangular and circular camera view
- **Adjustable Border Radius**: Customize corner roundness in rectangular mode
- **Opacity Control**: Cycle through opacity levels for different visibility needs
- **Multiple Aspect Ratios**: Quick presets for 1:1, 4:3, 16:9, and 9:16

### Advanced Features
- **Settings Persistence**: All preferences are automatically saved and restored
- **Global Shortcuts**: System-wide hotkeys for quick access
- **Error Handling**: Robust error recovery and user-friendly error messages
- **Comprehensive Logging**: Detailed logs for troubleshooting
- **Security First**: Content Security Policy and sandboxed renderer process
- **Performance Optimized**: Minimal resource usage and efficient rendering

### Global Shortcuts
- `Cmd/Ctrl + Alt + I`: Toggle Developer Tools
- `Cmd/Ctrl + Alt + R`: Refresh/Reload Camera
- `Cmd/Ctrl + Alt + T`: Toggle Window Visibility

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- A webcam/camera device

> **Note**: This application has been thoroughly tested and all TypeScript compilation errors have been resolved. The project now builds cleanly and is ready for production use.

### Installation

#### Option 1: Download Pre-built Binaries
1. Go to the [Releases](https://github.com/akhshyganesh/floating-cam/releases) page
2. Download the appropriate installer for your platform:
   - **macOS**: `.dmg` file
   - **Windows**: `.exe` installer
   - **Linux**: `.AppImage` or `.deb` package

#### Option 2: Build from Source
```bash
# Clone the repository
git clone https://github.com/akhshyganesh/floating-cam.git
cd floating-cam

# Install dependencies
npm install

# Start in development mode (with hot reload)
npm run dev

# Or build for production and run
npm run build
npm start

# Build distribution packages for all platforms
npm run dist
```

### First Run
1. **Camera Permission**: Grant camera access when prompted
2. **Position Window**: Drag the toolbar to position the camera where you want it
3. **Customize Settings**: Click the gear icon (⚙️) to access controls
4. **Hide Dock Icon**: On macOS, the dock icon automatically hides for a cleaner experience

## 🛠️ Development

### Project Structure
```
floating-cam/
├── src/
│   ├── main/              # Electron main process (TypeScript)
│   │   ├── main.ts        # Application entry point
│   │   ├── window-manager.ts # Window management
│   │   ├── settings-manager.ts # Settings persistence
│   │   ├── error-handler.ts # Error handling & logging
│   │   └── preload.ts     # Preload script for IPC
│   ├── renderer/          # Renderer process (TypeScript)
│   │   ├── index.html     # Main UI
│   │   ├── index.ts       # Renderer logic
│   │   └── styles.css     # Styling
│   └── shared/            # Shared types and interfaces
│       └── types.ts       # TypeScript type definitions
├── assets/                # Application assets
├── tests/                 # Test files
├── .github/               # GitHub Actions workflows
└── build/                 # Built application packages
```

### Development Commands

```bash
# Development with hot reload
npm run dev

# Build the application
npm run build

# Run tests
npm test                   # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:watch        # Watch mode for tests

# Code quality
npm run lint              # ESLint
npm run format            # Prettier formatting
npm run type-check        # TypeScript compilation check

# Building for distribution
npm run dist              # All platforms
npm run dist:mac          # macOS only
npm run dist:win          # Windows only
npm run dist:linux        # Linux only

# Clean build artifacts
npm run clean
```

### Architecture

#### Main Process (`src/main/`)
- **`main.ts`**: Application lifecycle management, IPC setup
- **`window-manager.ts`**: Window creation, positioning, and state management
- **`settings-manager.ts`**: Persistent settings storage using electron-store
- **`error-handler.ts`**: Centralized error handling and logging
- **`preload.ts`**: Secure IPC bridge between main and renderer

#### Renderer Process (`src/renderer/`)
- **`index.ts`**: Camera initialization, UI event handling, settings management
- **`styles.css`**: Modern CSS with animations and responsive design
- **`index.html`**: Semantic HTML structure with accessibility features

#### Shared (`src/shared/`)
- **`types.ts`**: TypeScript interfaces for type-safe IPC communication

### Security Features

- **Content Security Policy**: Prevents XSS attacks
- **Context Isolation**: Renderer process isolation from Node.js
- **Sandboxed Renderer**: Limited system access
- **Secure IPC**: Type-safe communication between processes
- **Input Validation**: All user inputs are validated and sanitized

## 📦 Building and Distribution

### Prerequisites for Building
- All development dependencies installed
- Platform-specific build tools:
  - **macOS**: Xcode Command Line Tools
  - **Windows**: Windows SDK
  - **Linux**: Standard build tools

### Build Configuration
The application uses `electron-builder` for packaging with the following configurations:

- **Code Signing**: macOS apps include entitlements for camera access
- **Auto-updater**: Built-in update mechanism (configure in CI/CD)
- **Multi-platform**: Single codebase builds for all platforms
- **Optimized Bundles**: Tree-shaking and minification for smaller downloads

### Release Process
1. **Automated Testing**: All tests must pass
2. **Semantic Versioning**: Version bumps based on commit messages
3. **Multi-platform Builds**: Automated builds for macOS, Windows, and Linux
4. **GitHub Releases**: Automatic release creation with changelog
5. **Asset Upload**: Pre-built binaries attached to releases

## 🧪 Testing

### Test Types
- **Unit Tests**: Jest for testing individual components
- **Integration Tests**: Testing IPC communication and settings
- **End-to-End Tests**: Playwright for full application testing
- **Visual Tests**: Screenshot comparison for UI consistency

### Running Tests
```bash
# All tests
npm test

# Specific test types
npm run test:unit
npm run test:e2e
npm run test:integration

# Coverage report
npm run test:coverage
```

### Continuous Integration
- **GitHub Actions**: Automated testing on push/PR
- **Multi-platform Testing**: Tests run on Ubuntu, Windows, and macOS
- **Code Quality**: Linting, type checking, and formatting validation
- **Security Scanning**: Dependency vulnerability checks

## ⚙️ Configuration

### Settings Storage
Settings are automatically persisted using `electron-store`:

```typescript
interface AppSettings {
  flipped: boolean;           // Camera flip state
  circular: boolean;          // Circle mode
  borderRadius: number;       // Border radius (0-50)
  opacity: number;           // Window opacity (0.1-1.0)
  windowSize: WindowSize;    // Window dimensions
  startMinimized: boolean;   // Start minimized
  enableGlobalShortcuts: boolean; // Global hotkeys
  autoStart: boolean;        // Auto-start with system
  theme: 'dark' | 'light' | 'auto'; // UI theme
}
```

### Location
- **macOS**: `~/Library/Application Support/floating-cam/config.json`
- **Windows**: `%APPDATA%/floating-cam/config.json`
- **Linux**: `~/.config/floating-cam/config.json`

### Reset Settings
- Use the "Reset to Defaults" button in the advanced settings panel
- Or delete the config file manually

## 🎨 Customization

### Themes
- **Auto**: Follows system preference
- **Dark**: Dark mode interface
- **Light**: Light mode interface

### Window Appearance
- **Opacity**: 5 preset levels (40%, 60%, 75%, 90%, 100%)
- **Shape**: Rectangle with adjustable border radius or perfect circle
- **Size**: Resizable with preset aspect ratios

### Keyboard Shortcuts
Global shortcuts can be enabled/disabled in settings. Current shortcuts:
- Toggle DevTools: `Cmd/Ctrl + Alt + I`
- Refresh Camera: `Cmd/Ctrl + Alt + R`
- Toggle Visibility: `Cmd/Ctrl + Alt + T`

## 🚨 Troubleshooting

### Common Issues

#### Camera Not Working
1. **Check Permissions**: Ensure camera access is granted
2. **Other Apps**: Close other applications using the camera
3. **Refresh**: Use `Cmd/Ctrl + Alt + R` to refresh the camera
4. **Restart**: Try restarting the application

#### Window Not Visible
1. **Check Opacity**: Window might be too transparent
2. **Multiple Monitors**: Window might be on another screen
3. **Reset Position**: Delete settings file to reset window position

#### Performance Issues
1. **Close DevTools**: Ensure developer tools are closed
2. **Update Drivers**: Update camera and graphics drivers
3. **Check Logs**: Look at application logs for errors

### Logs Location
- **macOS**: `~/Library/Logs/floating-cam/main.log`
- **Windows**: `%USERPROFILE%/AppData/Roaming/floating-cam/logs/main.log`
- **Linux**: `~/.config/floating-cam/logs/main.log`

### Getting Help
1. **Check Issues**: [GitHub Issues](https://github.com/akhshyganesh/floating-cam/issues)
2. **Create Issue**: Provide logs and system information
3. **Discussions**: [GitHub Discussions](https://github.com/akhshyganesh/floating-cam/discussions)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/floating-cam.git`
3. Install dependencies: `npm install`
4. Verify setup: `npm run type-check && npm test`
5. Start development: `npm run dev`
6. Create a feature branch: `git checkout -b feature/amazing-feature`
7. Make your changes and add tests
8. Run tests: `npm test`
9. Ensure clean build: `npm run build`
10. Commit changes: `git commit -m 'feat: add amazing feature'`
11. Push to branch: `git push origin feature/amazing-feature`
12. Open a Pull Request

### Development Verification
After setting up the project, verify everything works correctly:

```bash
# Check TypeScript compilation
npm run type-check

# Run all tests
npm test

# Test build process
npm run build

# Start in development mode
npm run dev
```

If all commands complete without errors, your development environment is ready!

### Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/modifications
- `chore:` Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Electron](https://electronjs.org/) - Cross-platform desktop app framework
- [TypeScript](https://typescriptlang.org/) - Type-safe JavaScript
- [electron-builder](https://electron.build/) - Application packaging
- [electron-store](https://github.com/sindresorhus/electron-store) - Settings persistence
- [electron-log](https://github.com/megahertz/electron-log) - Logging framework

## 🔮 Roadmap

### Upcoming Features
- [ ] Multiple camera selection
- [ ] Click-through mode toggle
- [ ] Custom hotkey configuration
- [ ] Zoom and pan controls
- [ ] Video recording capabilities
- [ ] Green screen/background blur
- [ ] Integration with streaming software
- [ ] Mobile companion app

### Version History
See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

---

**Made with ❤️ by [Akhshy Ganesh](https://github.com/akhshyganesh)**

*Star ⭐ this repository if you find it useful!*
