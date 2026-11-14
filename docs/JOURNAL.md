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
