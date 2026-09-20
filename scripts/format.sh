docker compose -f docker-compose.dev.yml --env-file .env.dev exec frontend npm run format
docker compose -f docker-compose.dev.yml --env-file .env.dev exec backend npm run format
