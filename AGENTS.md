# AI working contract — PickPack 1291

**Authority:** Owner's newest explicit instruction and this repository's verified canonical state. Public repository; no secrets or real operational records.

## Mandatory bootstrap — every substantive project session
1. Read `main:AGENTS.md` and `main:ops/authority.json`, then follow its `bootstrap_order`. Confirm live branch, PR, commit, CI and relevant source as needed. For unfinished work, also inspect its open working PR and HEAD.
2. `main` is accepted authority; unmerged branch/PR is working-only. Owner decisions outrank stale files; AI memory/chat is not project authority.
3. If GitHub cannot be verified, report `REPO_NOT_VERIFIED`; do not invent status or mutate.
4. Read other repositories owned by Owner only when Owner asks. `tamnv2/supra-inventory` is **strictly read-only** even when consulted for integration. No mutation of other repositories, their issues/PRs/releases, or any unapproved provider resource.

## Project scope and shared identity
- Only writable source repository: `tamnv2/pickpack`.
- Product: personnel/photo, operator-scanned shift entry/exit linked to work user, daily labor, minutes, CCDC including PDA borrowing/return; future features require approval. Web + APK, realtime, design target up to 3 PDAs and 5 concurrent Web sessions.
- **Share Firebase Auth identity AND canonical user role** with Inventory, not a separately maintained role list. Same verified Firebase UID and authoritative role, including `PICKPACK_ADMIN`, `ADMIN`, `PICKER` and other existing roles only as confirmed from actual source.
- PickPack actions require server-side RBAC for each approved business operation. Never infer privilege from account name, client role text or a stale claim. Keep role revocation/disable behavior authoritative.
- Shared Firebase account/project and Cloudflare account do not grant access to Inventory business data. PickPack Worker and OpsCore are separate; no provider deployment or shared-resource change without explicit approval.
- If trustworthy read-only role authority is not available without Inventory changes, record a BLOCKER and seek Owner decision; do not fake role sync.

## Semantic continuity, minimal text
- Persist each substantive new Owner request/approval/rejection, relevant technical finding, unresolved question, test/CI evidence, blocker and next step as the **shortest complete semantic checkpoint** in `docs/JOURNAL.md`, updating `ops/state.json` and `docs/SPEC.md` only when their canonical facts change.
- Preserve meaning, decision scope, status, source evidence and pending action. Do not paste raw conversation, redundant text or personal/sensitive details.
- Use `FACT`, `ASSUMPTION`, `PROPOSED`, `APPROVED`, `REJECTED`, `BLOCKED`, `DONE`; keep superseded decisions traceable. No duplicate commits for no-op/read-only answers.
- Make checkpoint on authorized working branch/PR, commit and **read back** exact contents and SHA before claiming saved. If unavailable report `CHECKPOINT_NOT_SAVED` and present sanitized unsaved summary. PR branch state does not become accepted main automatically.

## Think before coding / simplicity / surgical changes
- Verify requirements and live evidence; identify uncertain assumptions, risks and simpler alternatives. Challenge unsafe or impractical premises.
- Minimal implementation only. No speculative functionality, folders, abstraction or unrelated refactoring. Touch only lines/files justified by the Owner request. Match current style; remove only newly orphaned code.
- Every task needs verifiable criteria. For bug fixes reproduce the failure and test recovery; for logic changes test before/after and regressions. Never invent PASS or release proof.

## CODE ONLY by default
- Implement, build, test and document in a branch/PR, stopping at `CODE_READY` with demonstrated verification. Report Owner can authorize release **only if** all technical gates pass.
- Do not merge a working PR to main or publish APK/Web/Worker/Production, deploy rules, alter shared infrastructure, create costs, or expose data until separate explicit Owner authorization for the exact action.
- Separate `CODE_READY`, `CI_PASS`, `RELEASE_PASS`, `FIELD_PASS`, `OWNER_PASS`. A successful build is not an Owner or field acceptance.
- Bootstrap exception: Owner-approved creation of this previously empty repository and seven governance files is not Production release.

## Public security and response style
- Never commit/log credentials, tokens, service-account JSON, signing keys, secrets, actual employee photos/records, minutes, shift/device histories or private operational data; use fake data in tests.
- `.gitignore` is defense-in-depth, not a guarantee. Review all staged changes; use provider secret stores and enforce server-side authorization, not obscurity.
- Reply in concise natural Vietnamese: verified result, evidence, missing decision/blocker and checkpoint status. Avoid repeating closed issues, irrelevant ideas or asking Owner to perform steps automation can perform.
