# src/routes/api — TanStack Start convention

Is project me API `src/server/router.ts` me centralized hai (Nitro handleApi).
Agar aap file-per-route chahte ho to yahan `students.ts`, `leads.ts` etc. bana sakte ho:

```ts
// src/routes/api/students.ts
import { createServerFileRoute } from "@tanstack/react-start"
export const ServerRoute = createServerFileRoute("/api/students").methods({
  GET: async ({ request }) => handleApi(request),
  POST: async ({ request }) => handleApi(request),
})
```

Filhal `src/server.ts` me `if (url.pathname.startsWith("/api/")) return handleApi(request)` se sab cover hai — isliye ye folder khali dikhta tha, ab README add kiya hai.
