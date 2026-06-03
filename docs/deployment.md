# Admin Dashboard — YouInSports

Next.js 15 admin dashboard deployed on Cloudflare Pages.

## Local Dev

```bash
npm run dev
# http://localhost:3000
```

## Local Cloudflare Edge Preview

Create `.dev.vars` first (see `.env.local.example`), then:

```bash
npm run build && npm run preview
# http://localhost:8788
```

## Manual Deploy to Cloudflare Pages

First time only — create the project:

```bash
npx wrangler pages project create admin-dashboard
```

Every production deploy:

```bash
npm run build && npm run build:cf
npx wrangler pages deploy .vercel/output/static --project-name admin-dashboard --branch master
```

Preview deploy:

```bash
npm run build && npm run build:cf
npx wrangler pages deploy .vercel/output/static --project-name admin-dashboard --branch preview
```

## CI/CD via GitHub (Option B)

Build settings in Cloudflare dashboard:

- **Framework preset:** Next.js
- **Build command:** `npm run build && npx @cloudflare/next-on-pages@1`
- **Build output directory:** `.vercel/output/static`
- **Production branch:** `master`

### Environment variables — Production

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://admin.uinsports.com` |
| `NEXT_PUBLIC_USE_MOCK_DATA` | `false` |
| `API_BASE_URL` | `https://api.uinsports.com` |
| `SERVICE_JWT_TOKEN` | *(secret — paste JWT)* |

### Environment variables — Preview

| Variable | Value |
|---|---|
| `API_BASE_URL` | `https://api-dev.uinsports.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://dev-admin.uinsports.com` |

> If the build fails with a Node.js error, add `NODE_VERSION = 20` to env vars.
