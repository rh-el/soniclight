# SonicLight Decisions

These are intentional constraints from the concept specification. Do not "improve" them away unless explicitly asked.

## Username-only identity

Username is the sole user identifier for retrieving drawings.

Do not introduce passwords, OAuth, sessions, JWT authentication, or other authentication mechanisms unless explicitly requested. The username-as-bearer approach is intentionally accepted for this exercise.

Implementation of the username-as-bearer approach:

- The frontend persists the entered username in `localStorage` after "login" (there is no server-side session).
- Every API request sends the username in an `X-Username` header.
- The backend resolves the current user by looking up that header value against the `users` table on each request. A missing or unknown username is treated as unauthenticated.
- Admin access is determined by an `is_admin` boolean column on the `users` table (true only for the seeded `admin` user), checked via the same per-request lookup — not via a separate token or claim.

## Logical canvas coordinates

Store shape geometry in a fixed logical coordinate system rather than physical pixels.

The canvas may resize on screen, but the drawing's logical coordinates must remain stable.

## Discrete shapes only

The drawing model is based on discrete shapes:

- circle
- rectangle
- triangle

Do not turn the editor into a freehand drawing application.

## Geometry is the source of audio parameters

The persisted shape data should be enough to derive:

- area
- center offset
- angle / spatial position

Avoid persisting derived audio values when they can be calculated from geometry and color.

## Simultaneous audio

Audio is an ambient/drone-style result with one voice per shape.

Do not implement a timeline or stroke-by-stroke sequencer for v1.

## Voice limit

The application supports at most 16 simultaneous voices.

The exact strategy used when the cap is exceeded is intentionally left to implementation.

## Admin is read-only

The admin gallery can inspect drawings and trigger their audio, but cannot edit, delete, or moderate them.

## Scope discipline

The goal is a working, understandable technical-test implementation. Do not add features simply because they might be useful in a production application.

## Errors are raised in services, handled centrally

Services throw `AppError` subclasses; a single error middleware maps them to HTTP responses. Do not add per-route try/catch blocks or set error status codes in route handlers. See `docs/architecture.md`.
