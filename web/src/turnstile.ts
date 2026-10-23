import { RefObject, useCallback, useEffect, useRef } from "react";

// Cloudflare Turnstile, rendered explicitly into the form. The widget adds a hidden
// `cf-turnstile-response` input to the form, so the token travels with the FormData.
// With appearance "interaction-only" it stays invisible unless a visitor must be challenged.
// The script is only loaded once the visitor opens the booking form (no third-party request otherwise).

type Turnstile = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
  getResponse: (widgetId: string) => string | undefined;
};
declare global { interface Window { turnstile?: Turnstile } }

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TOKEN_WAIT_MS = 15000;
let scriptPromise: Promise<Turnstile> | undefined;

function loadTurnstile(): Promise<Turnstile> {
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile unavailable")));
    script.onerror = () => { scriptPromise = undefined; reject(new Error("Turnstile failed to load")); };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Renders the widget into `ref` the first time `disclosureRef` opens (no-op without a site key).
 * Returns `waitForToken` (resolves once a token is available, or after a timeout so the server
 * can answer) and `reset` (tokens are single-use).
 */
export function useTurnstile(ref: RefObject<HTMLDivElement | null>, disclosureRef: RefObject<HTMLDetailsElement | null>) {
  const widgetId = useRef<string | undefined>(undefined);
  const rendering = useRef<Promise<void> | undefined>(undefined);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  const ensureRendered = useCallback(() => {
    const el = ref.current;
    if (!siteKey || !el) return Promise.resolve();
    rendering.current ??= loadTurnstile()
      .then((ts) => { widgetId.current = ts.render(el, { sitekey: siteKey, appearance: "interaction-only", "refresh-expired": "auto" }); })
      .catch((error) => { rendering.current = undefined; console.error(error); });
    return rendering.current;
  }, [ref, siteKey]);

  useEffect(() => {
    const details = disclosureRef.current;
    if (!siteKey || !details) return;
    const onToggle = () => { if (details.open) void ensureRendered(); };
    details.addEventListener("toggle", onToggle);
    onToggle();
    return () => {
      details.removeEventListener("toggle", onToggle);
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = undefined;
      rendering.current = undefined;
    };
  }, [disclosureRef, ensureRendered, siteKey]);

  const waitForToken = useCallback(async () => {
    if (!siteKey) return;
    await ensureRendered();
    const deadline = Date.now() + TOKEN_WAIT_MS;
    while (Date.now() < deadline) {
      if (widgetId.current && window.turnstile?.getResponse(widgetId.current)) return;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }, [ensureRendered, siteKey]);

  const reset = useCallback(() => {
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  }, []);

  return { waitForToken, reset };
}
