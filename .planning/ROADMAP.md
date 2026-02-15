# Roadmap: WoodSmith AI

## Milestones

- ✅ **v1.0 Bug Fix Milestone** — Phases 1-3 (shipped 2026-02-15)
- 🚧 **v1.1 Variations Management** — Phases 4-7 (in progress)

## Phases

<details>
<summary>✅ v1.0 Bug Fix Milestone (Phases 1-3) — SHIPPED 2026-02-15</summary>

- [x] Phase 1: Critical Bug Fixes (2/2 plans) — completed 2026-02-15
- [x] Phase 2: Cosmetic Bug Fixes (1/1 plan) — completed 2026-02-15
- [x] Phase 3: Hydration Warning Cleanup (2/2 plans) — completed 2026-02-15

See [v1.0 Roadmap Archive](milestones/v1.0-ROADMAP.md) for full details.

</details>

### 🚧 v1.1 Variations Management (In Progress)

**Milestone Goal:** Reusable product variation groups managed centrally, linked to products with per-product entry selection.

#### Phase 4: Database Infrastructure

**Goal**: Database schema and RLS policies support variation groups, entries, and product linking

**Depends on**: Phase 3 (v1.0 complete)

**Requirements**: DB-01, DB-02, DB-03, DB-04

**Success Criteria** (what must be TRUE):
1. Admin can create variation groups via direct SQL or Supabase client (tables exist and accept data)
2. Variation entries can be linked to groups with sort ordering preserved
3. Products can be linked to variation entries through junction table
4. Admin users can read/write variation data; public users can only read
5. All variation tables enforce referential integrity (cascading deletes work correctly)

**Plans**: 1 plan

Plans:
- [ ] 04-01-PLAN.md — Variation tables schema (013) and RLS policies (014)

#### Phase 5: Variation CRUD Operations

**Goal**: Server actions enable creating, editing, deleting, and reordering variation groups and entries

**Depends on**: Phase 4

**Requirements**: VAR-01, VAR-02, VAR-03, VAR-04, VAR-05

**Success Criteria** (what must be TRUE):
1. Admin can create a variation group with a name via server action
2. Admin can add entries to a variation group with label and optional swatch image
3. Admin can edit a variation group's name and modify existing entries
4. Admin can delete a variation group (action warns if linked to products)
5. Admin can reorder entries within a variation group (drag-and-drop data layer works)

**Plans**: TBD

Plans:
- [ ] 05-01: TBD

#### Phase 6: Variation Admin UI

**Goal**: Admin can view, create, and edit variation groups through dedicated UI pages

**Depends on**: Phase 5

**Requirements**: VAR-06, PAGE-01, PAGE-02, PAGE-03

**Success Criteria** (what must be TRUE):
1. Admin can view a list of all variation groups showing name, entry count, and linked product count
2. Admin can navigate to create page and add a new variation group with entries
3. Admin can navigate to edit page from list and modify existing variation groups
4. Admin can upload swatch images for variation entries (stored in Supabase Storage)
5. Admin can delete variation groups from edit page with confirmation dialog

**Plans**: TBD

Plans:
- [ ] 06-01: TBD

#### Phase 7: Product Integration

**Goal**: Admin can link variation groups to products with per-product entry selection during product create/edit

**Depends on**: Phase 6

**Requirements**: LINK-01, LINK-02, LINK-03, LINK-04, LINK-05

**Success Criteria** (what must be TRUE):
1. Admin can select one or more variation groups when creating or editing a product
2. Admin can choose which specific entries from each linked group apply to the product
3. Admin can unlink a variation group from a product without deleting the group
4. When admin edits a variation group's entries, changes automatically appear on all linked products (no manual sync needed)
5. Admin can add custom variation entries on-the-fly during product create/edit (ad-hoc entries saved to database)

**Plans**: TBD

Plans:
- [ ] 07-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Critical Bug Fixes | v1.0 | 2/2 | ✓ Complete | 2026-02-15 |
| 2. Cosmetic Bug Fixes | v1.0 | 1/1 | ✓ Complete | 2026-02-15 |
| 3. Hydration Warning Cleanup | v1.0 | 2/2 | ✓ Complete | 2026-02-15 |
| 4. Database Infrastructure | v1.1 | 0/1 | Planned | - |
| 5. Variation CRUD Operations | v1.1 | 0/TBD | Not started | - |
| 6. Variation Admin UI | v1.1 | 0/TBD | Not started | - |
| 7. Product Integration | v1.1 | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-15*
*v1.0 shipped: 2026-02-15*
*v1.1 roadmap added: 2026-02-15*
