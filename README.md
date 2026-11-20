# AIBLE Studio

A small React + TypeScript POC for editing the e.l.f. AIBLE internal hub. It includes a responsive content workspace, local draft persistence, a generated site preview, a lightweight security review, and an explicit Netlify publish step.

## Run locally

```sh
npm install
cp .env.example .env
# Add a Netlify personal access token and the target site ID to .env
npm run dev
```

For the Netlify function and publish flow locally, run `npx netlify dev` instead of `npm run dev`. The token is only read by `netlify/functions/publish.mjs`; it is never exposed to browser code. Do not rename the variables with a `VITE_` prefix.

## Deploy to Netlify

Connect this repository to Netlify. The included `netlify.toml` builds the Vite app from `dist` and deploys the function in `netlify/functions`.

In **Site configuration → Environment variables**, add:

| Variable | Value |
|---|---|
| `NETLIFY_AUTH_TOKEN` | A Netlify personal access token with permission to deploy the target site |
| `NETLIFY_SITE_ID` | The target AIBLE site's project ID |
| `AIBLE_EDITOR_PASSWORD` | A long, shared passphrase required for every publish request |

Trigger a new deploy after saving the variables. The app does not need these values to render; publishing remains unavailable until both are set.

## POC behavior and boundaries

- Seed content is saved in the current browser's local storage. This POC does not include user accounts or shared editing.
- The publish function requires a shared editor passphrase. This is a POC gate, not per-user authentication; use a long random value and share it only with editors.
- Publishing generates a single `index.html`, retains the other files from the target site's current deploy, and submits a **draft deploy** through the Netlify API. Production stays unchanged; promote the preview manually from Netlify when it has been reviewed.
- The review catches a small set of risky HTML patterns. It is a lightweight check, not a complete security review; inspect the preview before publishing.
- The publish function is limited to 250 existing files and 45 MB total to keep this POC bounded. It returns a generic error to the browser and logs only the Netlify error detail server-side.
- The example content is illustrative. Replace it with approved AIBLE copy before production use.

## Project layout

```text
src/
  components/       Reusable navigation, content cards, editor, publish workflow
  data/             POC starter content and section definitions
  lib/              Local persistence, HTML renderer, and review checks
netlify/functions/  Server-side Netlify API publishing function
```
