import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const MOCK_APPS_SCRIPT_URL = "http://127.0.0.1:8790/exec";
const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";

// GitHub Pages cannot send response headers, so the production build carries its
// security policy as <meta> tags. frame-ancestors/HSTS cannot be expressed this way.
function securityMeta(appsScriptUrl: string): Plugin {
  const csp = [
    "default-src 'self'",
    `script-src 'self' ${TURNSTILE_ORIGIN}`,
    `frame-src ${TURNSTILE_ORIGIN}`,
    `connect-src 'self' ${new URL(appsScriptUrl).origin} https://script.googleusercontent.com`,
    "img-src 'self' data:",
    "style-src 'self'",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
  return {
    name: "security-meta",
    apply: "build",
    transformIndexHtml: () => [
      { tag: "meta", attrs: { "http-equiv": "Content-Security-Policy", content: csp }, injectTo: "head-prepend" },
      { tag: "meta", attrs: { name: "referrer", content: "strict-origin-when-cross-origin" }, injectTo: "head" },
    ],
  };
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, rootDir, "");
  let appsScriptUrl = env.VITE_APPS_SCRIPT_URL;
  if (!appsScriptUrl) {
    if (env.CI) throw new Error("VITE_APPS_SCRIPT_URL must be set for CI/production builds.");
    if (command === "build") console.warn(`\n⚠ VITE_APPS_SCRIPT_URL is not set; using the local mock ${MOCK_APPS_SCRIPT_URL}. Do not deploy this build.\n`);
    appsScriptUrl = MOCK_APPS_SCRIPT_URL;
  }
  // Cloudflare's documented test keys start with 1x/2x/3x0000…; they never pass with a real secret.
  if (env.CI && /^[123]x0{8}/.test(env.VITE_TURNSTILE_SITE_KEY ?? "")) {
    throw new Error("VITE_TURNSTILE_SITE_KEY is a Turnstile test key; set the real site key (or leave it empty to disable Turnstile).");
  }

  return {
    root: "web",
    envDir: rootDir,
    base: env.BASE_PATH || "/",
    define: { "import.meta.env.VITE_APPS_SCRIPT_URL": JSON.stringify(appsScriptUrl) },
    plugins: [react(), securityMeta(appsScriptUrl)],
    // Never inline font subsets as data: URIs — the CSP only allows fonts from 'self'.
    build: { outDir: "../dist", emptyOutDir: true, assetsInlineLimit: (file) => (/\.woff2?$/.test(file) ? false : undefined) },
    preview: { port: 4173, strictPort: true },
  };
});
