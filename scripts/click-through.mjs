// Browser click-through against a local build + the mock Apps Script:
//   npm run build && npm run preview   (terminal 1)
//   npm run mock:api                   (terminal 2)
//   npm run e2e
// Checks direction switching, the overseas CTA, native validation, success and error states,
// Turnstile (Cloudflare test key, needs internet) and that the CSP reports no violations.
import assert from "node:assert/strict";
import { chromium } from "playwright";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:4173/";
const API_URL = process.env.API_URL ?? "http://127.0.0.1:8790";
const CHINA_FIELDS = ["chinaEntity", "chinaStage", "trademark", "currentChinaSetup"];
const OVERSEAS_FIELDS = ["targetMarkets", "overseasStage", "overseasSetup"];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const problems = [];
page.on("console", (msg) => { if (msg.type() === "error") problems.push(`console: ${msg.text()}`); });
page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
await page.addInitScript(() => {
  document.addEventListener("securitypolicyviolation", (e) => console.error(`CSP violation: ${e.violatedDirective} ${e.blockedURI}`));
});

const rows = async () => (await fetch(`${API_URL}/rows`)).json();
const present = (name) => page.locator(`.consultForm [name="${name}"]`).count().then((n) => n > 0);
const direction = page.locator('select[name="consultationDirection"]');
const results = [];
const step = async (name, fn) => { await fn(); results.push(name); console.log(`✓ ${name}`); };

await page.goto(SITE_URL, { waitUntil: "load" });

await step("form starts collapsed; overseas CTA opens it with Going global selected", async () => {
  assert.equal(await page.locator(".intakeDisclosure").evaluate((d) => d.open), false);
  await page.getByRole("link", { name: "Discuss your overseas plans" }).click();
  assert.equal(await page.locator(".intakeDisclosure").evaluate((d) => d.open), true);
  assert.equal(await direction.inputValue(), "Going global");
});

await step("direction switching shows/hides the China and overseas questions", async () => {
  const expected = { "Entering China": [true, false], "Going global": [false, true], "Both directions": [true, true] };
  for (const [value, [china, overseas]] of Object.entries(expected)) {
    await direction.selectOption(value);
    for (const f of CHINA_FIELDS) assert.equal(await present(f), china, `${value}: ${f}`);
    for (const f of OVERSEAS_FIELDS) assert.equal(await present(f), overseas, `${value}: ${f}`);
  }
});

await step("Turnstile renders invisibly (interaction-only) and issues a token", async () => {
  await page.waitForFunction(() => document.querySelector('[name="cf-turnstile-response"]')?.value, null, { timeout: 30000 });
  const box = await page.locator(".consultForm > div:not(.hpField)").last().boundingBox();
  assert.ok(box && box.height === 0, `Turnstile container should take no space, got ${JSON.stringify(box)}`);
});

await step("empty required fields block submission (native validation)", async () => {
  const before = (await rows()).length;
  await page.locator("button.submit").click();
  assert.equal(await page.locator(".consultForm").evaluate((f) => f.checkValidity()), false);
  await page.waitForTimeout(500);
  assert.equal((await rows()).length, before);
  assert.equal(await page.locator(".success, .error").count(), 0);
});

async function fillForm(value) {
  await direction.selectOption(value);
  for (const el of await page.locator(".consultForm [required]").all()) {
    const { tag, type, name, readOnly } = await el.evaluate((n) => ({ tag: n.tagName, type: n.type, name: n.name, readOnly: n.readOnly }));
    if (readOnly || name === "consultationDirection") continue;
    if (tag === "SELECT") await el.selectOption({ index: 1 });
    else if (type === "checkbox") await el.check();
    else if (type === "email") await el.fill("qa@example.com");
    else await el.fill(name === "companyName" ? `E2E ${value}` : name === "priceRange" ? "+USD 50" : `Test ${name}`);
  }
}

await step("valid submission (Both directions) shows success, writes the row and resets the form", async () => {
  const before = (await rows()).length;
  await fillForm("Both directions");
  await page.locator("button.submit").click();
  await page.locator(".success").waitFor({ timeout: 15000 });
  const after = await rows();
  assert.equal(after.length, before + 1);
  const row = after.at(-1);
  assert.equal(row["Company name"], "E2E Both directions");
  assert.equal(row["Consultation direction"], "Both directions");
  assert.equal(row["Current price range"], "'+USD 50");
  assert.equal(row["Meeting format"], "Online meeting / 线上会议");
  assert.equal(row["Status"], "new");
  assert.equal(await direction.inputValue(), "");
  assert.equal(await page.locator('[name="companyName"]').inputValue(), "");
});

await step("a fresh Turnstile token is issued after submitting; Entering China submits too", async () => {
  await page.waitForFunction(() => document.querySelector('[name="cf-turnstile-response"]')?.value, null, { timeout: 30000 });
  await fillForm("Entering China");
  await page.locator("button.submit").click();
  await page.waitForFunction(() => document.querySelector(".success"), null, { timeout: 15000 });
  assert.equal((await rows()).at(-1)["Consultation direction"], "Entering China");
});

await step("server rejection ({ok:false}) shows the error state", async () => {
  await page.route(`${API_URL}/exec`, (route) => route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": "*" }, body: '{"ok":false,"error":"x"}' }));
  await fillForm("Going global");
  await page.locator("button.submit").click();
  await page.locator(".error").waitFor({ timeout: 15000 });
  assert.match(await page.locator(".error").innerText(), /Submission was not completed/);
  assert.equal(await page.locator('[name="companyName"]').inputValue(), "E2E Going global", "form keeps the answers on error");
});

await step("network failure (e.g. Google unreachable) shows the error state", async () => {
  await page.unroute(`${API_URL}/exec`);
  await page.route(`${API_URL}/exec`, (route) => route.abort("connectionrefused"));
  await page.locator("button.submit").click();
  await page.locator(".error").waitFor({ timeout: 15000 });
  await page.unroute(`${API_URL}/exec`);
});

await browser.close();
const unexpected = problems.filter((p) => !/ERR_CONNECTION_REFUSED|Failed to load resource/.test(p));
assert.deepEqual(unexpected, [], `Unexpected console errors / CSP violations:\n${unexpected.join("\n")}`);
console.log(`\nAll ${results.length} click-through checks passed; no CSP violations or console errors.`);
