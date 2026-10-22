/**
 * Pulse Nova consultation form → Google Sheet.
 *
 * Container-bound to the "PULSE NOVA｜China Entry & Going Global" spreadsheet and deployed as a
 * web app (Execute as: me · Who has access: Anyone). The static site POSTs the form as JSON
 * (Content-Type text/plain, to avoid a CORS preflight). Every response is JSON {ok, error?};
 * Apps Script always answers HTTP 200, so the client checks `ok`.
 *
 * Script Properties (Project Settings → Script Properties):
 *   TURNSTILE_SECRET   Cloudflare Turnstile secret key. If unset, the Turnstile check is skipped.
 *   ALLOWED_HOSTNAMES  Comma-separated hostnames Turnstile tokens must come from, e.g. "pulsenova.gg,www.pulsenova.gg".
 *   NOTIFY_EMAIL       Recipient of new-submission emails. Defaults to DEFAULT_NOTIFY_EMAIL; set to "off" to disable.
 */

var SHEET_NAME = 'Responses 客户数据';
var DEFAULT_NOTIFY_EMAIL = 'Shanshan.diao@pulsenova.gg';
var TIME_ZONE = 'Asia/Singapore';
var MAX_BODY_BYTES = 32 * 1024;
var HONEYPOT_FIELD = 'pn_hp_check';
var TURNSTILE_FIELD = 'cf-turnstile-response';
var DIRECTIONS = ['Entering China', 'Going global', 'Both directions'];
var REQUIRED = ['companyName', 'contactName', 'email', 'consent'];
var LIMITS = { companyName: 200, contactName: 200, email: 240, contactChannel: 120 };
var DEFAULT_LIMIT = 4000;

// Whitelisted form fields, in sheet order. Columns are matched on the English (first) line of
// each header, so staff may reorder columns; missing columns are appended with this header text.
var FIELDS = [
  ['consultationDirection', 'Consultation direction', '咨询方向'],
  ['preferredDate', 'Preferred date', '希望预约日期'],
  ['preferredTime', 'Preferred time & timezone', '希望预约时间及所在时区'],
  ['meetingFormat', 'Meeting format', '会议形式'],
  ['language', 'Consultation language', '咨询语言'],
  ['companyName', 'Company name', '公司名称'],
  ['contactName', 'Name & job title', '姓名及职位'],
  ['email', 'Work email', '工作邮箱'],
  ['contactChannel', 'WhatsApp / WeChat', 'WhatsApp或微信'],
  ['website', 'Company website', '公司网站'],
  ['industry', 'Industry / category', '行业或品类'],
  ['companyIntro', 'Company introduction', '公司简介'],
  ['currentMarkets', 'Current markets', '目前开展业务的市场'],
  ['priorityOfferings', 'Priority products or services', '计划优先拓展市场的产品或服务'],
  ['sellingPoints', 'Main selling points', '主要卖点'],
  ['priceRange', 'Current price range', '当前价格区间'],
  ['chinaEntity', 'China legal entity', '是否有中国主体'],
  ['chinaStage', 'China market stage', '目前中国市场阶段'],
  ['trademark', 'Trademark in China', '是否已注册中国商标'],
  ['currentChinaSetup', 'Current China channels, team or partners', '现有渠道、团队或合作伙伴'],
  ['targetMarkets', 'Target overseas markets', '计划进入的海外国家或地区'],
  ['overseasStage', 'Overseas expansion stage', '当前出海阶段'],
  ['overseasSetup', 'Existing overseas team or partners', '现有海外团队、主体或合作伙伴'],
  ['previousActivities', 'Previous activities and results', '曾开展的活动及结果'],
  ['challenges', 'Biggest market-entry challenges', '当前最大的市场拓展困难'],
  ['priorityGoal', '6–12 month priority', '未来6–12个月最重要目标'],
  ['regions', 'Preferred cities or regions', '优先城市或地区'],
  ['timeline', 'Expected timeline', '预计启动时间'],
  ['resourcesNeeded', 'Resources needed', '目前最需要的资源'],
  ['targetContacts', 'Partners or customers to connect with', '希望建联的合作伙伴或客户类型'],
  ['budget', 'Initial target-market budget', '目标市场初步预算'],
  ['supportInterest', 'Support of interest', '感兴趣的服务'],
  ['consultationFocus', 'What should PN address first?', '最希望PN优先解决的问题'],
  ['consent', 'Information consent', '信息使用授权']
];
var META_COLUMNS = [
  ['submittedAt', 'Submitted at', '提交时间'],
  ['status', 'Status', '状态']
];

