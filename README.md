# Pulse Nova — China market advisory site

Static Vite + React site served by GitHub Pages at https://pulsenova.gg. The consultation form posts to a Google Apps
Script web app that writes to the "PULSE NOVA｜China Entry & Going Global" Google Sheet.

```
web/            the site (index.html, src/App.tsx, styles, public assets)
apps-script/    Code.gs + appsscript.json — paste into the Sheet's Apps Script project
scripts/        local mock of the Apps Script API, browser click-through, visual-parity check
test/           unit tests for the Apps Script logic (runs the real Code.gs with in-memory fakes)
docs/           visual-parity evidence, original handoff documents
```

- **Deploy / operate:** [DEPLOY.md](DEPLOY.md)
- **What changed vs the ChatGPT Sites build:** [CHANGES.md](CHANGES.md)

```bash
npm ci
npm run mock:api   # local Apps Script stand-in on :8790
npm run dev        # http://localhost:5173
npm run lint && npm run typecheck && npm test
```
