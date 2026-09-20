# SonicLight

SonicLight is a browser-based generative sound composition tool.

Users identify themselves with a username only, then compose by dropping shapes on a canvas. Each shape is a voice: its position sets stereo pan and volume, its size sets reverb, and its color picks the sample. All voices play together as an ambient loop.

An admin user can browse a read-only gallery of every user's drawings and play them back.

## Features

- Username-based identity (no password), with a seeded `admin` user
- Canvas with circle (pad), rectangle (voice) and triangle (texture) shapes, each in a 5-color palette
- Move, resize and reorder shapes, then save the drawing
- Real-time playback with the Web Audio API
- Admin gallery of all users' drawings

## Tech stack

Client: React, React Router, Zustand, Tailwind, shadcn/ui

Server: Node, Express, Prisma

dB: PostgreSQL

## Installation

Clone the project:

```
git clone git@github.com:rh-el/soniclight.git
```

### With Docker

Create your environment file, then start everything:

```
cp .env.example .env.dev
./start-dev.sh
```

The three services are running:

- <http://localhost:5173/> client application
- <http://localhost:8000/> API
- `localhost:5432` PostgreSQL

Migrations and the admin seed are applied automatically on backend start.

If you change `POSTGRES_USER`, `POSTGRES_PASSWORD` or `POSTGRES_DB` after the first start, the backend fails with `P1000: Authentication failed`. Postgres only applies these values on an empty volume, so reset it (this deletes the database data; migrations and seed are re-applied on the next start):

```
docker compose -p soniclight -f docker-compose.dev.yml --env-file .env.dev down
docker volume rm soniclight_postgres_dev_data
./start-dev.sh
```

## Lint and format

Run inside the containers (they must be running):

```
./scripts/lint.sh
./scripts/format.sh
```

Optional pre-commit hook, which runs on the host, so install dependencies first:

```
(cd client && npm ci) && (cd server && npm ci)
git config core.hooksPath .githooks
```

## Documentation

- `docs/requirements.md` product requirements
- `docs/architecture.md` code structure and conventions
- `docs/decisions.md` intentional decisions
