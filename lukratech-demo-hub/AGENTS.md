# LukraTech Demo Hub — agent context

## What this project is

**LukraTech Demo Hub** is a production-oriented Next.js application that showcases a portfolio of AI demos for Colombian SMEs. Prospects choose an industry, and the experience adapts (copy, prompts, sample operational data, and notification templates). The first demo is **Autonomous Ops Agent**, which models proactive operational follow-up with optional integrations (Anthropic, Supabase, Telegram, Resend, Google Sheets).

## Folder structure

- `src/app/` — App Router routes. `page.tsx` is the hub home; `demos/ops-agent/*` contains the ops demo (industry selection, run, dashboard). `src/app/api/*` hosts route handlers for triggering runs and reading history.
- `src/components/ui/` — Shared, mostly headless layout primitives (structure first; visual polish comes later).
- `src/components/demos/ops-agent/` — Demo-specific UI shells (`IndustrySelector`, `AgentRunStream`, `ActivityLog`).
- `src/lib/industries/` — Industry registry, per-industry `config`, `seedData`, `prompt`, and `copy` modules. This is the **adaptation layer** for sector-specific language and mock data.
- `src/lib/agent/` — Agent types, tool schemas, runner, and notification dispatch (with optional Supabase logging).
- `src/lib/integrations/` — Supabase (browser/SSR clients, service-role logging, `getRecentRuns`), Telegram (fetch), Resend, and Sheets credentials.
- `src/types/` — Shared cross-cutting TypeScript types re-exported for convenience.
- `supabase/migrations/` — SQL migrations for demo persistence (`agent_runs`, `agent_actions`).
- `src/proxy.ts` — Next.js 16 **proxy** (request boundary hook; replaces `middleware.ts`).

## Industry adaptation layer

1. Each industry has an `IndustryConfig` record (labels, SLA hours, personas, Telegram template, case study snippets).
2. `prompt.ts` holds Spanish system prompt fragments for the model; `copy.ts` holds Spanish UI strings; `seedData.ts` exposes `generateSeedData()` with realistic operational items.
3. `src/lib/industries/index.ts` aggregates `INDUSTRIES` and exposes `getCachedIndustrySummaries()` using the `use cache` directive for cached server data.

## Conventions

- **User-facing copy** (UI, prompts, seed narratives): **Colombian Spanish**.
- **Code comments and identifiers**: **English**.
- **TypeScript**: `strict` mode; avoid `any`; prefer explicit types and `unknown` for opaque model output.
- **Caching**: prefer the `use cache` directive for server caching; do not rely on deprecated `fetch` cache option patterns for new code.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` | Authenticate Anthropic Claude for the agent runner. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key for browser/server clients with RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for trusted server-only operations (keep secret). |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token for `sendMessage` calls. |
| `TELEGRAM_CHAT_ID` | Destination chat for operational alerts. |
| `RESEND_API_KEY` | Send transactional emails through Resend. |
| `RESEND_ALERT_EMAIL` | Inbox for the HTML run-summary email. |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | Service account email for Sheets access. |
| `GOOGLE_SHEETS_PRIVATE_KEY` | Private key for the service account (escape newlines as needed). |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Target spreadsheet ID for integrations. |

Copy `.env.local.example` to `.env.local` and fill values locally; configure the same keys in Vercel for deployment.

## Supabase setup (runs + actions logging)

1. **Create a project** at [supabase.com](https://supabase.com) (new organization or existing → **New project**). Pick a region, set a database password, and wait until the project is healthy.
2. **Get API keys (Project Settings → API):**
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (used for reads, respects RLS)
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server-only; bypasses RLS for inserts — never expose to the browser)
3. **Run the schema** in the Supabase **SQL Editor** (new query): paste the full contents of `supabase/migrations/001_initial.sql` and run it. This creates `agent_runs` and `agent_actions` with public `SELECT` policies.
4. **Local env:** copy `.env.local.example` to `.env.local` and set at minimum:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (required for persisting runs after `POST /api/agent/run` dispatches)
5. **Verify:** run `npx ts-node scripts/test-agent.ts` with env loaded, then open **Table Editor** → confirm new rows in `agent_runs` and `agent_actions`, and open `GET /api/demos/ops-agent/runs` for a JSON array of recent runs (nested actions).

## Next.js 16 notes

This repo targets **Next.js 16** with the App Router, **React 19.2**, **Tailwind CSS v4**, the **React Compiler**, and **`cacheComponents`** (required for the `use cache` directive) in `next.config.ts`. Prefer official docs in `node_modules/next/dist/docs/` when an API differs from older training data.
