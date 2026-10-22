// Local stand-in for the deployed Apps Script web app: `npm run mock:api`.
// Runs the real apps-script/Code.gs against an in-memory copy of the response sheet and mimics
// Google's behaviour: POST /exec answers 302 → GET /echo returns the JSON (CORS: *).
//   FAIL=1 npm run mock:api   → every submission returns {ok:false} (to see the error state)
//   GET /rows                 → the rows written so far
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { createAppsScript } from "./apps-script-sandbox.mjs";

const PORT = Number(process.env.PORT ?? 8790);
const fail = process.env.FAIL === "1";

// Turnstile test site keys always issue this dummy token; siteverify is simulated here.
const api = createAppsScript({
  properties: { TURNSTILE_SECRET: "mock-secret", ALLOWED_HOSTNAMES: "localhost,127.0.0.1" },
  fetch: (_url, params) => ({ code: 200, body: { success: params.payload.response === "XXXX.DUMMY.TOKEN.XXXX", hostname: "localhost" } }),
});
const replies = new Map();
const cors = { "access-control-allow-origin": "*" };

createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  if (req.method === "POST" && url.pathname === "/exec") {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      const reply = fail ? { ok: false, error: "Mock failure (FAIL=1)" } : api.post(body);
      delete reply.mimeType;
      console.log(`POST /exec ${req.headers["content-type"]} → ${JSON.stringify(reply)}`);
      const id = randomUUID();
      replies.set(id, reply);
      res.writeHead(302, { ...cors, location: `/echo?id=${id}` }).end();
    });
    return;
  }
  if (req.method === "GET" && url.pathname === "/echo") {
    const reply = replies.get(url.searchParams.get("id") ?? "") ?? { ok: false, error: "Unknown reply" };
    res.writeHead(200, { ...cors, "content-type": "application/json" }).end(JSON.stringify(reply));
    return;
  }
  if (req.method === "GET" && url.pathname === "/exec") {
    res.writeHead(200, { ...cors, "content-type": "application/json" }).end(JSON.stringify({ ok: true }));
    return;
  }
  if (req.method === "GET" && url.pathname === "/rows") {
    res.writeHead(200, { ...cors, "content-type": "application/json" }).end(JSON.stringify(api.sheet()?.records() ?? [], null, 2));
    return;
  }
  res.writeHead(404, cors).end();
}).listen(PORT, "127.0.0.1", () => console.log(`Mock Apps Script on http://127.0.0.1:${PORT}/exec${fail ? " (FAIL=1)" : ""}`));
