# Decision & continuity journal — PickPack 1291

Use one compact semantic checkpoint per meaningful change; preserve **fact, Owner decision, open items, evidence and next step**. No raw chat, personnel data or secrets. `main` accepted; PR state working-only.

## PP-20261114-001 — OWNER APPROVED / 14-11-2026
- **Scope:** only `tamnv2/pickpack` writable; other Owner repositories read-only solely on request; `supra-inventory` never mutable.
- **Process:** every new chat bootstraps from GitHub; all substantive changes recorded using shortest complete semantic checkpoints; verify commit/readback; seven files for bootstrap; no speculative folders.
- **Product:** APK+Web realtime, 3 concurrent PDA and 5 Web; personnel/portraits, operator shift scans and work user, daily labor, minutes, CCDC and PDA borrowing/return; later features individually approved.
- **Identity:** shared Firebase Auth **and authoritative per-user roles**, not just shared UID. Preserve actual role (e.g. Inventory `PICKPACK_ADMIN` → PickPack `PICKPACK_ADMIN`; `PICKER` → `PICKER`); per-feature authorization remains server controlled. Shared Cloudflare account; independent Worker and OpsCore.
- **Release gate:** CODE ONLY by default → build/test/report CODE_READY; Owner separate explicit authorization required before merge/production deployment, shared provider writes or costs.
- **FACT:** read-only Inventory source `service/src/auth.ts` defines `PICKER/REPORTER/ADMIN/PICKPACK_ADMIN/OBPP_COORDINATOR/ROOT`; authentication design is Worker-driven. Existing secure cross-app role-read contract **not yet verified**. `pickpack` was empty pre-bootstrap.
- **NEXT:** verify role-consumption path without touching Inventory; design/approve exact PickPack business permission matrix and provider resource scope before app code. No Production release authorized.

## PP-20261114-002 — OWNER APPROVED / 14-11-2026
- **Task:** revise project AI context with `Smart Lazy`; retain previously approved scope, 3 PDA + 5 Web, shared canonical Firebase roles, isolated OpsCore/Worker, minimal semantic checkpoints, public repo security, CODE ONLY until Owner Production release order.
- **Smart Lazy:** result-first; eliminate unnecessary steps → reuse proven authorized PickPack code → automate only net-beneficial repetition → simplify; targeted repo reads after mandatory bootstrap; no-change if already satisfied; minimum risk-based tests and no duplicate CI/commits. Never bypass RBAC, security, realtime, quality or approval.
- **Work boundary:** `AGENTS.md` instruction-only, `ops/state.json` working pointer and this journal; no app/provider code changes or release. Draft PR only; accepted `main` remains unchanged until authorized merge.
- **NEXT:** review Draft PR, then Owner may explicitly approve merge of docs only. Other existing integration/business blockers unchanged.

## PP-20261114-003 — DISCUSSION / PROPOSED / 14-11-2026
- **Question:** can independent repo/Worker use `pickpack.supra.cc.cd` under same Cloudflare account/zone as `inventory.supra.cc.cd`?
- **FACT:** Cloudflare Custom Domains permit separate subdomains mapped to separate Workers in one zone; Cloudflare manages DNS/HTTPS after domain attach. Independent GitHub repos are allowed. Account-wide usage/billing remains shared. Evidence: Cloudflare Workers Custom Domains and Pricing docs (checked 14-11-2026).
- **PROPOSED, NOT APPROVED:** `pickpack.supra.cc.cd` -> separate PickPack Worker; keep existing Inventory hostname/Worker untouched. Confirm hostname not already occupied before any binding. No provider change, no Production authorization.
- **NEXT:** await Owner explicit selection/production deployment order; no deployment or new infrastructure from this question.
