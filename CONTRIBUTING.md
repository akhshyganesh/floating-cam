# Contributing to Floating Cam

Thank you for your interest in contributing to Floating Cam! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git
- A code editor (VS Code recommended)

### Development Setup
1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/floating-cam.git
   cd floating-cam
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start development server**:
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- **TypeScript**: All new code should be written in TypeScript
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code is automatically formatted with Prettier
- **Naming**: Use descriptive variable and function names
- **Comments**: Add JSDoc comments for public APIs

### Project Structure
```
src/
├── main/           # Electron main process
├── renderer/       # Renderer process (UI)
└── shared/         # Shared types and utilities
```

### Commit Messages
We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation only changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or modifying tests
- `chore:` Maintenance tasks

**Examples:**
```
feat: add camera device selection
fix: resolve window positioning on multi-monitor setups
docs: update installation instructions
test: add unit tests for settings manager
```

## 🧪 Testing

### Running Tests
```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# E2E tests only
npm run test:e2e

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Writing Tests
- **Unit Tests**: Use Jest for testing individual functions/classes
- **Integration Tests**: Test IPC communication and component interaction
- **E2E Tests**: Use Playwright for full application testing

### Test Guidelines
- Write tests for new features
- Maintain or improve test coverage
- Use descriptive test names
- Mock external dependencies
- Test both success and error scenarios

## 🔄 Pull Request Process

### Before Submitting
1. **Run tests**: Ensure all tests pass
   ```bash
   npm test
   ```
2. **Check linting**: Fix any linting errors
   ```bash
   npm run lint
   ```
3. **Type checking**: Ensure TypeScript compiles
   ```bash
   npm run type-check
   ```
4. **Build verification**: Ensure the app builds
   ```bash
   npm run build
   ```

### PR Guidelines
1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** with appropriate tests
3. **Update documentation** if needed
4. **Commit with conventional commits**
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request** with:
   - Clear title and description
   - Link to related issues
   - Screenshots for UI changes
   - List of changes made

### PR Review Process
- All PRs require at least one review
- CI/CD checks must pass
- Code coverage should not decrease
- Documentation should be updated for new features

## 🐛 Bug Reports

### Before Reporting
1. **Search existing issues** for duplicates
2. **Update to latest version** and test again
3. **Check logs** for error messages
4. **Try basic troubleshooting** steps

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g., macOS 12.6]
 - Version: [e.g., 1.2.3]
 - Node.js: [e.g., 18.17.0]

**Additional context**
Any other context about the problem.

**Logs**
Attach relevant log files if available.
```

## 💡 Feature Requests

### Submitting Ideas
1. **Check existing issues** for similar requests
2. **Use the feature request template**
3. **Provide detailed use cases**
4. **Consider implementation complexity**

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Use Cases**
Describe how this feature would be used.

**Additional context**
Any other context or screenshots about the feature request.
```

## 🏗️ Architecture Guidelines

### Main Process
- Handle system integration
- Manage application lifecycle
- Secure IPC communication
- Settings persistence

### Renderer Process
- UI logic only
- No direct Node.js access
- Communicate via IPC
- Follow security best practices

### Security Considerations
- Always use context isolation
- Validate all IPC inputs
- Follow principle of least privilege
- Keep dependencies updated

## 📚 Resources

### Documentation
- [Electron Documentation](https://www.electronjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Playwright E2E Testing](https://playwright.dev/docs/intro)

### Code Quality Tools
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ Questions?

- **Discussions**: [GitHub Discussions](https://github.com/akhshyganesh/floating-cam/discussions)
- **Issues**: [GitHub Issues](https://github.com/akhshyganesh/floating-cam/issues)
- **Email**: [your-email@example.com](mailto:your-email@example.com)

## 🎉 Recognition

Contributors will be:
- Listed in the Contributors section
- Mentioned in release notes for significant contributions
- Thanked in the project README

Thank you for contributing to Floating Cam! 🚀