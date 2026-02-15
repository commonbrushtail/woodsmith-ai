# Requirements: WoodSmith AI

**Defined:** 2026-02-15
**Core Value:** Customers can browse products and submit quotation requests seamlessly

## v1.1 Requirements

Requirements for v1.1 Variations Management milestone.

### Variation Group Management

- [ ] **VAR-01**: Admin can create a variation group with a name (e.g., สี, ขนาด, พื้นผิว)
- [ ] **VAR-02**: Admin can add entries to a variation group (label + optional swatch image)
- [ ] **VAR-03**: Admin can edit a variation group's name and entries
- [ ] **VAR-04**: Admin can delete a variation group (with confirmation, warns if linked to products)
- [ ] **VAR-05**: Admin can reorder entries within a variation group
- [ ] **VAR-06**: Admin can view a list of all variation groups with entry count

### Product-Variation Linking

- [ ] **LINK-01**: Admin can link one or more variation groups to a product
- [ ] **LINK-02**: Admin can select which specific entries from a linked group apply to a product
- [ ] **LINK-03**: Admin can unlink a variation group from a product
- [ ] **LINK-04**: Changes to a variation group's entries automatically reflect on all linked products
- [ ] **LINK-05**: Admin can add custom (ad-hoc) variation entries on the fly during product create/edit

### Admin Pages

- [ ] **PAGE-01**: Variation groups list page (table with name, entry count, linked product count)
- [ ] **PAGE-02**: Variation group create page (name input, entry management with image upload)
- [ ] **PAGE-03**: Variation group edit page (same as create, pre-populated)

### Database & Infrastructure

- [x] **DB-01**: New `variation_groups` table (id, name, created_at, updated_at)
- [x] **DB-02**: New `variation_entries` table (id, group_id, label, image_url, sort_order)
- [x] **DB-03**: New `product_variation_links` junction table (product_id, group_id, entry_id)
- [x] **DB-04**: RLS policies for variation tables (admin-only write, public read)

## Future Requirements

### Variation Enhancements

- **VAR-F01**: Variation entry price modifiers (e.g., +500 for larger size)
- **VAR-F02**: Variation entry stock tracking per entry
- **VAR-F03**: Bulk import/export of variation groups via CSV

## Out of Scope

| Feature | Reason |
|---------|--------|
| Migration of existing product_options | Start fresh — existing data stays as-is |
| Variation-based pricing | Not needed for quotation-based model |
| Variation images as gallery (multiple images per entry) | Single swatch image sufficient for v1.1 |
| Public site variation display changes | Separate milestone if needed |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DB-01 | Phase 4 | ✓ Complete |
| DB-02 | Phase 4 | ✓ Complete |
| DB-03 | Phase 4 | ✓ Complete |
| DB-04 | Phase 4 | ✓ Complete |
| VAR-01 | Phase 5 | Pending |
| VAR-02 | Phase 5 | Pending |
| VAR-03 | Phase 5 | Pending |
| VAR-04 | Phase 5 | Pending |
| VAR-05 | Phase 5 | Pending |
| VAR-06 | Phase 6 | Pending |
| PAGE-01 | Phase 6 | Pending |
| PAGE-02 | Phase 6 | Pending |
| PAGE-03 | Phase 6 | Pending |
| LINK-01 | Phase 7 | Pending |
| LINK-02 | Phase 7 | Pending |
| LINK-03 | Phase 7 | Pending |
| LINK-04 | Phase 7 | Pending |
| LINK-05 | Phase 7 | Pending |

**Coverage:**
- v1.1 requirements: 18 total
- Mapped to phases: 18 (100%)
- Unmapped: 0

---
*Requirements defined: 2026-02-15*
*Last updated: 2026-02-15 after roadmap creation*
