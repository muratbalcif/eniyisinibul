# Sprint 8 — Authentication hardening

Security review findings:
- Login rate limiting is missing.
- Login timing can differ for missing accounts.
- CSRF protection currently relies on Origin checks for writes and strict cookies.
- Role-based authorization and audit logs are missing.
- Build and integration tests are not verified.

Do not deploy until these are addressed and verified.
