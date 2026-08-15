# Eyam 1665: The Boundary Stone Dilemma

An interactive documentary & ethics simulator built with Next.js (App Router) + Tailwind CSS. Students watch a documentary, hit decision checkpoints, debate in groups, vote, and get an Ethics Framework Analysis (Utilitarian / Kantian / Buddhist), a persona journal, and a tutor dashboard.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Eyam simulator"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Deploy on Netlify

This repo includes a `netlify.toml` that uses the official `@netlify/plugin-nextjs` plugin, so Netlify can run this Next.js App Router project correctly (SSR/static pages, image handling, etc.).

1. Go to https://app.netlify.com and click **Add new site → Import an existing project**.
2. Connect GitHub and pick the repo you just pushed.
3. Netlify should auto-detect the settings from `netlify.toml` (build command `npm run build`, publish directory `.next`). Leave them as-is.
4. Click **Deploy site**.
5. Your app will be live at `https://<random-name>.netlify.app` (you can rename it in Site settings).

Every push to `main` will auto-redeploy.

## Notes

- **Tutor password**: The "Tutor" unlock code (`enabled`) is hardcoded in `app/page.jsx` and checked entirely in the browser — it is **not secure**, it's just a soft gate to keep students from casually poking around. Anyone who views the page source can find it. If you need real protection (e.g. keeping results private per-student), that would require a backend/auth layer, which this simple static app doesn't have.
- **YouTube video**: The documentary video ID is hardcoded (`nwgKs6QbCOU`) in `app/page.jsx` inside `initPlayer()`. Swap it for your own video ID if needed, and double check the checkpoint `timestamp` values (in seconds) still line up with your video's content.
- **State is not saved**: All progress (decisions, journal entries, class votes) lives only in the browser tab's memory. Refreshing the page resets everything. If you want to persist a session (e.g. survive a refresh, or save to review later), that's a further enhancement — let me know if you want that added.
