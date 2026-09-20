# format everything

docker compose -p soniclight -f docker-compose.dev.yml --env-file .env.dev exec frontend npm run format
docker compose -p soniclight -f docker-compose.dev.yml --env-file .env.dev exec backend npm run format

# lint

docker compose -p soniclight -f docker-compose.dev.yml --env-file .env.dev exec frontend npm run lint
docker compose -p soniclight -f docker-compose.dev.yml --env-file .env.dev exec backend npm run lint

# check only (what the pre-commit hook runs)

docker compose -p soniclight -f docker-compose.dev.yml --env-file .env.dev exec frontend npm run format:check
docker compose -p soniclight -f docker-compose.dev.yml --env-file .env.dev exec backend npm run format:check
