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

## Backend error handling

Errors are raised from the service layer and turned into HTTP responses in one place.

- `exceptions.ts` defines `AppError` (message + HTTP `status`) and one subclass per domain error (e.g. `InvalidUsernameError` → 400, `UsernameAlreadyExistsError` → 409).
- `services/` hold all the logic and validation, and `throw` these exceptions. They know nothing about `req`/`res`.
- `routes/` only read the request, call a service, and send the success response. No `try/catch`, no status codes for errors.
- `core/errors.ts` exports `errorHandler`, an Express error middleware registered last in `main.ts`. It maps `AppError` to its status and `{ error: message }`; anything else is logged and returned as a 500.
- Express 5 forwards rejected promises from async handlers to the error middleware, so no wrapper or `next(err)` is needed.
- To add an error: create an `AppError` subclass in `exceptions.ts` with its status, throw it from the service. Nothing else changes.

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
