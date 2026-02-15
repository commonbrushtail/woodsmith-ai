# Milestones

## v1.0 Bug Fix Milestone (Shipped: 2026-02-15)

**Phases:** 1-3 (3 phases, 5 plans, 17 tasks)
**Code:** 20 files, +1,427/-226 lines (source + tests)
**Tests:** 202 → 396 (+194 new tests)
**Timeline:** 3 days (Feb 12-15, 2026)
**Git range:** `219d508..f737f44` (30 commits)

**Key accomplishments:**
1. Fixed TipTap SSR crash on 5 admin content editing pages (`immediatelyRender: false`)
2. Created missing `/admin/banner/create` page with file upload, completing banner CRUD workflow
3. Added `stripHtmlTags` utility — admin profile displays clean plain text instead of raw HTML
4. Fixed gallery list to display 1-based numbering (user-friendly)
5. Eliminated dnd-kit hydration warnings on all 5 sortable admin list pages (DndContext outside table)
6. Nearly doubled test suite (202 → 396) with TDD methodology throughout

**Archive:** [Roadmap](milestones/v1.0-ROADMAP.md) | [Requirements](milestones/v1.0-REQUIREMENTS.md)

---
