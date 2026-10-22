# Pulse Nova website — developer handoff / 网站交接

Version: 18 · 19 October 2026
Source commit: 2944d6e5f5c5b3421c2c93808814c98dd51c8a3a
Current publication: https://pulse-nova-china-advisory.shanshan9606.chatgpt.site

## 本次更新 / Changes since v17

- 套餐前新增中国企业出海咨询（Going Global）板块、PN真实活动图片、服务说明与交付示例。
- 新增导航及免费咨询入口；出海入口自动选择对应咨询方向并展开问卷。
- 双语问卷增加进入中国、中国企业出海、双向业务选择。中国市场问题和海外市场问题按方向显示。
- 套餐与问卷说明兼容两类业务，后台列表显示咨询方向与目标海外市场。
- API requires a valid consultationDirection. Going global / Both directions additionally require targetMarkets and overseasStage. Legacy clients must be updated accordingly.

## Package / 文件说明

source/: complete tracked source and image assets, package manifest and exact lockfile, database schema/migrations and original hosting integration. Old archives, dependencies, Git history, runtime state, passwords and customer data are excluded.
QA-RESULTS.md: test evidence and limits.
tests/test-pn-worker.mjs: reproducible integration checks against the compiled Worker with an isolated database.
ENVIRONMENT.example.txt: destination settings checklist, no real secrets.

## Setup / 开发环境

Node.js >=22.13.0; pnpm 11.25.0 (see package.json).
From source/: pnpm install --frozen-lockfile; pnpm dev; pnpm build.
This is a Vinext/Vite + Cloudflare Workers application with D1 persistence, not a static HTML upload. The npm start script starts a local Wrangler environment, not a production deployment.

## Migration to PN / 迁入官网

1. Choose a subdomain or a path on pulsenova.gg. Existing URLs are root-relative: assets, /api/consultations and navigation. For a subdirectory, adapt all paths and framework routing together.
2. Configure the company's own Cloudflare Worker, static assets and D1 database bound as DB. Apply SQL in source/drizzle. Replace the placeholder database ID in the destination configuration.
3. The retained .openai/hosting.json and Sites build integration describe the current host. Preserve the source snapshot for reference, but adapt these to the company's host. Do not publish using the original Sites project ID.
4. Set ADMIN_KEY in the target secret store. Optionally configure RESEND_API_KEY, EMAIL_FROM (verified sender) and EMAIL_TO. Without RESEND_API_KEY, successful submissions are saved but no email notification is sent.
5. For Node, Vercel, WordPress or other hosting, adapt Cloudflare-specific imports in db/index.ts and app/api/consultations/route.ts and replace the database adapter; the current bundle is not directly portable to those runtimes.
6. On staging, test both consultation directions and Both directions, mobile layout, field switching, validation, successful submission, admin record details and CSV export. Test optional email delivery separately.
7. Existing production records are not part of the ZIP. Export from the current /responses page separately if migration is required.

主要页面：/ 首页；/responses 后台；/api/consultations 提交及后台读取接口。
数据库与后台密码需重新配置。历史报名数据需另行导出迁移。先在测试环境验收，再切换正式域名。

## Asset provenance

public/pn-official-logo.png: https://pulsenova.gg/images/logo.png
public/pn-overseas-project.webp: https://pulsenova.gg/images/case-studies/mlbb-mediacorp.png
public/ciie-sbf.webp: https://fay-ying.yingzhifei328890.chatgpt.site/work/ciie-sbf-fay.jpg
Other images retained from the prior site. External font loading remains in the existing implementation; review destination-network access.
