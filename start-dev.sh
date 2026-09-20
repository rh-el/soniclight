#!/bin/bash
# Start development environment

set -euo pipefail

echo "Starting SonicLight development environment..."
echo ""

# Check env file exists
if [ ! -f .env.dev ]; then
    echo "Error: .env.dev not found. Run: cp .env.example .env.dev"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create the external volumes declared in docker-compose.dev.yml (no-op if they exist)
for volume in soniclight_postgres_dev_data soniclight_frontend_node_modules soniclight_backend_node_modules; do
    docker volume create "$volume" > /dev/null
done

# Build and start services
docker compose -p soniclight -f docker-compose.dev.yml --env-file .env.dev up -d --build

echo ""
echo "Services started successfully!"
echo ""
echo "Service URLs:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:8000"
echo "   Database:  localhost:5432"
echo ""
echo "Useful commands:"
echo "   View logs:        docker compose -p soniclight -f docker-compose.dev.yml logs -f"
echo "   Stop services:    docker compose -p soniclight -f docker-compose.dev.yml down"
echo "   Restart service:  docker compose -p soniclight -f docker-compose.dev.yml restart [service-name]"
echo ""

