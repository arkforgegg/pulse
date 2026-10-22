import { describe, expect, it } from "vitest";
import { createAppsScript, LIVE_HEADERS } from "../scripts/apps-script-sandbox.mjs";

// Realistic payloads, mirroring what the form's FormData loop sends (adapted from the v18 QA script).
const base: Record<string, string | string[]> = {
  preferredDate: "11 Nov 2026", preferredTime: "10:00 GMT+8", meetingFormat: "Online meeting / 线上会议",
  language: "Bilingual / 中英文", companyName: "TEST ONLY", contactName: "QA 验证人员", email: "qa@example.com",
  contactChannel: "+65 9123 4567", website: "example.com", industry: "Consumer Goods / 消费品",
  companyIntro: "Test company / 测试企业", currentMarkets: "Singapore", priorityOfferings: "Consumer products / 消费品",
  sellingPoints: "Quality / 品质", priceRange: "USD 50", previousActivities: "None / 无",
  challenges: "Finding partners / 寻找合作伙伴", priorityGoal: "Validate demand", regions: "Shanghai",
  timeline: "Within 3 months / 3个月内", resourcesNeeded: "Distributors", targetContacts: "Retailers",
  budget: "To be discussed / 待讨论", supportInterest: "Unsure / 暂不确定", consultationFocus: "Market opportunity",
  consent: "Agreed", pn_hp_check: "", "cf-turnstile-response": "XXXX.DUMMY.TOKEN.XXXX",
};
const china = { chinaEntity: "No / 没有", chinaStage: "Market research / 正在调研", trademark: "Not registered / 尚未注册", currentChinaSetup: "None" };
const overseas = { targetMarkets: "Singapore, Malaysia / 新加坡、马来西亚", overseasStage: "Market research / 正在调研", overseasSetup: "None / 无" };
const payloads = {
  "Entering China": { ...base, consultationDirection: "Entering China", ...china },
  "Going global": { ...base, consultationDirection: "Going global", ...overseas },
  "Both directions": { ...base, consultationDirection: "Both directions", ...china, ...overseas },
};
const withTurnstile = { TURNSTILE_SECRET: "secret", ALLOWED_HOSTNAMES: "pulsenova.gg, www.pulsenova.gg" };
const turnstileOk = () => ({ code: 200, body: { success: true, hostname: "pulsenova.gg" } });

