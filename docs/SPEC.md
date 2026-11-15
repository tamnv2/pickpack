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

## Horilla Admin Demo v0.5 — Owner 14/11/2026
- **APPROVED:** keep the Horilla-inspired UI style, use the Owner-provided The Supra image as app mark/favicon, remove explicit new-tab buttons. Native HTML links allow browser right-click/Ctrl-click; do not force a new tab on ordinary click.
- **DEMO UI ONLY:** client form checks `admin/admin`, logout, synthetic data on 7 UI modules; full admin **mock operations** on the 6 data modules (create/edit/delete/bulk/status/search/filter/view/cards/CSV/reset), not real user privileges or secure authentication. Demo credentials are public test-only and must never become a Production auth path.
- **FIXTURE SCOPE:** 36 people, 42 shift logs, 42 labor rows, 30 minutes, 30 CCDC and 30 borrow/return events across 3 fictitious PDA device IDs. All personnel and device records fabricated; no actual staff data or provider calls.
- **PERSISTENCE:** fake data only in browser localStorage, with storage-event refresh on shared same-origin tabs where supported, optional local-file demo URL marker. No backend, Firebase integration, server RBAC, business database, shared real roles, realtime or APK.
- **REPLACES earlier UI prototype notes** about one-click demo entry, nonpersistent rows, and explicit open-new-tab UI. Previous decisions retained as history.
- **TEST:** Node syntax/check/build and Chromium injected DOM interaction tests PASS; sandbox restricts navigation to localhost/file URLs, so end-to-end real browser login redirect, right-click tab open, CSV download and cross-tab event are NOT_VERIFIED. No CI/Field/Production PASS or release authorization.

## Web Office v0.6 — Owner request 14/11/2026
- **APPROVED UI preview scope:** remove AI–Owner instructions / fake-label copy from visible UI; credible wholly synthetic operational records; lightweight responsive interactions; module-appropriate SVG icons; light sidebar in light mode/dark sidebar in dark mode; working browser-local add/edit/delete/status/filters/notifications/preferences and font size control 90–120%.
- **DONE on draft PR #2 only:** 7 modules; 36 staff, 42 shifts, 42 daily labor, 30 minutes, 30 CCDC, 30 PDA borrow/return entries over 3 invented devices; seeded reproducible synthetic data, no private/real records. Notifications and hourly chart derive from editable browser-local records; PDA overlapping open borrow entries guarded in mock workflows. Theme and font preferences persist to localStorage; native HTML links preserved.
- **SECURITY boundary:** `admin/admin` is public client-side preview credential, *not real authentication*. No live identity, role sync, RBAC, DB, realtime, Worker/API calls or provider deployment. Do not use preview for actual business data.
- **TEST:** V8 syntax, 16 structural/render assertions and 6 simulated DOM action assertions PASS; no current v0.6 actual Chromium/end-to-end, build, CI, public preview URL, cross-tab/download/field confirmation. No Production approval or PR merge.

