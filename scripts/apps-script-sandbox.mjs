// Runs the real apps-script/Code.gs in a Node vm with in-memory fakes of the Google services it
// uses (SpreadsheetApp, LockService, PropertiesService, UrlFetchApp, MailApp, ContentService,
// Utilities). Shared by the unit tests and the local mock server.
import { readFileSync } from "node:fs";
import vm from "node:vm";

const CODE_PATH = new URL("../apps-script/Code.gs", import.meta.url);

/** The header row of the live "Responses 客户数据" tab (as of 2026-10-22). */
export const LIVE_HEADERS = [
  "Consultation direction\n咨询方向", "Preferred date\n希望预约日期", "Preferred time & timezone\n希望预约时间及所在时区",
  "Meeting format\n会议形式", "Consultation language\n咨询语言", "Company name\n公司名称", "Name & job title\n姓名及职位",
  "Work email\n工作邮箱", "WhatsApp / WeChat\nWhatsApp或微信", "Company website\n公司网站", "Industry / category\n行业或品类",
  "Company introduction\n公司简介", "Current markets\n目前开展业务的市场", "Priority products or services\n计划优先拓展市场的产品或服务",
  "Main selling points\n主要卖点", "Current price range\n当前价格区间", "China legal entity\n是否有中国主体",
  "China market stage\n目前中国市场阶段", "Trademark in China\n是否已注册中国商标",
  "Current China channels, team or partners\n现有渠道、团队或合作伙伴", "Target overseas markets\n计划进入的海外国家或地区",
  "Overseas expansion stage\n当前出海阶段", "Existing overseas team or partners\n现有海外团队、主体或合作伙伴",
  "Previous activities and results\n曾开展的活动及结果", "Biggest market-entry challenges\n当前最大的市场拓展困难",
  "6–12 month priority\n未来6–12个月最重要目标", "Preferred cities or regions\n优先城市或地区", "Expected timeline\n预计启动时间",
  "Resources needed\n目前最需要的资源", "Partners or customers to connect with\n希望建联的合作伙伴或客户类型",
  "Initial target-market budget\n目标市场初步预算", "Support of interest\n感兴趣的服务",
  "What should PN address first?\n最希望PN优先解决的问题", "Information consent\n信息使用授权",
];

class FakeSheet {
  constructor(name, headers) {
    this.name = name;
    this.cells = headers ? [[...headers]] : [];
    this.formats = [];
    this.formulas = [];
  }
  getLastRow() {
    for (let r = this.cells.length; r > 0; r--) if (this.cells[r - 1].some((v) => v !== "" && v != null)) return r;
    return 0;
  }
  getLastColumn() {
    let max = 0;
    for (const row of this.cells) for (let c = row.length; c > max; c--) if (row[c - 1] !== "" && row[c - 1] != null) { max = c; break; }
    return max;
  }
  getRange(row, column, numRows = 1, numColumns = 1) {
    const { cells, formats, formulas } = this;
    // Mirrors real Sheets (verified with selfTest() on 2026-10-22): a leading apostrophe is consumed and the
    // rest stored as text; a string starting with "=" becomes a formula even in plain-text (@) cells.
    const store = (v) => {
      if (typeof v !== "string") return v;
      if (v.startsWith("'")) return v.slice(1);
      if (v.startsWith("=")) { formulas.push(v); return `<FORMULA ${v}>`; }
      return v;
    };
    const set = (r, c, raw) => { const v = store(raw); while (cells.length < r) cells.push([]); const line = cells[r - 1]; while (line.length < c) line.push(""); line[c - 1] = v; };
    return {
      getValues: () => Array.from({ length: numRows }, (_, i) => Array.from({ length: numColumns }, (_, j) => cells[row - 1 + i]?.[column - 1 + j] ?? "")),
      setValue(v) { set(row, column, v); return this; },
      setValues(values) {
        if (values.length !== numRows || values.some((r) => r.length !== numColumns)) throw new Error("setValues: dimensions do not match range");
        values.forEach((r, i) => r.forEach((v, j) => set(row + i, column + j, v)));
        return this;
      },
      setNumberFormat(format) { formats.push({ row, column, numRows, numColumns, format }); return this; },
    };
  }
  /** Data rows as objects keyed by the English line of each header. */
  records() {
    const headers = this.cells[0] ?? [];
    return this.cells.slice(1).map((row) => Object.fromEntries(headers.map((h, i) => [String(h).split("\n")[0], row[i] ?? ""])));
  }
}