describe("doPost — valid submissions", () => {
  for (const [direction, payload] of Object.entries(payloads)) {
    it(`writes one row for "${direction}" under the matching headers`, () => {
      const api = createAppsScript({ properties: withTurnstile, fetch: turnstileOk });
      expect(api.post(payload)).toEqual({ ok: true, mimeType: "application/json" });

      const [row, ...rest] = api.sheet()!.records();
      expect(rest).toHaveLength(0);
      expect(row["Consultation direction"]).toBe(direction);
      expect(row["Company name"]).toBe("TEST ONLY");
      expect(row["Name & job title"]).toBe("QA 验证人员");
      expect(row["WhatsApp / WeChat"]).toBe("'+65 9123 4567"); // neutralised: leading "+"
      expect(row["Information consent"]).toBe("Agreed");
      expect(row["China legal entity"]).toBe(direction === "Going global" ? "" : "No / 没有");
      expect(row["Target overseas markets"]).toBe(direction === "Entering China" ? "" : "Singapore, Malaysia / 新加坡、马来西亚");
      expect(row["Submitted at"]).toMatch(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\+08:00$/);
      expect(row["Status"]).toBe("new");

      const headers = api.sheet()!.cells[0];
      expect(headers.slice(0, 34)).toEqual(LIVE_HEADERS); // live layout untouched
      expect(headers.slice(34)).toEqual(["Submitted at\n提交时间", "Status\n状态"]); // appended at the end
      expect(api.sheet()!.formats.at(-1)).toMatchObject({ row: 2, format: "@" }); // stored as plain text
      expect(api.lock).toEqual({ waits: 1, releases: 1 });
      expect(api.mails).toHaveLength(1);
      expect(api.mails[0].to).toBe("Shanshan.diao@pulsenova.gg");
      expect(api.mails[0].subject).toBe("New consultation · TEST ONLY");
      expect(api.fetchCalls[0].params.payload).toEqual({ secret: "secret", response: "XXXX.DUMMY.TOKEN.XXXX" });
    });
  }

  it("never writes non-whitelisted keys, the token or the honeypot", () => {
    const api = createAppsScript();
    expect(api.post({ ...payloads["Going global"], evil: "x", __proto__x: "y" }).ok).toBe(true);
    const flat = api.sheet()!.cells.flat().join("|");
    expect(flat).not.toContain("XXXX.DUMMY.TOKEN");
    expect(flat).not.toContain("evil");
    expect(api.sheet()!.cells[0]).toHaveLength(36);
  });

  it("neutralises every formula-like prefix", () => {
    const api = createAppsScript();
    api.post({ ...payloads["Entering China"], companyName: "=HYPERLINK(\"http://x\")", regions: "@SUM(A1)", challenges: "-1+1", priceRange: "+100" });
    const [row] = api.sheet()!.records();
    expect(row["Company name"]).toBe("'=HYPERLINK(\"http://x\")");
    expect(row["Preferred cities or regions"]).toBe("'@SUM(A1)");
    expect(row["Biggest market-entry challenges"]).toBe("'-1+1");
    expect(row["Current price range"]).toBe("'+100");
    expect(api.mails[0].subject).toBe("New consultation · =HYPERLINK(\"http://x\")"); // email is plain text, not neutralised
  });

  it("joins multi-value fields with \", \" and applies length caps", () => {
    const api = createAppsScript();
    api.post({ ...payloads["Going global"], targetMarkets: ["Singapore", "Malaysia"], companyName: "A".repeat(500), challenges: "B".repeat(5000) });
    const [row] = api.sheet()!.records();
    expect(row["Target overseas markets"]).toBe("Singapore, Malaysia");
    expect(row["Company name"]).toHaveLength(200);
    expect(row["Biggest market-entry challenges"]).toHaveLength(4000);
  });

  it("maps by header text when staff reorder or add columns", () => {
    const reordered = [...LIVE_HEADERS].reverse();
    reordered.splice(3, 0, "Staff notes\n备注");
    const api = createAppsScript({ headers: reordered });
    api.post(payloads["Both directions"]);
    const [row] = api.sheet()!.records();
    expect(row["Work email"]).toBe("qa@example.com");
    expect(row["Overseas expansion stage"]).toBe("Market research / 正在调研");
    expect(row["Staff notes"]).toBe("");
  });

  it("creates the tab and all headers when the tab is missing", () => {
    const api = createAppsScript({ headers: null });
    expect(api.post(payloads["Entering China"]).ok).toBe(true);
    expect(api.sheet()!.cells[0]).toEqual([...LIVE_HEADERS, "Submitted at\n提交时间", "Status\n状态"]);
    expect(api.sheet()!.records()).toHaveLength(1);
  });

  it("still saves the row when the notification email fails", () => {
    const api = createAppsScript({ mailFails: true });
    expect(api.post(payloads["Entering China"]).ok).toBe(true);
    expect(api.sheet()!.records()).toHaveLength(1);
  });

  it("accepts every email the browser's type=email accepts, e.g. without a dot in the domain", () => {
    for (const email of ["name@company", "first.last+tag@sub.example.co", "王@例子.中国"]) {
      const api = createAppsScript();
      expect(api.post({ ...payloads["Entering China"], email }).ok, email).toBe(true);
    }
  });

  it("skips Turnstile when no secret is configured, and email when NOTIFY_EMAIL=off", () => {
    const api = createAppsScript({ properties: { NOTIFY_EMAIL: "off" } });
    expect(api.post(payloads["Entering China"]).ok).toBe(true);
    expect(api.fetchCalls).toHaveLength(0);
    expect(api.mails).toHaveLength(0);
  });
});

