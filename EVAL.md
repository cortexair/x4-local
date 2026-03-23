# EVAL.md — x4-local Evaluation & Local-First Customization

> Evaluated: 2026-03-23
> Fork of: [corbanb/x4-mono](https://github.com/corbanb/x4-mono)

---

## 1. Architecture Summary

x4-mono is a full-stack TypeScript monorepo targeting web, mobile, and desktop. The API is Hono + tRPC v11 running on Bun. The web client is Next.js 15 App Router. Mobile is Expo, desktop is Electron.

```
apps/
  api/          Hono + tRPC v11 on Bun       :3002
  web/          Next.js 15 App Router        :3000
  marketing/    Next.js static site          :3001
  mobile-main/  Expo + React Native
  desktop/      Electron
  storybook/    Component catalog            :6006

packages/
  shared/          Zod types, utils, UI, hooks, API client
  database/        Drizzle ORM + Postgres client
  auth/            Better Auth (server + clients)
  ai-integrations/ Vercel AI SDK (Claude + OpenAI)
```

Monorepo orchestration: Bun workspaces + Turborepo.
Validation: Zod is the source of truth for all types.
Logging: Pino structured JSON.
Linting: ESLint + eslint-plugin-boundaries (enforced dependency graph).

---

## 2. Cloud Dependencies — Full Inventory

### 2a. Neon Postgres (REPLACED)

| Location                           | Symbol                                                            | Status       |
| ---------------------------------- | ----------------------------------------------------------------- | ------------ |
| `packages/database/src/client.ts`  | `neon()` from `@neondatabase/serverless`, `drizzle-orm/neon-http` | **Replaced** |
| `packages/database/src/migrate.ts` | same                                                              | **Replaced** |
| `packages/database/src/seed.ts`    | same                                                              | **Replaced** |
| `packages/database/package.json`   | `@neondatabase/serverless` dep                                    | **Replaced** |

`@neondatabase/serverless` uses an HTTP transport designed for Vercel/Cloudflare serverless environments.
It works fine locally, but requires the `sslmode=require` connection string format that Neon issues.
**This does not work against a plain local Postgres instance without extra SSL config.**

### 2b. Upstash Redis (OPTIONAL — fail-open, no change needed)

| Location                               | Usage                                     | Behaviour without config          |
| -------------------------------------- | ----------------------------------------- | --------------------------------- |
| `apps/api/src/lib/cache.ts`            | AI response caching, user profile caching | Returns `null` — transparent miss |
| `apps/api/src/middleware/rateLimit.ts` | Sliding window rate limiting per tier     | Skips limiting — fail-open        |

Both modules check for `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` at startup.
If absent (or `NODE_ENV=test`), they return null/skip — **no crash, no code change required**.

### 2c. Anthropic API

`ANTHROPIC_API_KEY` is validated as **required** in `apps/api/src/lib/env.ts` (line 9).
It must be present and start with `sk-` for the API server to boot.
This is a hard dependency even if you don't use AI features locally.

### 2d. Vercel CI/CD

Referenced in `.github/workflows/` (if any) and the project README.
Not a runtime dependency — affects deploy pipeline only.

---

## 3. Changes Made

### 3a. Database driver swap

**Before:** `@neondatabase/serverless` + `drizzle-orm/neon-http` (HTTP, serverless-first)

**After:** `postgres` (postgres.js v3) + `drizzle-orm/postgres-js` (TCP, standard Postgres)

Files changed:

- `packages/database/package.json` — replaced dep
- `packages/database/src/client.ts` — rewrote
- `packages/database/src/migrate.ts` — rewrote (adds `client.end()` for clean exit)
- `packages/database/src/seed.ts` — rewrote (adds `client.end()` for clean exit)

`drizzle.config.ts` needed no change — it reads `DATABASE_URL` directly and uses `dialect: 'postgresql'`.

### 3b. docker-compose.yml

Added `docker-compose.yml` at repo root:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports: ['5435:5432']
    environment:
      POSTGRES_USER: fantasy
      POSTGRES_PASSWORD: fantasy
      POSTGRES_DB: fantasy
```

Start with: `docker compose up -d`
Connection string: `postgresql://fantasy:fantasy@localhost:5435/fantasy`

### 3c. .env.example updates

Both `.env.example` (root) and `apps/api/.env.example` updated:

- `DATABASE_URL` pre-filled with local Docker connection string
- `JWT_SECRET` / `BETTER_AUTH_SECRET` pre-filled with 32-char dev placeholders
- `ANTHROPIC_API_KEY` commented out (optional note)
- `UPSTASH_*` vars documented and commented out (optional)
- OAuth vars documented and commented out (optional)

### 3d. swarm.yaml stub

Added `swarm.yaml` at repo root — reserved for future Swarm orchestration integration.
Documents service paths, ports, and leaves agents/integrations blocks as commented stubs.

### 3e. CLAUDE.md update

Updated `CLAUDE.md`:

- Title changed from `x4-mono` → `x4-local`
- Added fork notice and local-first changes summary at top
- Architecture section: updated Database entry from "Neon" → "Local Postgres (Docker, port 5435)"
- Environment Variables table: updated `DATABASE_URL` description

---

## 4. `bun install` Results

**Status: SUCCESS**

```
bun install v1.3.11 (af24e281)
3947 packages installed [71.79s]
```

The `postgres` package was installed correctly under `packages/database/node_modules/postgres`.
TypeScript type-check for `@x4/database` passes cleanly (`tsc --noEmit`).

Note: Bun was not in PATH on this machine. Install: `curl -fsSL https://bun.sh/install | bash`

---

## 5. `bun dev` Results

**Status: BLOCKED — missing .env.local (expected, not a bug)**

The API server (`apps/api`) validates env vars at startup via Zod in `apps/api/src/lib/env.ts`.
It exits early with a clear error if required vars are missing:

```
Invalid environment variables: DATABASE_URL, JWT_SECRET, BETTER_AUTH_SECRET, ANTHROPIC_API_KEY
```

This is correct behaviour. To actually start the dev server:

```bash
# 1. Copy env and fill in values
cp .env.example .env.local
# Edit .env.local — at minimum set ANTHROPIC_API_KEY

# 2. Start Postgres
docker compose up -d

# 3. Push schema (first time)
bun db:push

# 4. Seed (optional)
bun db:seed

# 5. Start all services
bun dev
```

### Blocker: ANTHROPIC_API_KEY is required even without AI use

`apps/api/src/lib/env.ts` line 9 marks `ANTHROPIC_API_KEY` as required (not `.optional()`).
The API won't start without a valid key even if you never call an AI endpoint.

**Recommendation:** Change line 9 to optional for local dev:

```ts
ANTHROPIC_API_KEY: z.string().startsWith('sk-').optional(),
```

Then guard AI-using routes with a runtime check. This allows the full stack to boot locally
without an Anthropic account.

---

## 6. Open Issues / Recommendations

| #   | Issue                                       | Severity | Recommendation                                        |
| --- | ------------------------------------------- | -------- | ----------------------------------------------------- | ----- |
| 1   | `ANTHROPIC_API_KEY` required at boot        | Medium   | Make optional in `env.ts`, guard AI routes at runtime |
| 2   | No `.env.local` present after clone         | Low      | `cp .env.example .env.local` — documented in README   |
| 3   | Bun not in system PATH                      | Low      | User install step: `curl -fsSL https://bun.sh/install | bash` |
| 4   | No `docker compose up` automation           | Low      | Add to `bun dev` or create `bun db:docker` script     |
| 5   | Upstash Redis optional but undocumented     | Low      | Documented in updated `.env.example`                  |
| 6   | Mobile (Expo) / Desktop (Electron) untested | Low      | Not in scope for local-first API/web eval             |

---

## 7. Quick Start (post-customization)

```bash
# Install bun (if needed)
curl -fsSL https://bun.sh/install | bash

# Clone and install deps
git clone <this-repo> x4-local
cd x4-local
bun install

# Configure env
cp .env.example .env.local
# Edit .env.local — fill in ANTHROPIC_API_KEY at minimum

# Start Postgres
docker compose up -d

# Push schema
bun db:push

# (Optional) seed
bun db:seed

# Start all services
bun dev
# web → http://localhost:3000
# api → http://localhost:3002
# marketing → http://localhost:3001
```
