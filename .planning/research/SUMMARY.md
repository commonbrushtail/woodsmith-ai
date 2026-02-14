# Project Research Summary

**Project:** WoodSmith AI Phase 6 Bug Fixes
**Domain:** Runtime bug resolution for Next.js 16/React 19 App Router application
**Researched:** 2026-02-15
**Confidence:** MEDIUM-HIGH

## Executive Summary

WoodSmith AI has 5 runtime bugs discovered during Chrome DevTools audit, stemming from React 19's stricter SSR/hydration checks and library integration patterns. The bugs range from critical (TipTap SSR crash blocking 5 admin pages) to cosmetic (gallery order off-by-one). All bugs are fixable with configuration changes or simple code additions — no library upgrades or major refactors required.

**The recommended approach:** Fix bugs in order of impact (TipTap → Banner create → dnd-kit → Gallery order → Profile HTML). All fixes use existing libraries with no new dependencies. Total effort: 2-4 hours including tests. The critical constraint is maintaining all 202 existing tests while adding regression coverage for each fix.

**Key risks:** Test regressions (particularly TipTap/dnd-kit mocks), production build failures after dev testing, and cascading layout changes from dnd-kit restructure. Mitigation: Run full test suite and production build after each fix, use TDD red-green-refactor workflow, and verify no hydration warnings in console. All bugs are independent with minimal cross-dependencies, allowing safe parallel fixes if needed.

## Key Findings

### Recommended Stack

**No stack changes needed.** All bugs are fixable with configuration changes to existing libraries. Current stack is compatible with React 19.2 and Next.js 16.

**Key compatibility notes:**
- **TipTap 3.19.0** — React 19 compatible, requires `immediatelyRender: false` in App Router SSR context
- **dnd-kit 6.3.1** — React 19 compatible, accessibility divs must render outside `<table>` elements to avoid hydration mismatches
- **React 19.2.4** — Stricter hydration checks flag invalid HTML nesting (divs in tables)
- **Next.js 16.1.6** — App Router uses React Server Components by default, requires careful client/server boundary management

All libraries already installed and compatible. Zero `npm install` commands required.

### Expected Features (Bug Fixes)

**Critical (blocks user workflows):**
- Fix TipTap SSR crash — about-us, blog create/edit, products create/edit pages unusable
- Create missing banner create page — 404 on `/admin/banner/create`

**High priority (functional but noisy):**
- Fix dnd-kit hydration warnings — 5 list pages (banner, video-highlight, gallery, FAQ, manual) log console errors

**Low priority (cosmetic):**
- Fix gallery order display — first item shows "0" instead of "1"
- Fix profile HTML display — company name field shows `<p>` tags as plain text

**Testing features (table stakes for bug fixes):**
- TDD workflow: Write failing test first, implement fix, add edge case coverage
- Regression prevention: Each bug gets permanent test coverage
- Full suite validation: All 202 existing tests must pass after each fix
- Production build check: `npm run build` must succeed (catches SSR crashes missed in dev)

### Architecture Approach

**Server/Client component boundary** is the core architectural constraint. All 5 bugs touch this boundary in different ways:

**Major components and their boundaries:**
1. **TipTap integration** — Client Component (`RichTextEditor.jsx`) used by Server Components (blog/products pages). Fix: Configure `useEditor()` to defer rendering until client hydration.

2. **dnd-kit integration** — Client Components (`*ListClient.jsx`) rendering `<table>` with sortable rows. Fix: Move `DndContext` wrapper outside `<table>` to avoid injecting divs during SSR.

3. **Banner create page** — Missing Client Component page. Fix: Create `banner/create/page.jsx` following `faq/create/page.jsx` pattern (pure Client Component calling Server Action).

4. **Profile form** — Client Component fetching data via Server Action. Fix: Strip HTML at Server Action layer (before DB write) or Client Component layer (before setState).

5. **Gallery list** — Server Component fetches data, Client Component displays with 0-indexed DB values. Fix: Transform to 1-indexed at display layer only.

**Data flow patterns:**
- **Mutations:** Client Component → Server Action → Supabase → revalidate → redirect
- **Reads:** Server Component → Server Action → Supabase → pass props → Client Component
- **Reorder:** Client drag handler → `buildSortOrderUpdates()` → Server Action → batch UPDATE

All fixes respect existing data flow. No changes to mutation pipeline, RLS policies, or middleware rules.

### Critical Pitfalls

Based on research, the top 5 pitfalls for Phase 6 bug fixes:

1. **Content flash on TipTap hydration** — Adding `immediatelyRender: false` can cause editor to appear empty for 100-300ms. Mitigation: Show placeholder HTML during SSR using `dangerouslySetInnerHTML` (sanitized), swap to TipTap on client mount. Test with existing content in DB.

2. **CSS Grid/Flexbox breaks after dnd-kit restructure** — Moving `DndContext` outside `<table>` can misalign columns. Mitigation: Use existing `SortableList.jsx` wrapper component (cleaner API) or carefully test responsive layouts on mobile. Visual regression screenshots required.

