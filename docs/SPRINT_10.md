# Sprint 10 — Admin login gateway

- Login UI at /admin/login.
- Same-origin Next.js login gateway at /api/admin/login.
- Session cookie scoped to /admin and verified server-side before rendering dashboard.
- Configure ADMIN_API_INTERNAL_URL and ADMIN_ALLOWED_ORIGIN on the Next.js server; set ADMIN_ALLOWED_ORIGIN on NestJS too.
- Do not expose the internal API through public untrusted routing.
- Pending: logout gateway, admin CRUD gateway, shared persistent throttling, audit trail, RBAC, and integration tests.
- No VPS deployment until verification.
