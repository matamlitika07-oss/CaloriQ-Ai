# NutriScan AI

A full-stack AI-powered food nutrition scanner that analyzes food photos using Claude vision and returns detailed nutritional data, health scores, charts, and recommendations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/nutriscan run dev` — run the frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `AI_INTEGRATIONS_ANTHROPIC_BASE_URL`, `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — auto-set via Replit AI Integrations

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + Recharts + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- AI: Anthropic Claude claude-sonnet-4-6 via Replit AI Integrations (vision)
- File upload: Multer (multipart/form-data)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- DB schema: `lib/db/src/schema/scans.ts`
- API spec: `lib/api-spec/openapi.yaml`
- Generated hooks: `lib/api-client-react/src/generated/`
- Generated Zod schemas: `lib/api-zod/src/generated/`
- AI vision service: `artifacts/api-server/src/lib/nutrition-analyzer.ts`
- Nutrition routes: `artifacts/api-server/src/routes/nutrition/`
- Frontend pages: `artifacts/nutriscan/src/pages/`
- Frontend components: `artifacts/nutriscan/src/components/`
- Meal tracker (localStorage): `artifacts/nutriscan/src/lib/meal-tracker.ts`

## Architecture decisions

- Image uploads use multer with `memoryStorage()` — images are converted to base64 and sent directly to Claude, not stored on disk
- PostgreSQL is used instead of MongoDB (Replit's native DB is Postgres; no external services needed)
- The `/analyze` endpoint is called via raw `fetch` with FormData — not a generated React Query hook — because multipart/form-data binary uploads can't be expressed in the OpenAPI spec without generating TypeScript `File`/`Blob` type errors in the Node.js server-side Zod schemas
- Replit AI Integrations is used for Anthropic access — no API key needed from the user

## Product

- Upload a food photo (drag-and-drop or click) to get an AI-generated nutrition analysis
- Rich dashboard showing calories, macros, health score ring, vitamin/mineral breakdown
- Dietary badges, allergen warnings, AI health recommendations
- Scan history: browse, view, and delete past analyses
- Meal tracker: add scans to Today's Meals, track daily calorie budget (localStorage)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After changing `openapi.yaml`, always run `pnpm --filter @workspace/api-spec run codegen` before running typecheck
- Do NOT use binary format (`format: binary`) in the OpenAPI spec — it generates `File`/`Blob` types incompatible with the server-side Zod lib
- The Anthropic client requires `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` and `AI_INTEGRATIONS_ANTHROPIC_API_KEY` env vars; run `setupReplitAIIntegrations` again if they're missing

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