function doPost(e) {
  var result;
  try {
    result = handleSubmission_(e && e.postData ? e.postData.contents : '');
    if (!result.ok) console.warn('Submission rejected: ' + result.error);
  } catch (error) {
    console.error('Consultation submission failed', error);
    result = { ok: false, error: 'Unable to save submission.' };
  }
  return json_(result);
}

/** Health check: GET the /exec URL and expect {"ok":true}. */
function doGet() {
  return json_({ ok: true });
}

/** Run once from the editor: grants permissions, creates missing columns, logs the configuration. */
function setup() {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    columnMap_(getSheet_());
  } finally {
    lock.releaseLock();
  }
  var props = PropertiesService.getScriptProperties();
  console.log('Sheet ready: ' + SHEET_NAME);
  console.log('TURNSTILE_SECRET ' + (props.getProperty('TURNSTILE_SECRET')
    ? 'set — the GitHub variable VITE_TURNSTILE_SITE_KEY MUST also be set, or every submission is rejected'
    : 'NOT set (verification skipped) — leave VITE_TURNSTILE_SITE_KEY empty too'));
  console.log('ALLOWED_HOSTNAMES ' + (props.getProperty('ALLOWED_HOSTNAMES') || '(any)'));
  console.log('NOTIFY_EMAIL ' + notifyEmail_(props));
  console.log('Mail quota remaining today: ' + MailApp.getRemainingDailyQuota());
}

/**
 * Diagnostic, run once from the editor: shows how Sheets stores values written the way appendRecord_
 * writes them (plain-text format + setValues), with and without the formula-neutralising apostrophe.
 * Writes to a temporary tab, logs the results, then deletes the tab. Paste the log back to the developer.
 */
function selfTest() {
  var samples = ['+65 9123 4567', "'+65 9123 4567", '=1+1', "'=1+1", '+1+1', "'+1+1", '-5', '@SUM(1)', '0123', '11 Nov 2026'];
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.insertSheet('_selftest_' + new Date().getTime());
  try {
    var plain = sheet.getRange(1, 1, 1, samples.length);
    plain.setNumberFormat('@');
    plain.setValues([samples]);
    var automatic = sheet.getRange(2, 1, 1, samples.length);
    automatic.setValues([samples]);
    SpreadsheetApp.flush();
    [['plain text (@)', plain], ['automatic', automatic]].forEach(function (pair) {
      var values = pair[1].getValues()[0];
      var shown = pair[1].getDisplayValues()[0];
      var formulas = pair[1].getFormulas()[0];
      console.log('--- ' + pair[0] + ' ---');
      for (var i = 0; i < samples.length; i++) {
        console.log(JSON.stringify(samples[i]) + ' → value ' + JSON.stringify(values[i]) + ' · shown ' + JSON.stringify(shown[i]) +
          (formulas[i] ? ' · FORMULA ' + JSON.stringify(formulas[i]) : ''));
      }
    });
  } finally {
    spreadsheet.deleteSheet(sheet);
  }
}

function handleSubmission_(raw) {
  if (!raw) return { ok: false, error: 'Empty request.' };
  if (utf8Length_(raw) > MAX_BODY_BYTES) return { ok: false, error: 'Request is too large.' };
  var data;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'Invalid request.' };
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { ok: false, error: 'Invalid request.' };

  // Bots fill every input; pretend success so they don't retry.
  if (clean_(data[HONEYPOT_FIELD], 200)) return { ok: true };

  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('TURNSTILE_SECRET');
  if (secret && !verifyTurnstile_(secret, clean_(data[TURNSTILE_FIELD], 2048), props.getProperty('ALLOWED_HOSTNAMES'))) {
    return { ok: false, error: 'Verification failed. Please try again.' };
  }

  var validated = validate_(data);
  if (validated.error) return { ok: false, error: validated.error };

  appendRecord_(validated.record);
  try {
    sendNotification_(validated.record, props);
  } catch (error) {
    console.error('Email notification failed', error);
  }
  return { ok: true };
}

