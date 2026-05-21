# Vercel Deployment Fix

## Executive Summary

The frontend is a valid Next.js App Router application under `frontend/`. The deployed `404: NOT_FOUND` is consistent with Vercel building or serving the wrong project root, not with a missing local route.

The app has a real home route at:

```text
frontend/src/app/page.tsx
```

The professional fix is to configure Vercel with `frontend` as the Root Directory and redeploy after setting the production API URL.

## Required Vercel Settings

| Setting | Value |
| --- | --- |
| Repository | `GhariebML/Bingo` |
| Branch | `main` |
| Root Directory | `frontend` |
| Framework Preset | Next.js |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `.next` |

## Required Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://bingo-backend-8dub.onrender.com
NEXT_PUBLIC_APP_MODE=demo
```

Do not use `localhost` in Vercel. In production, `localhost` points to the visitor's device, not the Render backend.

## Local Verification

Run from the repository root:

```powershell
cd frontend
npm install
npm run typecheck
npm run build
```

The build must include route `/`. Expected production routes include:

- `/`
- `/chat`
- `/dashboard`
- `/journal`
- `/exercises`
- `/settings`
- `/safety`

## Post-Deploy Acceptance Criteria

- Vercel deployment completes successfully.
- The Vercel URL returns the Bingo landing page instead of `404: NOT_FOUND`.
- Browser network calls target `https://bingo-backend-8dub.onrender.com`.
- Demo mode is visible and real AI remains disabled.

## If 404 Persists

Check these in order:

1. Confirm the deployed Vercel project is the one connected to `GhariebML/Bingo`.
2. Confirm Root Directory is exactly `frontend`.
3. Confirm the deployment was triggered after the Root Directory change.
4. Confirm the deployment is from branch `main`.
5. Confirm Output Directory is `.next`, not the repository root.

Do not fix a Vercel 404 by moving frontend files to the repository root. The monorepo structure is valid and should remain intact.
