import { RefObject, useCallback, useEffect, useRef } from "react";

// Cloudflare Turnstile, rendered explicitly into the form. The widget adds a hidden
// `cf-turnstile-response` input to the form, so the token travels with the FormData.
// With appearance "interaction-only" it stays invisible unless a visitor must be challenged.

type Turnstile = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
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

/** Renders the widget into `ref` (no-op when no site key is configured) and returns a reset function. */
export function useTurnstile(ref: RefObject<HTMLDivElement | null>) {
  const widgetId = useRef<string | undefined>(undefined);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    const el = ref.current;
    if (!siteKey || !el) return;
    let cancelled = false;
    loadTurnstile().then((ts) => {
      if (cancelled) return;
      widgetId.current = ts.render(el, { sitekey: siteKey, appearance: "interaction-only", "refresh-expired": "auto" });
    }).catch((error) => console.error(error));
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = undefined;
    };
  }, [ref, siteKey]);

  // Tokens are single-use: get a fresh one after every submission attempt.
  return useCallback(() => {
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  }, []);
}
