# Painex Pain Management Clinic — Blog

A static-site-generated blog for [Painex Pain Management Clinic](https://www.painex.org), Pune.
Built with **Vite + React + TypeScript + Tailwind CSS + shadcn/ui**.

## Tech Stack

- **Vite** — build tooling with custom prerender plugin
- **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **React Router v6** — client-side routing
- **react-helmet-async** — SEO meta tags
- Custom prerender plugin — generates static HTML + `sitemap.xml` at build time

## Local Development

**Prerequisites:** Node.js ≥ 18 or [Bun](https://bun.sh/)

```sh
# Install dependencies
npm install

# Start dev server at http://localhost:8080
npm run dev
```

## Production Build

```sh
npm run build
```

Outputs to `dist/` with:
- Pre-rendered static HTML for every route (blog posts, categories, authors, location pages)
- `sitemap.xml`
- Gzip + Brotli compressed assets

## Deployment — Netlify

This project ships with a `netlify.toml` and is ready to deploy on **Netlify**.

### Option A — Netlify CLI

```sh
npm install -g netlify-cli
netlify login
netlify init          # link to your Netlify site
netlify deploy --prod # deploy to production
```

### Option B — Netlify Dashboard (Git-connected)

1. Push this repo to GitHub / GitLab / Bitbucket.
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Select your repository.
4. Build settings are auto-detected from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**.

### Connecting a Custom Domain

1. In Netlify dashboard: **Site settings → Domain management → Add custom domain**.
2. Enter your domain (e.g. `www.painspecialist.blog`).
3. Update your domain registrar's DNS:
   - **CNAME** `www` → `<your-site-name>.netlify.app`
   - Or use Netlify DNS (recommended for apex domains).
4. Netlify provisions a free SSL certificate automatically.

## Project Structure

```
src/
├── components/    # Reusable UI components
├── data/          # Blog posts, categories, authors, locations
├── hooks/         # Custom React hooks
├── lib/           # Utilities
├── pages/         # Route-level page components
└── main.tsx       # App entry point
```

## Environment / Domain Config

The canonical domain is set in `vite.config.ts`:

```ts
const DOMAIN = "https://www.painspecialist.blog";
```

Update this value before building if you change the domain.
