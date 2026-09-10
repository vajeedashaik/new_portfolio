# Vajeeda Shaik — Portfolio

Bold, gradient, red-on-dark single-page portfolio with per-project case-study pages.
Built with **React + Vite**, **React Router**, and **Framer Motion**.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the built dist/
```

## Edit content

Everything lives in **`src/data/content.js`** — no component edits needed for:

- `profile` — name, title, tagline, email, phone, socials, résumé path
- `about` — bio paragraphs, portrait path, headline stats
- `skills` — grouped skill lists
- `experience` — roles, bullets
- `achievements` — recognition + leadership
- `education`
- `projects` — array; `featured: true` = big card + full case study, `false` = compact.
  Each project drives its own page at `/projects/<slug>`.

## Photos

Drop images into **`public/photos/`**:

| file | used for |
|------|----------|
| `about.jpg` | About-section portrait (4:5 crop looks best) |

If `about.jpg` is missing the site shows a styled placeholder — nothing breaks.
The other event photos (Meta hackathon lab, OpenEnv frame, ReNotify booth, Agile
Network talk) can be added to individual project pages later.

## Résumé

`public/Vajeeda_Resume.pdf` is served at `/Vajeeda_Resume.pdf` (nav + hero button).
Replace that file to update it.

## Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. Import into Vercel — framework preset **Vite**, no config needed.
3. `vercel.json` already rewrites all routes to `index.html` so
   `/projects/renotify` works on hard refresh.

Or via CLI:

```bash
npm i -g vercel
vercel --prod
```

## Design tokens

`src/index.css` `:root` — change `--red`, `--crimson`, `--bg`, fonts, radius there.
