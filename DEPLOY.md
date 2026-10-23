# Deploying the Pulse Nova site — runbook

Stack: **GitHub Pages** (static site at https://pulsenova.gg, repo `arkforgegg/pulse`) → form posts to a
**Google Apps Script** web app → rows in the Google Sheet
**"PULSE NOVA｜China Entry & Going Global"**, tab **"Responses 客户数据"**. Everything is free; no credit card.

> **Known limits of this stack (agreed trade-offs — see CHANGES.md):**
> - **Visitors in mainland China cannot submit the form.** All Google domains (incl. `script.google.com`) are blocked
>   there. The page shows the error message with the email address `Shanshan.diao@pulsenova.gg`. GitHub Pages itself
>   is also unreliable from mainland China.
> - GitHub Pages cannot send HTTP security headers; the CSP is a `<meta>` tag (no `frame-ancestors`, no HSTS header).
> - No IP rate limiting. Spam protection = Cloudflare Turnstile + honeypot + server-side validation in Apps Script.
> - Apps Script quotas: `MailApp` 100 emails/day on a consumer Google account (1,500 on Workspace); ~20k
>   `UrlFetchApp` calls/day; 30 simultaneous executions.

---

## 1. Google Sheet + Apps Script (≈15 min)

The Sheet and script must belong to a **company** Google account (Workspace), not a personal one. If the Sheet is
currently owned by a personal account, transfer ownership first (Share → person → *Transfer ownership*), because the
web app runs *as its owner* and stops working if that account goes away.

1. Open the Sheet → **Extensions → Apps Script**. This creates a script bound to this spreadsheet.
2. Replace the contents of `Code.gs` with [`apps-script/Code.gs`](apps-script/Code.gs).
3. **Project Settings** (gear) → tick *Show "appsscript.json" manifest file in editor*, then replace `appsscript.json`
   with [`apps-script/appsscript.json`](apps-script/appsscript.json).
4. **Project Settings → Script Properties** → add:

   | Property | Value |
   |---|---|
   | `TURNSTILE_SECRET` | Turnstile **secret** key from step 2 (leave unset to disable the check — see the warning below) |
   | `ALLOWED_HOSTNAMES` | `pulsenova.gg,www.pulsenova.gg` |
   | `NOTIFY_EMAIL` | who gets a new-submission email (default `Shanshan.diao@pulsenova.gg`; `off` disables) |

   > ⚠️ **Turnstile is both-or-neither.** If `TURNSTILE_SECRET` is set here, the GitHub variable
   > `VITE_TURNSTILE_SITE_KEY` (step 3) **must** be set too — otherwise the site sends no token and **every
   > submission is rejected**. To run without Turnstile, leave **both** empty.

5. In the editor pick the function **`setup`** → **Run**. Approve the permission prompt (Sheets, send email, external
   requests). The log should say `Sheet ready` and list the properties. It also adds two columns at the **end** of the
   tab: `Submitted at 提交时间` and `Status 状态`. Existing columns are untouched; you may reorder columns later — the
   script matches columns by the English first line of each header.
   Then pick **`selfTest`** → **Run** once and send the log (*Execution log* panel) to the developer. It writes a
   few sample values (`+65 …`, `=1+1`, …) to a temporary tab the same way submissions are written, logs how Sheets
   stored and displays them, and deletes the tab. This confirms that phone numbers starting with `+` don't show a
   stray apostrophe and that formulas never run.
6. **Deploy → New deployment** → type **Web app** → *Execute as:* **Me** · *Who has access:* **Anyone** → Deploy.
   Copy the **Web app URL** (ends in `/exec`).
7. Check it: open the `/exec` URL in a browser → `{"ok":true}`.

**Updating the script later:** paste the new code, then **Deploy → Manage deployments → ✏️ Edit → Version: New
version → Deploy**. This keeps the same URL. (*New deployment* would create a different URL.)

## 2. Cloudflare Turnstile (optional but recommended, ≈5 min)

Turnstile is Cloudflare's free CAPTCHA replacement. It only needs a free Cloudflare account — no credit card.

1. https://dash.cloudflare.com → **Turnstile → Add widget**.
2. Hostnames: `pulsenova.gg`, `www.pulsenova.gg` (add `localhost` only if you want to test with real keys locally).
3. Widget mode: **Managed**. (The site renders it with `appearance: interaction-only`, so it is invisible unless
   Cloudflare decides a visitor needs a challenge. The Turnstile script is only loaded once a visitor opens the
   booking form, and on submit the page waits up to 15 s for the token.)
4. Copy the **site key** (public → GitHub variable) and the **secret key** (→ Script Property `TURNSTILE_SECRET`).

To run without Turnstile, leave **both** the site key and the secret empty/unset (see the warning in step 1).
Spam protection then relies on the honeypot and validation only.

## 3. GitHub: repository variables and cutover

The repo `arkforgegg/pulse` currently serves the **old Pulse Nova site** from the `main` branch ("Deploy from a
branch"). The new site deploys with **GitHub Actions** (`.github/workflows/pages.yml`: lint → typecheck → tests →
build → deploy). Do these steps **in this order**, or the live site will show raw source files:

1. **Keep the old site recoverable:** `git push origin legacy-homepage` (tag on the last old-site commit, `dac4b60`).
2. **Settings → Secrets and variables → Actions → Variables** → add
   - `VITE_APPS_SCRIPT_URL` = the `/exec` URL from step 1.6
   - `VITE_TURNSTILE_SITE_KEY` = the site key from step 2 (omit to disable Turnstile)

   The build fails if `VITE_APPS_SCRIPT_URL` is missing or if a Turnstile *test* key is used.
3. `git push origin china-site` and open a **pull request** into `main`. The workflow runs the checks and a build
   (no deploy) on the PR. Wait for it to pass.
4. **Settings → Pages → Build and deployment → Source: GitHub Actions.** The old site stays online until the next
   deployment.
5. **Merge the PR.** The workflow deploys `dist/` to Pages (Actions tab → *Pages* → *deploy* shows the URL).
6. **Settings → Pages:** confirm *Custom domain* is still `pulsenova.gg` and **Enforce HTTPS** is ticked.
   (`web/public/CNAME` contains `pulsenova.gg`, so the domain is kept on every deploy.) No DNS change is needed —
   pulsenova.gg already points at GitHub Pages.

**Rollback:** Settings → Pages → Source: *Deploy from a branch* (`main`, `/ (root)`) and
`git push --force origin legacy-homepage:main` — or simply revert the merge commit and redeploy.

Note: links into the old site (`/images/...`, `/videos/...`) will 404 after the cutover.

## 4. Share the Sheet with staff

Share → add each staff member's Google account (**Editor** or **Viewer**). Do **not** use "Anyone with the link" — the
sheet contains personal data. There is no admin page; the Sheet *is* the admin view. Use the `Status 状态` column
(`new` → `contacted` → …) to track follow-up.

## 5. Post-deploy smoke test

1. Open https://pulsenova.gg on a phone and on a desktop — check images, fonts and the Chinese text.
2. Submit the form three times: **Entering China**, **Going global**, **Both directions** (company name `TEST ONLY …`).
   Each should show the green "Thank you" message.
3. Confirm three new rows in "Responses 客户数据" with the right answers under the right headers, `Submitted at` and
   `Status = new`, and three notification emails at `NOTIFY_EMAIL`.
4. Delete the three test rows.
5. If a submission shows the red error: Apps Script editor → **Executions** — each rejected submission logs
   `Submission rejected: <reason>`. "Verification failed" means a Turnstile problem: check that the secret **and** the
   GitHub site key are both set (or both empty), that `ALLOWED_HOSTNAMES` matches the site's hostname, and that the
   deployment is the latest version.

## 6. Decommission ChatGPT Sites

Only after step 5 passes:

1. Open the old admin page `https://pulse-nova-china-advisory.shanshan9606.chatgpt.site/responses`, export all
   submissions (CSV) and paste them into the Sheet. Old submissions are **not** part of this repo.
2. Then delete/unpublish the ChatGPT Sites project.

---

## Local development

```bash
npm ci
npm run mock:api      # terminal 1 — runs the real Code.gs against an in-memory sheet on :8790
npm run dev           # terminal 2 — http://localhost:5173 (uses .env.development: mock URL + Turnstile test key)
```

Checks: `npm run lint`, `npm run typecheck`, `npm test` (Apps Script logic), and against a local build
(`VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA npm run build && npm run preview` + `npm run mock:api`):
`npm run e2e` (browser click-through) and `npm run parity` (screenshot comparison with the original v18 app on
`ORIGINAL_URL`, default `http://127.0.0.1:8787`; see `docs/visual-parity/REPORT.md`). `FAIL=1 npm run mock:api` makes
every submission fail, to see the error state.
