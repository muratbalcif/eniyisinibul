# Admin API — development only

The admin endpoints are disabled in production. They require a locally configured ADMIN_DEV_TOKEN of at least 32 characters and Authorization: Bearer <token>.

- GET /api/v1/admin/categories
- POST /api/v1/admin/categories {slug,name}
- POST /api/v1/admin/products {slug,title,description?,categoryId}
- PATCH /api/v1/admin/products/:id {title?,slug?,description?}
- DELETE /api/v1/admin/products/:id

This is a temporary developer-only API, **not** a complete admin authentication system.
Before release replace with secure account login, session handling, roles, CSRF protection, rate limiting, audit logs, request schemas, and integration tests. Never enable this token gate on a public deployment.
