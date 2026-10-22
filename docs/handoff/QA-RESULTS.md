# Verification — v18 / 测试结果

TypeScript check and production build passed for commit 2944d6e5f5c5b3421c2c93808814c98dd51c8a3a. Version 18 publication succeeded.

Integration tests ran against that exact compiled Worker with an isolated local Cloudflare D1-compatible database:

| Scenario | Submitted fields | POST | Database payload | Admin API |
|---|---:|---|---|---|
| Entering China | 31 | 201 Created | All fields matched | Read twice; all fields matched |
| Going global | 30 | 201 Created | All fields matched | Read twice; all fields matched |

Additional checks passed: unauthenticated admin request rejected (401); overseas submission missing markets/stage rejected (400); Going Global section precedes pricing; admin page renders; image included in build.

Reproduce after building: from source/, run node ../tests/test-pn-worker.mjs. It creates an isolated test database and uses a non-production test key. It does not contact the production API or send email notifications.

## Limits / 验证范围

The live submission request was blocked by Cloudflare (403 / 1010) before reaching the application. Live production submission/storage was NOT verified. No live test record was successfully created by that request.
Browser click-through, conditional-field interaction and visual/mobile QA were NOT performed because browser QA tooling was unavailable. Both directions is implemented but was not separately submitted in the two integration scenarios. Email delivery was not tested.

两次接口/数据库测试均通过，但不能视为线上端到端验收。请研发在目标环境实测表单操作、后台记录、导出及可选邮件通知，再上线。
