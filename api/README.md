# API — Uniquesta Backend (API-first)

**Real implementation:** `src/server/router.ts` (65kB, 18 tables) + `src/server/db.ts` + `src/server/auth.ts` + `src/server/validation.ts`
Intercepted in `src/server.ts` → `handleApi(req)` for `/api/*` (Nitro/TanStack Start). This `api/` folder is a **visible alias** for you — real logic is in `src/server/`.

## Why `src/server/` not `api/`?
TanStack Start ke Nitro server ka entry `src/server.ts` hai. Usme `handleApi()` se saare `/api/*` routes ek jagah handle hote hain — isliye `src/routes/api/*.tsx` me file-per-route banane ki zarurat nahi padi. Lekin aapko `api` folder dikhna chahiye isliye ye alias banaya hai.

## Endpoints (18 tables, MySQL + memory fallback)
- `POST /api/auth/register, POST /api/auth/login, GET /api/auth/me`
- `GET/POST /api/students`, `GET/PUT/DELETE /api/students/:code`
- `GET/POST /api/leads`, `/api/applications`, `/api/universities`, `/api/colleges`, `/api/courses`, `/api/india-students`, `/api/invoices`, `/api/employees`, `/api/approvals`, `/api/referrals`, `/api/commissions`, `/api/payment-requests`, `/api/branches`, `GET/PUT /api/settings`, `GET /api/dashboard/stats`, `GET /api/reports`, `GET /api/health`

Frontend client: `src/lib/api.ts`

## MySQL
`docker compose up -d` → `uniquesta` DB, else in-memory seed.

## Test
```bash
curl --noproxy '*' http://127.0.0.1:5173/api/health
curl --noproxy '*' http://127.0.0.1:5173/api/students?limit=2
```