3. **Forgotten middleware route rule** — New banner create page may be accessible without login if middleware pattern is wrong. Mitigation: WoodSmith already uses `/admin/*` wildcard, so this is not a risk. But verify with E2E test (access without auth → redirect).

4. **Regex-based HTML stripping breaks on edge cases** — Simple `/<[^>]*>/g` fails on nested tags, self-closing tags, HTML entities. Mitigation: Use DOMParser (client) or existing `sanitize-html.js` (server). Test with `<p><strong>Bold</strong></p>`, `<img src="..." />`, `&lt;`, etc.

5. **Test failures due to missing mocks** — TipTap/dnd-kit fixes may need updated mocks for browser APIs. Mitigation: Run `npm test` before AND after each fix. Update mocks in `tests/setup.js` if needed. Use `vi.mock()` for `window`, `document` access.

**Cross-cutting pitfall:** Production build failures after dev testing. SSR crashes only appear in `npm run build`, not `npm run dev`. **Always run production build before committing bug fixes.**

## Implications for Roadmap

Based on research, **Phase 6 should be split into 5 sequential sub-tasks** to minimize risk and enable TDD workflow:

### Sub-task 1: Fix TipTap SSR Crash
**Rationale:** Critical bug blocking 5 admin pages. Easiest fix (1 line change). Highest impact.
**Delivers:** About-us, blog create/edit, products create/edit pages functional.
**Implementation:** Add `immediatelyRender: false` to `useEditor()` in `RichTextEditor.jsx`.
**Avoids Pitfall:** Content flash on hydration — test with existing DB content, consider placeholder.
**Estimated time:** 30 minutes including test.
**Test strategy:** Update `tests/components/rich-text-editor.test.jsx`, verify no SSR crash.

### Sub-task 2: Create Banner Create Page
**Rationale:** High-priority UX bug (404 on admin link). No dependencies on other fixes.
**Delivers:** `/admin/banner/create` page following established create page pattern.
**Implementation:** Copy `faq/create/page.jsx`, update for banner schema (image_url, link_url, is_active, sort_order).
**Uses Stack:** Existing `createBanner()` Server Action, Zod validation.
**Avoids Pitfall:** Inconsistent form patterns — use `AdminInput`, `AdminButton`, Thai error messages.
**Estimated time:** 1 hour including tests.
**Test strategy:** New `tests/app/admin/banner-create.test.jsx`, mock `createBanner()` Server Action.

### Sub-task 3: Fix Gallery Order Display
**Rationale:** Low-priority cosmetic bug. Simple fix (1 line). No dependencies.
**Delivers:** Gallery list displays 1-indexed order (user-friendly) while DB stays 0-indexed.
**Implementation:** Change `<td>{item.sort_order}</td>` to `<td>{item.sort_order + 1}</td>` in `GalleryListClient.jsx`.
**Avoids Pitfall:** Cascade failures — verify `buildSortOrderUpdates()` still uses 0-indexed values.
**Estimated time:** 15 minutes including tests.
**Test strategy:** Update `tests/components/gallery-list-client.test.jsx`, verify display transformation.

### Sub-task 4: Fix Profile HTML Display
**Rationale:** Low-priority cosmetic bug. Single Server Action change.
**Delivers:** Company name field shows plain text (no `<p>` tags visible).
**Implementation:** Add `stripHtmlTags()` utility, apply in `updateCompanyProfile()` Server Action before DB write OR in client component before setState.
**Avoids Pitfall:** XSS vulnerability — use DOMParser or existing `sanitize-html.js`, test with `<script>` tags.
**Estimated time:** 30 minutes including tests.
**Test strategy:** New `tests/lib/strip-html.test.js` for utility, update `tests/app/admin/profile.test.jsx`.

### Sub-task 5: Fix dnd-kit Hydration Warnings
**Rationale:** Medium-priority (functional but noisy console errors). Affects 5 list pages. Highest refactor risk.
**Delivers:** All sortable list pages render without React hydration warnings.
**Implementation:** Move `DndContext`/`SortableContext` wrappers outside `<table>` elements in 5 `*ListClient.jsx` files OR refactor to use existing `SortableList.jsx` wrapper.
**Avoids Pitfall:** CSS Grid/Flexbox breaks — visual regression screenshots before/after, test drag-drop still works.
**Estimated time:** 1.5-2 hours including tests for all 5 pages.
**Test strategy:** Update all 5 list component tests, verify no hydration warnings, verify drag-drop callbacks still work.

### Phase Ordering Rationale

- **TipTap first:** Critical, easiest, highest ROI. Unblocks 5 admin pages immediately.
- **Banner create second:** High user impact (broken link), no dependencies, moderate complexity.
- **Gallery order third:** Simple display fix, helps test display transformation pattern before profile HTML fix.
- **Profile HTML fourth:** Uses pattern validated by gallery fix (display vs data layer), low risk.
- **dnd-kit last:** Most complex (5 files, layout risk), functional despite warnings, benefits from TDD confidence built in earlier fixes.

