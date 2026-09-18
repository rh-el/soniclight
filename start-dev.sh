#!/bin/bash
# Start development environment

set -euo pipefail

echo "🚀 Starting SonicLight development environment..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and start services
docker compose -p soniclight -f docker-compose.dev.yml --env-file .env.dev up -d --build

echo ""
echo "✅ Services started successfully!"
echo ""
echo "📍 Service URLs:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:8000"
echo "   Database:  localhost:5432"
echo ""
echo "📋 Useful commands:"
echo "   View logs:        docker compose -p soniclight -f docker-compose.dev.yml logs -f"
echo "   Stop services:    docker compose -p soniclight -f docker-compose.dev.yml down"
echo "   Restart service:  docker compose -p soniclight -f docker-compose.dev.yml restart [service-name]"
echo ""