/** Whitelists, trims and caps the known fields, then applies the direction rules. */
function validate_(data) {
  var record = {};
  for (var i = 0; i < FIELDS.length; i++) {
    var key = FIELDS[i][0];
    record[key] = clean_(data[key], LIMITS[key] || DEFAULT_LIMIT);
  }
  for (var j = 0; j < REQUIRED.length; j++) {
    if (!record[REQUIRED[j]]) return { error: 'Required fields are missing.' };
  }
  if (!/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*$/.test(record.email)) return { error: 'Please provide a valid email address.' };
  if (DIRECTIONS.indexOf(record.consultationDirection) === -1) return { error: 'Please select a consultation direction.' };
  if (record.consultationDirection !== 'Entering China' && (!record.targetMarkets || !record.overseasStage)) {
    return { error: 'Please provide your target overseas markets and expansion stage.' };
  }
  return { record: record };
}

function clean_(value, max) {
  if (typeof value === 'string') return value.trim().slice(0, max);
  if (Array.isArray(value)) return value.map(String).join(', ').slice(0, max);
  return '';
}

/** Stops user input from being evaluated as a spreadsheet formula. */
function neutralise_(value) {
  return /^[=+\-@\t\r]/.test(value) ? "'" + value : value;
}

function utf8Length_(text) {
  return unescape(encodeURIComponent(text)).length;
}

function verifyTurnstile_(secret, token, allowedHostnames) {
  if (!token) return false;
  var response = UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'post',
    payload: { secret: secret, response: token },
    muteHttpExceptions: true
  });
  if (response.getResponseCode() !== 200) return false;
  var outcome = JSON.parse(response.getContentText());
  if (outcome.success !== true) return false;
  var allowed = String(allowedHostnames || '').split(',').map(function (h) { return h.trim().toLowerCase(); }).filter(String);
  return allowed.length === 0 || allowed.indexOf(String(outcome.hostname || '').toLowerCase()) !== -1;
}

function appendRecord_(record) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getSheet_();
    var columns = columnMap_(sheet);
    var values = {};
    for (var key in record) values[key] = neutralise_(record[key]);
    values.submittedAt = Utilities.formatDate(new Date(), TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
    values.status = 'new';

    var row = [];
    for (var c = 0; c < columns.width; c++) row.push('');
    for (var k in columns.index) row[columns.index[k] - 1] = values[k] || '';

    var range = sheet.getRange(sheet.getLastRow() + 1, 1, 1, columns.width);
    range.setNumberFormat('@');
    range.setValues([row]);
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

/** Maps field keys to 1-based column numbers, appending any missing header. */
function columnMap_(sheet) {
  var lastColumn = sheet.getLastColumn();
  var headers = lastColumn ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0] : [];
  var byLabel = {};
  for (var i = 0; i < headers.length; i++) {
    var label = headerKey_(headers[i]);
    if (label && !(label in byLabel)) byLabel[label] = i + 1;
  }
  var index = {};
  var width = headers.length;
  var columns = FIELDS.concat(META_COLUMNS);
  for (var j = 0; j < columns.length; j++) {
    var column = byLabel[headerKey_(columns[j][1])];
    if (!column) {
      column = ++width;
      sheet.getRange(1, column).setValue(columns[j][1] + '\n' + columns[j][2]);
    }
    index[columns[j][0]] = column;
  }
  return { index: index, width: width };
}

function headerKey_(header) {
  return String(header || '').split('\n')[0].trim().toLowerCase();
}

function notifyEmail_(props) {
  return (props.getProperty('NOTIFY_EMAIL') || DEFAULT_NOTIFY_EMAIL).trim();
}

function sendNotification_(record, props) {
  var to = notifyEmail_(props);
  if (!to || to.toLowerCase() === 'off') return;
  var lines = [];
  for (var i = 0; i < FIELDS.length; i++) {
    var value = record[FIELDS[i][0]];
    if (value) lines.push(FIELDS[i][1] + ' / ' + FIELDS[i][2] + ':\n' + value + '\n');
  }
  lines.push('Open the sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
  MailApp.sendEmail(to, 'New consultation · ' + record.companyName.slice(0, 160), lines.join('\n'));
}

function json_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