**Alternative ordering:** Sub-tasks 1-4 can be done in parallel by different developers (zero dependencies). Sub-task 5 should wait until others complete to avoid merge conflicts in shared components.

### Research Flags

**Phases with standard patterns (skip research-phase):**
- **Sub-task 1 (TipTap):** Well-documented `immediatelyRender` option in TipTap 3.x migration guides.
- **Sub-task 2 (Banner create):** Copy-paste pattern from existing `faq/create/page.jsx`.
- **Sub-task 3 (Gallery order):** Simple arithmetic transformation.
- **Sub-task 4 (Profile HTML):** Standard HTML sanitization pattern, already have `sanitize-html.js`.
- **Sub-task 5 (dnd-kit):** Established HTML5 table spec + React hydration rules. Existing `SortableList.jsx` wrapper provides clean API.

**No phases need deeper research.** All bugs have identified solutions based on library knowledge and codebase patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | **HIGH** | No upgrades needed. All libraries compatible. Verified via `npm list` and package.json peer deps. |
| Features | **HIGH** | Bug fixes clearly defined. STACK.md provides exact fix patterns with code examples. |
| Architecture | **HIGH** | Server/client boundaries mapped. Data flow impacts documented. ARCHITECTURE.md covers all 5 bugs. |
| Pitfalls | **MEDIUM** | PITFALLS.md lists common failure modes, but cannot verify against 2026 docs (Context7/WebFetch disabled). Patterns match known React 19/Next.js 16 behavior. |

**Overall confidence:** **MEDIUM-HIGH**

### Gaps to Address

**Gap 1: TipTap 3.x `immediatelyRender` option verification**
- **Issue:** Cannot verify against official TipTap 2026 docs (Context7 disabled).
- **Confidence:** Medium — pattern mentioned in STACK.md matches known TipTap 3.x API.
- **Mitigation:** Test fix in dev mode, verify editor renders without crash, check production build.

**Gap 2: React 19 hydration error messaging**
- **Issue:** Exact error messages/warnings for hydration mismatches not verified.
- **Confidence:** Medium — React 19 changelog mentions stricter checks, but exact format unknown.
- **Mitigation:** Use Chrome DevTools to inspect actual console warnings before/after fix.

**Gap 3: dnd-kit accessibility div injection behavior**
- **Issue:** Cannot verify if dnd-kit 6.3.1 still injects divs or if newer versions changed this.
- **Confidence:** Medium — STACK.md describes pattern, but not verified against 2026 dnd-kit docs.
- **Mitigation:** Inspect DOM structure in Chrome DevTools, verify `<div role="status">` rendered inside table.

**Gap 4: Production build SSR behavior differences**
- **Issue:** Dev mode uses Fast Refresh, production uses strict SSR. Behavior may differ.
- **Confidence:** High for TipTap crash (documented), Medium for dnd-kit hydration timing.
- **Mitigation:** Always run `npm run build` locally before committing. Test production build in staging environment.

**All gaps are resolvable during implementation through:**
- Manual testing in Chrome DevTools (inspect DOM, check console)
- Production build verification (`npm run build && npm start`)
- Existing test suite validation (202 tests must pass)
- TDD workflow (write failing test first, verify fix resolves it)

## Sources

### Primary (HIGH confidence)
- **WoodSmith AI codebase** — Existing test patterns in `tests/components/rich-text-editor.test.jsx`, `tests/components/sortable-list.test.jsx`, `tests/lib/sanitize-html.test.js`, `tests/lib/reorder.test.js`
- **WoodSmith AI architecture** — Server/client boundaries in `src/app/(admin)/admin/*/page.jsx`, route group layouts, middleware patterns
- **package.json** — Installed versions: TipTap 3.19.0, dnd-kit 6.3.1, React 19.2.4, Next.js 16.1.6

### Secondary (MEDIUM confidence)
- **TipTap 3.x migration patterns** — `immediatelyRender: false` option inferred from library API patterns and React 19 SSR behavior
- **React 19 hydration behavior** — Stricter checks based on changelog and Next.js 16 App Router docs (not verified via Context7/WebFetch)
- **dnd-kit accessibility** — Div injection pattern based on library architecture (screen reader announcements rendered as DOM elements)

### Tertiary (LOW confidence, needs validation)
- **HTML5 table spec** — `<table>` can only contain `<caption>`, `<colgroup>`, `<thead>`, `<tbody>`, `<tfoot>` (standard, but edge cases unknown)
- **Exact React 19 error messages** — Hydration warning format not verified (will be visible in Chrome DevTools during testing)

### Could Not Access (disabled tools)
- **Context7** — Library research disabled
- **WebSearch** — 2026 documentation lookup disabled
- **WebFetch** — Direct URL fetching disabled

**Recommendation:** During implementation, optionally verify fix patterns against official docs if internet access is available. However, research is sufficient to proceed based on existing codebase patterns and library knowledge.

---

*Research completed: 2026-02-15*
*Ready for roadmap: Yes*
*Estimated total effort: 3.5-4.5 hours for all 5 bug fixes including tests*
