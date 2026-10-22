# Changes vs v18 (ChatGPT Sites build, commit 2944d6e)

This is a re-platform, not a redesign: design, EN/中文 copy and the mobile layout are unchanged. The screenshot
comparison in [`docs/visual-parity/REPORT.md`](docs/visual-parity/REPORT.md) shows identical page dimensions in every
shot and ≤ 0.012 % differing pixels, all of which are glyph antialiasing (self-hosted vs Google-served font files).

## Hosting: ChatGPT Sites → GitHub Pages + Google Apps Script

| | v18 | Now |
|---|---|---|
| Frontend | vinext (Next.js-on-Vite beta) Worker on `*.chatgpt.site` | Plain Vite + React static build on GitHub Pages (`pulsenova.gg`) |
| Form backend | `POST /api/consultations` Worker route | Google Apps Script web app (`apps-script/Code.gs`) |
| Storage | Cloudflare D1 (Drizzle) | The Google Sheet "PULSE NOVA｜China Entry & Going Global", tab "Responses 客户数据" |
| Admin | `/responses` page + `GET /api/consultations?key=` | None — staff use the Sheet directly (shared per person) |
| Email | Resend (optional API key) | `MailApp` from Apps Script (`NOTIFY_EMAIL` Script Property) |

**Deviation from MIGRATION-BRIEF.md:** the brief specified Cloudflare Workers Static Assets with a Worker relaying to
Apps Script. The team chose GitHub Pages + Apps Script instead, to avoid a Cloudflare account. Accepted consequences:

- **The browser calls Google directly, so the form cannot be submitted from mainland China** (Google is blocked there).
  The page's existing error message gives the email address as a fallback. The brief's Worker relay existed to avoid
  this; it can be added later without changing the page much (point `VITE_APPS_SCRIPT_URL` at a relay).
- No HTTP security headers on GitHub Pages → CSP and referrer policy are `<meta>` tags; `frame-ancestors` and HSTS
  headers are not possible (Pages' *Enforce HTTPS* still redirects to HTTPS).
- No Origin check (Apps Script cannot read request headers) and no WAF rate limit. Instead: Turnstile token verified in
  Apps Script **including the hostname it was issued for**, a honeypot field, a 32 KB body cap, and server-side
  validation.
- The repo is public (required for free GitHub Pages). It contains no secrets: the Turnstile secret and notification
  address live in Apps Script Script Properties.

## Page code (`web/src/App.tsx`, ported from `app/page.tsx`)

Ported verbatim except:

- Removed the Next.js-only `"use client"` directive.
- Image `src` paths are prefixed with Vite's `BASE_URL` (renders `/…` exactly as before on pulsenova.gg; also works
  if the site is ever served from a sub-path).
- Submit: posts to `VITE_APPS_SCRIPT_URL` as `text/plain` (a CORS "simple request" — Apps Script cannot answer a
  preflight), and treats a JSON reply other than `{ok:true}` as an error (Apps Script always replies HTTP 200).
- Added a hidden honeypot input (`address2`, off-screen, `tabIndex=-1`, `autocomplete=off`).
- Added Cloudflare Turnstile (`web/src/turnstile.ts`) in **interaction-only** mode — invisible unless a challenge is
  needed, so the form looks the same. Optional: disabled when no site key is configured.
- Success / error / sending states are unchanged.

`<title>`, meta description and favicon moved from `app/layout.tsx` to `web/index.html`; `<html lang="en">` and
`<body class="antialiased">` kept.

## Styles and fonts

- `globals.css` is byte-identical except the first line: the Google Fonts `@import` is removed. Inter (400–700),
  Manrope (500–700) and Noto Sans SC (400–600) are now self-hosted via `@fontsource/*` with the same family names and
  unicode-range subsets (Google Fonts is blocked in China and stalled rendering there).
- Tailwind 4.2.1 is kept with the same PostCSS setup as before (the preflight reset and `antialiased` utility are
  needed for identical rendering).

## Validation (Apps Script — same rules as the old API, plus the brief's additions)

- Required: company name, name & title, email, consent. Direction must be one of the three values; for
  *Going global* / *Both directions*, target overseas markets and expansion stage are required. Same error messages.
- New: email format check; per-field length caps (names 200, email 240, WhatsApp/WeChat 120, others 4000); only the 34
  known fields are stored (unknown keys dropped); multi-value fields joined with `", "`.
- New: values starting with `= + - @ tab CR` are prefixed with `'` and the row is written as plain text, so user input
  can never run as a spreadsheet formula.
- New: `Submitted at 提交时间` (ISO, UTC+8) and `Status 状态` (`new`) columns, appended at the end of the existing tab.
- A failing notification email never loses the row (it is written first).

## Removed

ChatGPT Sites scaffolding (`.openai/`, `build/sites-vite-plugin.*`, `scripts/*`, `app/chatgpt-auth.ts`), vinext/Next.js,
the D1 database layer (`db/`, `drizzle/`, `drizzle.config.ts`, `cloudflare-env.d.ts`), the admin page and admin API,
the Resend integration, `examples/`, all unused shadcn components (`components/ui/*`, `hooks/`, `lib/`, `vendor/`),
`tsconfig.tsbuildinfo`, unused public files (`file.svg`, `globe.svg`, `window.svg`, `pulse-nova-logo.png`,
`market-network.webp`), and the D1-specific QA script `tests/test-pn-worker.mjs` (replaced by `npm test` /
`npm run e2e`). The untouched v18 export is preserved on the local branch `v18-export`.

This branch also replaces the **previous Pulse Nova website** that `arkforgegg/pulse` served at pulsenova.gg; it is
kept in history and tagged `legacy-homepage`.
