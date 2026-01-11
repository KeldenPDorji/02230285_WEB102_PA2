#!/usr/bin/env bash
# Render start script

echo "🚀 Starting Pokémon API..."

# Set Bun path
export PATH="$HOME/.bun/bin:$PATH"

# Start the server
exec bun run src/index.ts
