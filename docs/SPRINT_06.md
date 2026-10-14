# Sprint 6 — Admin session authentication

- AdminUser/AdminSession schema and SQL migration.
- Scrypt salted password hashes, SHA-256 hashed random session tokens, HttpOnly SameSite=Strict cookies, 8-hour expiry.
- Login/logout/session endpoints and session guard.
- Developer bearer-token guard removed from admin CRUD.

IMPORTANT: Admin login is not production-ready yet. Before enabling publicly add bootstrap CLI, brute-force rate limits, CSRF/origin enforcement, audit log, RBAC, session cleanup, integration tests and HTTPS-only configuration. Admin users are not created by seed.
