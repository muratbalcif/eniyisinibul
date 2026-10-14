# Sprint 4 — Admin catalog API hardening

- Admin list endpoint with bounded pagination.
- Input shape checks and slug validation.
- Prisma unique conflicts mapped to HTTP 409; missing records to 404.
- Prisma connection lifecycle wired to NestJS.
- Developer token guard remains disabled in production.

Not production-ready: secure login, RBAC, CSRF, rate limiting, audit logging, affiliate link management, CI validation and integration tests. Do not deploy admin endpoints publicly.
