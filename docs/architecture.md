# SonicLight Architecture

Keep the architecture small and easy to understand for a junior full-stack technical test.

## Repository

```text
/
├── CLAUDE.md
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   └── decisions.md
├── client/
└── server/
```

## Frontend

The frontend is React + react-router + shadcn + tailwind + zustand.

Use the existing project structure:

```text
client/src/
├── pages/
├── components/
├── hooks/
├── models/
├── queries/
├── state-management/
└── utils/
```

General responsibility:

- `pages/` — page-level composition and routing concerns
- `components/` — reusable UI and canvas-related components
- `hooks/` — reusable React behavior
- `models/` — frontend domain/types
- `queries/` — API/data access
- `state-management/` — shared application state where needed
- `utils/` — small reusable helpers

Prefer keeping state local unless it genuinely needs to be shared.

## Backend

The backend is Node + PostgreSQL + prisma.

Use the existing structure:

```text
server/app/
├── core/
├── crud/
├── models/
├── routes/
└── services/
```

General responsibility:

- `routes/` — HTTP/API endpoints and request/response handling
- `services/` — application/domain logic
- `crud/` — database access operations
- `models/` — database/domain models
- `core/` — shared configuration and infrastructure

Keep database access out of route handlers when a service/CRUD layer is already appropriate.

## Main data flow

```text
React page
  ↓
components / hooks
  ↓
queries
  ↓
API routes
  ↓
services
  ↓
crud
  ↓
PostgreSQL
```

Audio and canvas interaction can remain primarily in the frontend, while persisted drawing data belongs in the backend/database.

## Design principle

Prefer a straightforward implementation over introducing abstractions for their own sake. The codebase should be easy for another junior developer to understand and extend.