## Web Office v0.7 — Owner request 14/11/2026 (working UI scope)
- **APPROVED request:** use the Owner-linked operations Google Sheet **read-only** to correct prototype field semantics; enable employee avatar editing; dedicate a barcode/manual employee-code scan zone at the top of Ra/vào ca; remove elements and manual actions not aligned to business workflow.
- **FACT observed:** seven source tabs: Danh mục, Danh sách PDA, User Pick, Bàn Pack, User Pack, Nhân sự and Admin. Employee headers include mã NV, họ tên, điện thoại, vị trí chính, nhà cung cấp, bộ phận, site, kho, ngày bắt đầu, ghi chú, người/thời gian cập nhật. PDA headers include seri, 5 số cuối, nguồn, tình trạng, ghi chú. Sampled data cells in relevant early rows were empty; no verified populated roster or mã NV ↔ ca ↔ user assignment rule. No password verifiers or personnel data were read into repository.
- **IMPLEMENTED ONLY IN OFFLINE MOCK:** employee create/edit/detail with these fields and optional avatar (browser-resized and persisted locally); extra demo fields **ca được phân** and **user làm việc** for scan lookup, not falsely attributed to Sheet; scan form selects persistent in/out mode for consecutive barcode scans (Enter submits selected mode), detects person by exact employee code, previews profile, writes local-time/date checkin or checkout and linked assigned shift/user, and blocks unknown/unassigned, double-enter and exit-without-open. Scan records are read-only through UI; no arbitrary manual shift CRUD. PDA serial catalog shown alongside synthetic borrow/return records. Removed dummy employee email, fake activity feed, misleading 01-tab metric, visible reset button and inappropriate shift manual actions.
- **BLOCKED real integration:** the linked Sheet contains neither verified scheduling data nor an approved mapping from employee to work user/shift. Production auto ca assignment **must** read authoritative roster/assignment or follow an explicitly approved rule; do not calculate ca solely from scan time. Public mock `admin/admin`, localStorage avatar/data and simulated PDA/shift rows cannot process real personal data, grant real permissions or constitute integrated attendance.
- **VERIFICATION v0.7 / CODE_READY (static mock only):** GitHub Actions [run #43584401138](https://github.com/tamnv2/pickpack/actions/runs/43584401138), commit `e85b1579fd0ed1e47fc004923abf110849a391a4`: Node check/build PASS (7 files, 145383 bytes); real Chromium DOM smoke PASS (login, employee CRUD/photo conversion, scan guards, PDA, themes, mobile), hosted HTTP Playwright PASS (login redirect, Ctrl+click independent tab, localStorage cross-tab, CSV, scan in/out, mobile, no external requests). Source-only and Owner release gate unchanged. Physical scanner, real scheduling, backend/Auth/RBAC, Production, field and Owner acceptance NOT VERIFIED.

## Web Office v0.8 — Owner UI corrections / 14-11-2026 — CODE_READY
- **APPROVED:** raise all prototype text by 10 percentage points with one-time migration of prior stored size; permit **seven light-mode accent colors** (đỏ/cam/vàng/lục/lam/chàm/tím), independent of dark mode; replace sidebar brand with **`CÔNG TY CỔ PHẦN THE SUPRA - DC HƯNG YÊN`**; display Admin identity only in topbar (sidebar bottom logout only); compact whitespace across panels/tables.
- **APPROVED Excel:** export filtered business-module tables as genuine standalone `.xlsx`, not CSV. Implemented dependency-free OOXML in browser (valid ZIP CRC, style header, freeze top row, auto-filter, literal string codes preserving leading zero). Dashboard exposes no export/write controls.
- **APPROVED dashboard:** all-system **read-only** summary, eight live-derived KPIs spanning personnel/shifts/labor/minutes/CCDC/PDA, six module status summaries, pending issues, hourly attendance and latest scan activity. Removed duplicate quick navigation and Create minutes; no dashboard CRUD.
- **VERIFIED — static mock only:** GitHub Actions [run #43586461064](https://github.com/tamnv2/pickpack/actions/runs/43586461064) on source commit `741503bd12a7528f68546880ffd8ee97204bd8a8`: `npm run check` PASS, `npm run build` PASS (7 files, 160367 bytes), real Chromium DOM smoke PASS, hosted HTTP E2E PASS for Ctrl+new-tab, localStorage sync, light/dark/font/palette, Excel zip + `openpyxl` parse/content, scan, mobile and no external calls. Status **CODE_READY + CI_PASS v0.8** for preview only.
- **OUTSIDE GATE:** actual employee data, authoritative ca/user mapping, hardware barcode reader, server identity/RBAC/OpsCore/realtime and APK remain unimplemented. No PR merge, Web deployment, Production, `FIELD_PASS` or `OWNER_PASS` asserted.

## Web Office v0.8.1 — footer/version + authorized public test preview / 14-11-2026
- **APPROVED:** replace web footer with exact text `Phát triển hệ thống - tamnv2 | Pick Pack 1291`, pin subtly (opacity 0.64) at viewport bottom-right; display Web version at sidebar footer and login. Patch version **0.8.1** (within Owner's v0.8 series).
- **OWNER AUTHORIZED:** deploy a **test-only, publicly accessible synthetic static Web preview** after `CODE_READY`, never Production or shared provider changes. The source commit is served immutably at https://rawcdn.githack.com/tamnv2/pickpack/ddc12d9b66461f842f65c6f8ffa323f3d992a41d/prototype/index.html; third-party CDN may require first-visit HTML confirmation. Repository `has_pages=false`; no GitHub Pages/Netlify/Worker created, no paid usage authorization.
- **VERIFIED:** GitHub Actions [#43587655812](https://github.com/tamnv2/pickpack/actions/runs/43587655812), source `ddc12d9b66461f842f65c6f8ffa323f3d992a41d`: `npm run check`, `npm run build` (7 files, 161451 bytes), local Chromium smoke/HTTP E2E, **PUBLIC_PREVIEW_HTTP_PASS** for HTML/JS/CSS correct MIME and **PUBLIC_PREVIEW_BROWSER_PASS** for remote actual login/footer/version through CDN. `CODE_READY + CI_PASS + WEB_TEST_PREVIEW_PASS` **static mock only**; PR remains draft/unmerged and Production `RELEASE_PASS/FIELD_PASS/OWNER_PASS` not claimed.

## Web Office v0.8.2 — Owner UI/scan corrections / 14-11-2026 — CODE_READY
- **APPROVED typography:** the preference **100%** now produces rendered font sizes **110% of original base** via `--text-scale=1.1*(fontPct/100)`; control 90–120% in 5% steps. Stored v0.8.1 percentage is converted to the new scale once so no double enlargement.
- **APPROVED layout:** persistent **table-only** for all modules, delete Thẻ/Bảng toggles and large redundant data-module summary cards; one heading per page (no breadcrumb, duplicated eyebrow or descriptive subtitle); unify compact page, panel, KPI, table, sidebar and scan station spacings across mobile/desktop.
- **APPROVED brand:** sidebar/login company name on exactly two lines: `CÔNG TY CỔ PHẦN THE SUPRA` / `DC HƯNG YÊN`.
- **OWNER SCAN REQUIREMENT implemented as browser mock:** Công nhật has employee-code QR/barcode text input with exact person/shift/work-user lookup, one provisional record per person/day, scan timestamp, and duplicate guard; **hours and actually performed task remain unknown**, not inferred. PDA has paired employee + device scan (device ID, full serial or unique last 5 digits), persistent borrow/return mode, active-loan and missing-loan guards, and separate returner identity audit (returner may differ; no new same-borrower policy invented). Both accept scanners acting as keyboard input; **real camera QR decoding or physical barcode devices not field tested**. No unapproved backend writes.
- **VERIFIED on source commit `99ed047b963dbaee81d54711acae3485d5313e98`:** GitHub Actions [#43590709932](https://github.com/tamnv2/pickpack/actions/runs/43590709932) **success**: source check/build (7 files, 171953 bytes), Chromium DOM+hosted E2E PASS for font=100 actual1.1, one heading, table-only, all modules, labor scan duplicate, PDA QR borrow/return, login, cross-tab storage, Excel .xlsx, mobile; **PUBLIC_PREVIEW_HTTP_PASS and PUBLIC_PREVIEW_BROWSER_PASS** at immutable https://rawcdn.githack.com/tamnv2/pickpack/99ed047b963dbaee81d54711acae3485d5313e98/prototype/index.html. `CODE_READY + CI_PASS + WEB_TEST_PREVIEW_PASS` for **synthetic static demo only**, not real Auth/Field/Production.

## Web Office prototype v0.8.3 — Owner 14/11/2026
- APPROVED demo-only: full CRUD and barcode-as-keyboard flows over synthetic localStorage, zero Firebase/Cloudflare/OpsCore business runtime API requests (static CDN network traffic remains); no real Auth, backend RBAC or cross-device realtime.
- Single-level compact sidebar: remove warehouse chip and grouping, shorten labels without losing full tooltip, remove duplicated page heading, personal settings moved to top-left account dropdown.
- Add local editable five personnel catalogs (position, supplier, department, site, warehouse) feeding employee form selects; reject case-insensitive duplicate names; update referenced synthetic profiles upon rename; block deletion while in use.
- Animated meaningful success/error/input/scan/login/logout feedback, responsive and reduced-motion accessibility. No Production or provider changes.

## Web Office preview v0.8.4 — Owner correction, 14/11/2026
- Sidebar footer `Phát triển hệ thống - tamnv2 | Pick Pack 1291` moved directly below Web version; no viewport-fixed credit.
- Seven menu names now **five or six Vietnamese words each**, with automatic wrapping: Tổng quan hoạt động vận hành; Quản lý hồ sơ nhân sự; Ghi nhận ra vào ca; Quản lý công nhật nhân sự; Quản lý biên bản sự việc; Quản lý công cụ dụng cụ; Ghi nhận mượn trả PDA.
- Desktop nonfunctional three-line toggle removed; mobile-only functional `Mục` button preserves narrow-screen navigation. Same mock-only auth/data/provider and CODE ONLY boundaries.


## Web Office preview v0.8.5 — Owner 14/11/2026
- **APPROVED UI only:** list employee existing `startDate` as **Ngày nhận việc** and existing auto-populated `updatedBy` as **Cập nhật bởi**, reorder personnel columns and use content-sized table widths with horizontal overflow as needed. Date editor uses browser-local date picker, persisted in dd/mm/yyyy in the mock.
- Sidebar ordered as Owner specified: Tổng quan vận hành, Quản lý nhân sự, Quét vào/ra ca, Mượn / trả PDA, Quản lý công nhật, Quản lý biên bản, Quản lý CCDC. Keep right-click/new-tab native links.
- Personal display adds **Tự động/Sáng/Tối**; auto follows Vietnam time: 06:00–17:59 light and 18:00–05:59 dark; manual choice persists locally and across same-origin tabs. Header sticky with live Vietnamese weekday/date, HH:mm:ss; update only clock DOM each second, not full app; respect reduced motion and responsive constraints.
- Design conventions referenced read-only from VoltAgent DESIGN.md (IBM/SAP/Airtable/Linear), without copying source/assets or changing backend, Auth, providers or Production.

## Web Office preview v0.8.6 — Owner 14/11/2026
- **APPROVED UI only:** sticky header displays a six-digit, two-colon split-flap clock in Vietnam time. At each tick, animate only changing digits; preserve weekday/date and avoid full-page rerender. Respect reduced-motion system setting; no remote time/API.
- **APPROVED functionality:** show same top search control on dashboard; type-to-search all synthetic records in six business modules, show up to 12 matches and total count, with native detail anchors/right-click new-tab and explicit no-result state. Dashboard KPIs remain complete/unfiltered and no provider/API usage.
- No real data, backend/RBAC, Production/provider resource or Inventory source changes; PR remains unmerged pending Owner review.

## Web Office preview v0.8.7 — Owner correction 14/11/2026
- **APPROVED UI-only:** fix the user-observed toolbar positional variance across Overview and other modules using invariant search / notification / time slots at the same viewport, including Categories search; retain responsive behavior.
- **APPROVED UI-only:** replace static digits with genuinely hinged split-flap animation: old top half rotates out, next bottom half rotates in; only changed digits animate; fixed display, accessibility label and reduced-motion fallback. No external widget/network or provider changes.
- Same static synthetic demo boundary; no Production/merge authorization.

## Web Office preview v0.8.8 — Owner-approved Visual Timer motion (14/11/2026)
- **APPROVED:** replace v0.8.7 compact flap styling with original code recreating the mechanical retro split-flap look/movement referenced at https://visualtimer.com/timers/flip-clock/ (no imported code, media or hotlinks): higher-contrast dark tiles, visible hinge/pins, top flap folding out then bottom flap folding in, eased depth/shading, increased legibility within the already consistent toolbar.
- Keep HH:mm:ss, Vietnam date, animate only changed digits, avoid UI re-render/network calls. Recover frozen flaps when reduced-motion/hidden-tab settings change; honor accessibility and responsive layouts. Timer/stopwatch/audio not in scope.
- This is static synthetic Web UI only, subject to Owner visual acceptance; no production, backend, shared provider, or Inventory changes.

## Web Office preview v0.8.9 — Owner clock-only display
- **APPROVED (14/11/2026):** remove the weekday/day/month/year line entirely from the sticky toolbar (both visual DOM and unused date formatting), leaving Vietnam HH:mm:ss only. Enlarge the six split-flap digits to occupy freed clock space (28×44px on desktop, responsive reductions at 1200/1020/600px) without changing search/bell/clock slots.
- Preserve physical 3D flipping, reduced-motion fallback, date-free header semantics and local-only demo contract. No backend/Auth/Inventory/provider/Production change.

## Web Office preview v0.8.10 — Clean clock
- **APPROVED (15/11/2026):** remove the rejected split-flap clock and all dedicated 3D animation logic/styles. Display unboxed 24-hour Vietnam `HH:mm:ss` in the same sticky toolbar, with prominent hour/minute and smaller muted seconds, adapting to light/dark theme. No calendar date.
- Update clock text in place every second without whole-page rerender or provider calls; keep identical search/bell/clock positions across modules, responsive/mobile support, and existing automatic theme switching. No backend, inventory or production changes.

## Web Office preview v0.9.0 — Owner-approved 10 UI workflows (15/11/2026)
- **APPROVED:** 12-hour `hh:mm:ss AM/PM` clock; toast max 5 seconds and 5 newest concurrently (nonblocking); centered consistent confirmation modal; UI demo password recheck before edit/delete; unmodified business provider quota.
- **APPROVED:** high-resolution employee portrait selected/captured once: 192px avatar + original binary for large detail/zoom. Demo uses browser-local IndexedDB only; **public CDN/shared origin is unsuitable for real staff images**. Production must use private authorized storage, real reauthentication and backend RBAC.
- **APPROVED:** labor shows one row per started job with employee/date/shift/job/start/end. First scan starts, next open scan closes; work dropdown supplied by editable catalog. Remove hours/status/work-user columns, don't fabricate timestamps for historical rows. No independent labor cost/quota API.
- **APPROVED:** shift entry: select Ca 1, Ca 2 or Ca HC next to operation; exit hides shift and closes matched open scan, not sourced from employee's predefined shift.
- **APPROVED:** employee/biên bản/CCDC actions and catalogs next to Export Excel, eliminate redundant header row. Catalog scopes: personnel fields, labor work, minutes type, CCDC type. Rename updates demo references; deletion blocked while used.
- **VERIFIED DEMO BOUNDARY:** static CDN/HTML/CSS/JS, synthetic localStorage + IndexedDB per browser only; no Firebase Auth/Cloudflare Worker/OpsCore business API or cross-device realtime. Standard GitHub Actions runner in public repo is free (subject to GitHub policy); rawcdn.githack.com is third-party free CDN without availability SLA. Git/release traffic/storage and browser space are not zero resources; none implies production zero-cost guarantee.
- Real identity/password, privacy, shared storage and field/API integration remain **BLOCKED until approved and verified backend**, not fulfilled by demo.

## Web Office preview v0.9.1 — Shift choices, portrait preview and work resources
- **APPROVED (15/11/2026):** place `Loại thao tác` label + Enter/Exit buttons on the same line and `Ca làm việc` label + Ca 1/Ca 2/Ca HC button group on that line (no shift select). Hide shift buttons on Exit; selected mode/shift remain until operator changes them, including after successful scanner submit and in-app navigation. After each scan focus returns to staff-code input.
- **APPROVED:** the shift scanner's personnel detail uses a large left portrait, height capped to preview area and aspect ratio preserved; when present, show local original resolution from IndexedDB rather than stretching cropped avatar. No real employee photos in public test preview.
- **APPROVED:** sidebar `Quản lý tài nguyên` (separate resources page) with editable catalogs `Loại user`, `User Pick`, `User Pack`, `Bàn Pack`; synthetic browser-local data and 20+20+12 example identifiers/desks. These are **operational work-user identifiers, not Firebase account/role administration**. Do not touch Inventory identity authority.
- **APPROVED:** remove preset user (and obsolete fixed shift) from personnel form, list, detail and runtime record model. At check-in, infer Pick/Pack account family from selected personnel position (Pick / Pack thường / Pack Auto), require operator to select a matching available work user, optionally Pack desk, and record selection in the shift event. Refuse a duplicate active user/desk and re-use active shift user for PDA borrow. For other positions no Pick/Pack user is required; don't invent a role. On exit, preserve the prior session user and close that session; do not prompt for a new user. Shift table/detail exposes desk.
- **BOUNDARIES:** prototype-only state in browser localStorage/IndexedDB with simulated password gates; no backend authorization, shared auth, realtime synchronization, cost-bearing provider, or Production deployment. Owner approval required separately before merge/release. Real work-user authorization/revocation requires backend verification before use.

## Web Office preview v0.9.2 — Personnel field constraints
- **APPROVED 15/11/2026:** Personnel `Ngày nhận việc` prefilled with Vietnam-local today only for **new** records; remains editable and existing records retain saved date on edit. Store in established `dd/mm/yyyy` display format.
- **APPROVED:** employee identifier and phone accept digits `0–9` only, stored as strings (preserve leading zeros). Reuse employee ID's existing 2–30 length; do not impose an unapproved exact phone length. Vietnamese person names accept Unicode letters/combining accents plus inter-word spaces, excluding digits/punctuation.
- **IMPLEMENTATION:** HTML inputmode/pattern and in-place input/paste sanitization, IME composition-friendly processing and save-time validation against programmatic bypasses. Backend must independently validate equivalent rules when real storage exists; browser-only checks are not access control.
- **VERIFY:** Chromium/hosted automation on mock user data including VN midnight boundary, edit date, Unicode accents, numeric string, invalid paste and unsafe direct submit. No provider change, Production deployment or merge.
