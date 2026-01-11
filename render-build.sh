#!/usr/bin/env bash
# Render build script

echo "🚀 Starting build process..."

# Install Bun
echo "📦 Installing Bun..."
curl -fsSL https://bun.sh/install | bash
export PATH="$HOME/.bun/bin:$PATH"

# Verify Bun installation
echo "✅ Bun version:"
bun --version

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
bun run db:generate

# Run database migrations
echo "🗄️ Running database migrations..."
bun run db:migrate deploy

echo "✅ Build complete!"