describe("doPost — rejected submissions write nothing", () => {
  const rejects = (payload: unknown, error: string, options: Parameters<typeof createAppsScript>[0] = {}) => {
    const api = createAppsScript(options);
    expect(api.post(payload as object)).toMatchObject({ ok: false, error });
    expect(api.sheet()!.records()).toHaveLength(0);
    expect(api.mails).toHaveLength(0);
    return api;
  };

  for (const field of ["companyName", "contactName", "email", "consent"]) {
    it(`missing ${field}`, () => rejects({ ...payloads["Entering China"], [field]: "  " }, "Required fields are missing."));
  }
  for (const email of ["not-an-email", "a@.com", "a@b..com", "a b@c.com", "a@b@c.com"]) {
    it(`invalid email ${email}`, () => rejects({ ...payloads["Entering China"], email }, "Please provide a valid email address."));
  }
  it("unknown direction", () => rejects({ ...payloads["Entering China"], consultationDirection: "Sideways" }, "Please select a consultation direction."));
  it("going global without targetMarkets", () => rejects({ ...payloads["Going global"], targetMarkets: "" }, "Please provide your target overseas markets and expansion stage."));
  it("both directions without overseasStage", () => rejects({ ...payloads["Both directions"], overseasStage: undefined }, "Please provide your target overseas markets and expansion stage."));
  it("body over 32 KB (counted in UTF-8 bytes)", () => rejects({ ...payloads["Entering China"], challenges: "中".repeat(11000) }, "Request is too large."));
  it("invalid JSON", () => rejects("{not json", "Invalid request."));
  it("JSON array", () => rejects("[1,2]", "Invalid request."));
  it("empty body", () => rejects("", "Empty request."));

  it("Turnstile failure", () => {
    const api = rejects(payloads["Entering China"], "Verification failed. Please try again.",
      { properties: withTurnstile, fetch: () => ({ code: 200, body: { success: false, "error-codes": ["invalid-input-response"] } }) });
    expect(api.fetchCalls).toHaveLength(1);
  });
  it("Turnstile token from another hostname", () => rejects(payloads["Entering China"], "Verification failed. Please try again.",
    { properties: withTurnstile, fetch: () => ({ code: 200, body: { success: true, hostname: "evil.example" } }) }));
  it("Turnstile siteverify outage", () => rejects(payloads["Entering China"], "Verification failed. Please try again.",
    { properties: withTurnstile, fetch: () => ({ code: 500, body: "oops" }) }));
  it("missing Turnstile token", () => {
    const api = rejects({ ...payloads["Entering China"], "cf-turnstile-response": "" }, "Verification failed. Please try again.", { properties: withTurnstile });
    expect(api.fetchCalls).toHaveLength(0);
  });
});

describe("doPost — honeypot and health check", () => {
  it("honeypot filled → fake success, nothing written, Turnstile not called", () => {
    const api = createAppsScript({ properties: withTurnstile, fetch: turnstileOk });
    expect(api.post({ ...payloads["Entering China"], pn_hp_check: "123 Bot Street" }).ok).toBe(true);
    expect(api.sheet()!.records()).toHaveLength(0);
    expect(api.fetchCalls).toHaveLength(0);
    expect(api.mails).toHaveLength(0);
  });

  it("doGet answers ok", () => {
    const api = createAppsScript();
    expect(JSON.parse(api.context.doGet().content)).toEqual({ ok: true });
  });

  it("an unexpected exception returns a generic error", () => {
    const api = createAppsScript();
    api.context.LockService.getScriptLock = () => { throw new Error("Lock timeout"); };
    expect(api.post(payloads["Entering China"])).toMatchObject({ ok: false, error: "Unable to save submission." });
  });
});
