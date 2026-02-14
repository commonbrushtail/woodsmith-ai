# Requirements: WoodSmith AI — Bug Fix Milestone

**Defined:** 2026-02-15
**Core Value:** Customers can browse products and submit quotation requests seamlessly

## v1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Critical Bug Fixes

- [ ] **BUG-01**: TipTap rich text editor renders without SSR crash on all admin pages (about-us, blog create/edit, products create/edit)
- [ ] **BUG-02**: Banner create page (`/admin/banner/create`) loads and allows admins to create new banners
- [ ] **BUG-03**: dnd-kit sortable lists render without React hydration mismatch warnings on all 5 list pages (banner, video-highlight, gallery, manual, FAQ)

### Medium Bug Fixes

- [ ] **BUG-04**: Admin profile page displays company name as plain text, not raw HTML tags
- [ ] **BUG-05**: Gallery list displays sort order starting from 1 (not 0) for all items

### Test Coverage

- [ ] **TEST-01**: Failing test written before each bug fix (TDD red phase)
- [ ] **TEST-02**: All 5 bug fixes have dedicated test coverage (TDD green phase)
- [ ] **TEST-03**: Edge case tests added for HTML stripping and sort order logic
- [ ] **TEST-04**: All 202+ existing tests still pass after fixes (no regressions)
- [ ] **TEST-05**: Build succeeds (`npm run build`) after all fixes

## v2 Requirements

Deferred to future milestone. Tracked but not in current roadmap.

### Performance & Polish

- **PERF-01**: Optimize image loading and lazy loading
- **PERF-02**: Add SEO metadata to all public pages
- **PERF-03**: Performance audit and optimization

### New Features

- **FEAT-01**: Customer quotation tracking (status updates, history)
- **FEAT-02**: Product search and filtering
- **FEAT-03**: Email notifications for quotation updates

## Out of Scope

| Feature | Reason |
|---------|--------|
| New admin features | Stabilize first — no new functionality this milestone |
| TypeScript migration | Working codebase in JS, not worth the disruption now |
| Shopping cart / payments | Business model is quotation-based, not ecommerce |
| Mobile app | Web-first approach |
| i18n / English translation | Thai-only for now, all text hardcoded |
| CLAUDE.md rewrite | Already accurate, just update references after fixes |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| BUG-01 | Phase 1 | Pending |
| BUG-02 | Phase 1 | Pending |
| BUG-04 | Phase 2 | Pending |
| BUG-05 | Phase 2 | Pending |
| BUG-03 | Phase 3 | Pending |
| TEST-01 | All phases | Pending |
| TEST-02 | All phases | Pending |
| TEST-03 | All phases | Pending |
| TEST-04 | All phases | Pending |
| TEST-05 | All phases | Pending |

**Coverage:**
- v1 requirements: 10 total
- Mapped to phases: 10
- Unmapped: 0

---
*Requirements defined: 2026-02-15*
*Last updated: 2026-02-15 after roadmap creation*
