# PickPack 1291 — Canonical scope and technical direction

Status: **Owner-approved project direction; design/code-only. No Production authorization.** Effective 14/11/2026.

## Modules
1. Employee registry with portrait (store actual sensitive data outside public GitHub).
2. Operator-scanned shift entry/exit linked with actual work login/user.
3. Daily labor / attendance records.
4. Structured minutes and controlled document storage.
5. CCDC inventory, status and issue/return.
6. PDA as a CCDC subtype; borrowing/return may be linked to shift scanning and work user, only per approved workflow.
7. Other functions: no scope until Owner separately approves.

Platforms: Android APK and Web, realtime; sizing target **3 PDA + 5 Web concurrent sessions**.

## Identity and authorization
- One canonical identity per person across Inventory and PickPack: reuse the existing Firebase Auth project and verified Firebase UID; no parallel credentials or manual account duplication.
- **One canonical user role** sourced from the existing Inventory authority. Exact roles must be preserved; source confirms role type includes `ROOT`, `ADMIN`, `PICKPACK_ADMIN`, `REPORTER`, `PICKER`, `OBPP_COORDINATOR` (Inventory source `service/src/auth.ts`, read-only observation 14/11/2026).
- Example: existing `PICKPACK_ADMIN` remains `PICKPACK_ADMIN` in PickPack; existing `PICKER` remains `PICKER`. Do not silently equate `ADMIN` and `PICKPACK_ADMIN`, elevate `PICKER`, or copy privileged rights beyond Owner-defined per-feature permissions.
- PickPack validates role/active account status from trusted server-side authority; client claims alone are insufficient. Role modification, lock/disable and revocation must not leave a second stale authorization copy. Design should account for online authority availability, cache invalidation and safe denial when proof is unavailable.
- Existing Inventory login uses `username/employee-code + password → Inventory Worker verification → Firebase custom token/session`; the current source does **not** yet prove a suitable secure cross-project read-only role API. **Integration implementation is blocked pending verification of an already-authorized read-only interface.** Never modify Inventory source to manufacture one.
- Business permission matrix for this app is separate and pending Owner approval; a shared role is NOT universal permission to all modules.
- Keep existing Inventory session and role-switch semantics unaffected; test session, role changes and revocation for both apps before release.

## Resource separation
- One shared Cloudflare account, **separate PickPack Worker**, separately tracked Worker-specific metrics; account-level costs/quotas remain shared. No new Worker created at docs/bootstrap stage.
- **Separate PickPack OpsCore**, isolated application records, per-role backend access controls and audit trail. InventoryCore is not PickPack storage authority.
- New Firebase client registration, datastore, provider secrets or deployment require separate explicit scope/cost/compatibility approval.
- Do not mutate any source, repo, Cloudflare/Firebase provider resource or user record belonging to Inventory.

## Security / governance
- This repository is public: no passwords, tokens, signing material, customer/staff data, photos, shift rows, minutes, PDA device tracking records or sensitive diagnostic logs.
- Permissions are enforced server-side; hiding endpoint or logic in public source is not a security boundary.
- Each substantive discussion must be minimized without loss of decision context in `docs/JOURNAL.md`, linked to `ops/state.json` as relevant.
- Default authorized work: source + tests only, stop at CODE_READY. Owner must explicitly authorize merge and Production release. `FIELD_PASS` and `OWNER_PASS` are not implied by build/CI PASS.

## Before implementation
Verify identity-source interoperability and read-only API, identify exact allowed provider resources, then obtain Owner approval for business permission matrix, data fields, retention, and verification plan. Do not assume these details are approved.

## UI-first prototype gate — Owner, 14/11/2026
- **APPROVED:** build and review Web UI first, with mock `Admin Demo` unrelated to real users/roles; business workflows, permission matrix, storage, Firebase integration, API, realtime and APK remain deferred until Owner accepts UI.
- Prototype is offline static HTML with fictional records; any add/filter/search interaction is local and nonpersistent. Demo access is not an authentication or authorization mechanism; it must never ship into production.
- No new provider resource, worker, site, DNS, public test link or Production deployment is authorized. Source-only branch/PR, then separate Owner decision for next phase and release.

## Five UI designs and multi-tab review — Owner, 14/11/2026
- **APPROVED UI SCOPE:** five visually distinct but source-shared layouts (operations sidebar, horizontal navigation, dense control room, icon rail/cards, floating studio rail); each has light/dark, desktop/mobile, all seven existing modules, fixture data and Admin Demo without real authority.
- **Multi-tab contract:** `prototype/app.html?design=1..5&mode=light|dark&page=<module>` is directly addressable; real anchor links (`target=_blank`, `rel=noopener`) open module, dashboard shortcut and mock detail in independent browser tabs. Normal menu clicks remain in current tab. No server session or cross-tab data synchronization is claimed in prototype.
- **Build artifact:** static HTML/CSS/JavaScript, `cd prototype && npm run check && npm run build` with Node 18+ and no npm dependencies; `prototype/dist/` is the build output and remains untracked. Direct `prototype/index.html` works offline in normal browsers. This is implementation-ready UI architecture only, not an approved production application.
- **Safety and release:** no real employee/device data, Auth/role or database calls, backend, Worker, external scripts, DNS, hosting or deployment; no approved provider resource change. Review + approval of preferred UI precedes next implementation phase.

## UI architecture review (14/11/2026)
- Owner rejected color-only variants; five materially different buildable layouts are required for **UI selection**: (1) executive dashboard with sidebar/KPIs, (2) shift control tower with alert priority/timeline, (3) kanban workflow board, (4) data table workbench with inspector, (5) field-first action hub with bottom navigation. All keep seven scoped modules.
- Each variant supports light/dark, desktop/mobile, direct module/detail URLs and true HTML `target="_blank"` links for browser tabs. No test URL binding, user auth, provider setup, DB, Worker, API, realtime, or APK in this UI-only approval phase.
- UI UX Pro Max (https://uupm.cc) used as **design-principle reference** (contrast, responsiveness, typography, data visualization), not code or asset source; final selection remains pending Owner review.

## Horilla-inspired Web UI — Owner request 14/11/2026
- **APPROVED scope:** replace the five-choice UI review with one PickPack-specific Web interface based on Horilla HR's publicly documented visual patterns: charcoal sidebar, grouped navigation, top toolbar, dashboard cards, employee listing, detail drawer and asset/attendance tables.
- All seven approved PickPack modules have mock UI. Implement independently without importing Horilla code/assets, using PickPack identity and labels. Horilla open-source project uses LGPL-2.1; inspiration does not imply adoption of Horilla runtime or HR business model.
- **Evidence limitation:** public demo login page and published documentation/screenshots were inspected, but authenticated post-login demo could not be interacted with in this environment. Pixel-perfect parity with the live Horilla dashboard is not claimed.
- **Review contract:** static offline HTML/CSS/JS, one-click Admin Demo without real credentials, synthetic records, light/dark, search/filter/list/cards/detail drawer and genuine same-site HTML anchors for independent browser tabs. No user Auth/RBAC, API/DB, persistence, realtime or APK yet.
- Every Production/provider write/merge remains explicitly Owner-gated. This working PR is only a visual proposal, not Owner acceptance.
