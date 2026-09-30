# Uniquesta Backend — API-first + MySQL

**Stack:** TanStack Start (Nitro) + MySQL (mysql2) + JWT (jsonwebtoken) + bcryptjs

## Run MySQL

```bash
docker compose up -d
# or local MySQL: create database `uniquesta`
```

Copy env:

```bash
cp .env.example .env
# edit DB_* and JWT_SECRET
```

## API Base

All routes under `/api` — independent from frontend, reusable for mobile.

| Method | Path | Description |
|---|---|---|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login -> { token } |
| GET | /api/auth/me | Current user (Bearer token) |
| GET | /api/health | Health + DB mode |

**Resources (CRUD + pagination + search):**

- `GET/POST /api/students` `GET/PUT/DELETE /api/students/:code|id`
- `GET/POST /api/leads` `.../api/leads/:id`
- `GET/POST /api/applications` `.../api/applications/:code`
- `GET/POST /api/universities` `.../api/universities/:id`
- `GET/POST /api/colleges` `.../api/colleges/:code`
- `GET/POST /api/courses` `.../api/courses/:code`
- `GET/POST /api/india-students` `.../api/india-students/:code`
- `GET/POST /api/invoices` `.../api/invoices/:code`
- `GET/POST /api/employees` `.../api/employees/:id`
- `GET/POST /api/approvals` `.../api/approvals/:code` + `PUT /api/approvals/:code/steps/:id`
- `GET/POST /api/referrals` `.../api/referrals/:code`
- `GET/POST /api/commissions`, `GET/POST /api/payment-requests`
- `GET/PUT /api/settings`, `GET /api/dashboard/stats`, `GET /api/branches`

**Pagination:** `?page=1&limit=20&search=...`

**Fallback:** If MySQL unreachable, server automatically uses in-memory store seeded with demo data — no code change needed. Build passes without DB.

## Frontend binding

`src/lib/api.ts` provides typed `request()` and helpers. Pages use `@tanstack/react-query`.

No UI redesign — same Tailwind classes, only data source swapped.
