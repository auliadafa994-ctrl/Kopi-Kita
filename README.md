# KopiKita

Local-first Indonesian coffee shop demo: React/Vite/TypeScript/Tailwind, Express/TypeScript REST API, and PostgreSQL via Prisma. Payment is simulated locally; no real gateway, cloud integration, production database, or external image dependency is used.

## Requirements and local setup

- Node.js 20+, npm, local PostgreSQL 14+.
- Create database/user (or adapt `DATABASE_URL`): `CREATE USER kopikita WITH PASSWORD 'kopikita'; CREATE DATABASE kopikita OWNER kopikita;`
- Copy `backend/.env.example` to `backend/.env`; set a private random `JWT_SECRET` of at least 32 characters and local PostgreSQL URL.
- Optionally copy `frontend/.env.example` to `frontend/.env` to change the local API URL.

Terminal 1:

```powershell
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Terminal 2:

```powershell
cd frontend
npm install
npm run dev
```

Open the printed Vite URL (default `http://localhost:5173`). Health: `http://127.0.0.1:4000/api/health`.

Seeded local demo accounts (both password `KopiKita123!`):
- Admin: `admin@kopikita.local`
- Customer: `pelanggan@kopikita.local`

Change demo credentials before exposing any environment beyond your own machine.

Commands from `backend/`: `npm test`, `npm run build`, `npm run db:migrate`, `npm run db:seed`. From `frontend/`: `npm test`, `npm run build`.

Checkout rechecks stock and decrements inventory transactionally; admin cancellation restores stock transactionally. Passwords are bcrypt hashes, protected routes use JWT, and API responses follow `{ success, data }` / `{ success: false, error }`. Payment options are explicitly simulations; no charge is made.
