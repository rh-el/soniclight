#!/bin/bash
docker compose -p soniclight -f docker-compose.dev.yml --env-file .env.dev exec frontend npm run lint
docker compose -p soniclight -f docker-compose.dev.yml --env-file .env.dev exec backend npm run lint