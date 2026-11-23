# Integration hand-off

- Backend: `backend/`; `npm run dev`; `127.0.0.1:4000`; build `npm run build`; health `GET /api/health`.
- Frontend: `frontend/`; `npm run dev`; build `npm run build`; live API client `src/api.ts`; mock datasets: none.
- API routes: Auth `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`; `GET /api/categories`; `GET /api/products`, `GET /api/products/:slug`; admin categories `POST|PATCH|DELETE /api/admin/categories[/:id]`; admin products `POST|PATCH|DELETE /api/admin/products[/:id]`; customer orders `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id`; admin orders `GET /api/admin/orders`, `GET /api/admin/orders/:id`, `PATCH /api/admin/orders/:id/status`.
- Database: PostgreSQL + Prisma; schema `backend/prisma/schema.prisma`, migrations `backend/prisma/migrations`, connection `DATABASE_URL`. No seed data in migrations.
- Shared types: frontend API DTOs `frontend/src/api.ts`. Services: Express API (Essential), React SPA (Essential), PostgreSQL/Prisma (Essential).