/**
 * @param {object} [options]
 * @param {Record<string,string>} [options.properties] Script Properties.
 * @param {string[] | null} [options.headers] Initial header row; null for a missing tab.
 * @param {(url: string, params: any) => {code: number, body: any}} [options.fetch] UrlFetchApp handler.
 * @param {boolean} [options.mailFails]
 */
export function createAppsScript({ properties = {}, headers = LIVE_HEADERS, fetch, mailFails = false } = {}) {
  const sheets = new Map();
  if (headers) sheets.set("Responses 客户数据", new FakeSheet("Responses 客户数据", headers));
  const mails = [];
  const fetchCalls = [];
  const lock = { waits: 0, releases: 0 };

  /** @type {Record<string, any>} */
  const context = {
    console: { log() {}, warn() {}, error() {} },
    unescape, encodeURIComponent, JSON, Date, String, Array, Object, RegExp,
    SpreadsheetApp: {
      getActiveSpreadsheet: () => ({
        getSheetByName: (name) => sheets.get(name) ?? null,
        insertSheet: (name) => { const s = new FakeSheet(name); sheets.set(name, s); return s; },
        getUrl: () => "https://docs.google.com/spreadsheets/d/mock/edit",
      }),
    },
    LockService: { getScriptLock: () => ({ waitLock: () => { lock.waits++; }, releaseLock: () => { lock.releases++; } }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key) => properties[key] ?? null }) },
    UrlFetchApp: {
      fetch(url, params) {
        fetchCalls.push({ url, params });
        const { code, body } = fetch ? fetch(url, params) : { code: 200, body: { success: true, hostname: "localhost" } };
        return { getResponseCode: () => code, getContentText: () => (typeof body === "string" ? body : JSON.stringify(body)) };
      },
    },
    MailApp: {
      sendEmail(to, subject, body) { if (mailFails) throw new Error("Mail quota exceeded"); mails.push({ to, subject, body }); },
      getRemainingDailyQuota: () => 100,
    },
    ContentService: {
      MimeType: { JSON: "application/json" },
      createTextOutput(content) { return { content, mimeType: "text/plain", setMimeType(m) { this.mimeType = m; return this; } }; },
    },
    Utilities: {
      // Only what Code.gs uses: ISO 8601 in Singapore time (UTC+8).
      formatDate(date, timeZone, format) {
        if (format !== "yyyy-MM-dd'T'HH:mm:ssXXX") throw new Error(`Unsupported format ${format}`);
        if (timeZone !== "Asia/Singapore") throw new Error(`Unsupported zone ${timeZone}`);
        return new Date(date.getTime() + 8 * 3600e3).toISOString().slice(0, 19) + "+08:00";
      },
    },
  };
  vm.createContext(context);
  vm.runInContext(readFileSync(CODE_PATH, "utf8"), context, { filename: "Code.gs" });

  return {
    context, mails, fetchCalls, lock,
    sheet: () => sheets.get("Responses 客户数据"),
    /** Calls doPost with a raw body (string) or a payload object, returning the parsed JSON reply. */
    post(body) {
      const output = context.doPost({ postData: { contents: typeof body === "string" ? body : JSON.stringify(body), type: "text/plain" } });
      return { ...JSON.parse(output.content), mimeType: output.mimeType };
    },
  };
}
