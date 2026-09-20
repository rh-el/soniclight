#!/bin/bash
docker compose -p soniclight -f docker-compose.dev.yml --env-file .env.dev exec frontend npm run format
docker compose -p soniclight -f docker-compose.dev.yml --env-file .env.dev exec backend npm run format
