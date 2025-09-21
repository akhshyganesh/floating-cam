# Build script for production releases
set -e

echo "🚀 Building Floating Cam for production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm test

# Type check
echo "🔍 Type checking..."
npm run type-check

# Lint code
echo "✅ Linting code..."
npm run lint

# Build application
echo "🔨 Building application..."
npm run build

# Package for all platforms
echo "📱 Packaging for all platforms..."
npm run dist

echo "✨ Build complete! Check the 'build' directory for installable packages."