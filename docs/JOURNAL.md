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

## PP-20261114-002 — OWNER APPROVED UI-FIRST / 14-11-2026
- **APPROVED:** Web UI prototype before business logic/data/API/APK; Admin Demo is mock, not shared Firebase identity/role; Owner reviews UI before next phase. Public/Production deployment not authorized.
- **DONE (working PR only):** self-contained `prototype/index.html`, 7 UI sections with fictional records, local search/filter/add, desktop/mobile responsive, no remote assets or network calls. No backend/Auth/DB/Worker/APK.
- **VERIFY:** local Chromium smoke at 1366×900 and 390×844: demo entry, navigation, search, filter, temporary add, reload reset, XSS-text escaping, no external requests or console page errors. No CI configured; UI not yet Owner accepted.
- **NEXT:** Owner reviews UI and requests corrections. Identity-authority verification, business RBAC, database and APK remain deferred. No merge or provider deployment.

## PP-20261114-003 — OWNER REQUEST + UI WORKING DONE / 14-11-2026
- **APPROVED scope:** deliver five genuinely buildable and visually distinct Web layouts, each light/dark; real links must open module/detail pages in independent browser tabs, not an in-page-only tab widget. Still UI-only: Admin Demo and fake data, no backend, release or external provider changes.
- **DONE on PR #2 branch:** `prototype/index.html` selection gallery, `app.html` deep-link document (`design/mode/page/record`), shared `assets/app.js` + `assets/styles.css`, no-dependency Node static build and review README. Seven agreed sections kept; search/filter/temp add, open independent links and switch design/mode.
- **VERIFY local:** `npm run check` PASS; `npm run build` PASS (4 static assets, 40,153 bytes). Chromium DOM/render smoke at 1366×900 and 390×844 PASS for all 5×2 variants, 7 nav items, independent link targets/URLs, filter/search/temporary add/re-render, demo detail, mobile menu, no JS page errors/no external requests. Browser sandbox blocked direct file/localhost navigation, so actual popup navigation has NOT been claimed tested; only link semantics/target verified.
- **PENDING:** Owner selects/revises UI. True shared login and cross-tab data sync, RBAC, persistence, API/Worker, realtime and APK remain deferred; no merge/deploy authorized. `CI_PASS`, `RELEASE_PASS`, `FIELD_PASS`, `OWNER_PASS` not claimed.
