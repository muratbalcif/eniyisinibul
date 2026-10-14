# Sprint 3 — PostgreSQL backed public catalog

- Public GET /api/v1/categories reads categories from Prisma.
- Public GET /api/v1/products supports category slug, page, limit (max 100).
- Public GET /api/v1/products/:slug returns a 404 for unknown products.
- Affiliate destination URLs are deliberately not exposed by the product API.
- Admin writes are not implemented until secure authentication/authorization is ready.

## Local setup
1. Install Node.js 20+ and pnpm 9.
2. Copy .env.example to .env; choose a strong local POSTGRES_PASSWORD and make DATABASE_URL use the same password.
3. docker compose up -d db
4. pnpm install
5. pnpm --filter @eib/database db:generate
6. pnpm --filter @eib/database db:migrate (migration name: init)
7. pnpm --filter @eib/api dev

## Pending
- Lockfile, automated build/test, database migration artifact, seed fixtures, authenticated admin CRUD, public frontend catalog integration, deploy.
