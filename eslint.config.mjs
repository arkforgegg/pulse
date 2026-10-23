import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", "node_modules/", "source/", "tests/", "docs/", ".original/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["web/src/**/*.{ts,tsx}"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    files: ["*.{ts,mjs}", "scripts/**/*.mjs", "test/**/*.ts"],
    languageOptions: { globals: globals.node },
  },
  {
    // Playwright scripts: page.evaluate callbacks run in the browser.
    files: ["scripts/click-through.mjs", "scripts/visual-parity.mjs"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    // Apps Script: classic script with platform globals; functions are entry points called by Google.
    files: ["apps-script/**/*.gs"],
    languageOptions: {
      sourceType: "script",
      ecmaVersion: 2020,
      globals: {
        ...globals.es2020,
        SpreadsheetApp: "readonly", LockService: "readonly", PropertiesService: "readonly", UrlFetchApp: "readonly",
        MailApp: "readonly", ContentService: "readonly", Utilities: "readonly", console: "readonly",
      },
    },
    rules: {
      "no-var": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": ["error", { varsIgnorePattern: "^(doPost|doGet|setup|selfTest)$" }],
    },
  },
);
