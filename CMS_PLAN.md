# WoodSmith CMS - Figma to Code Plan

## Figma File
- **File**: https://www.figma.com/design/aG8q1RVLHvT6xoQmem2082/WoodSmith
- **CMS Page**: node-id=22-9234 (UI :: Backend CMS)
- **fileKey**: `aG8q1RVLHvT6xoQmem2082`

## Project
- **Path**: `C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/`
- **Stack**: Next.js 16 + React 19 + Tailwind CSS 4, App Router, JSX
- **Admin Route Group**: `src/app/(admin)/`

---

## Figma Frame Map

### Login Section
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| CMS Login | `41:14302` | `src/app/(admin)/login/page.jsx` | pending |
| CMS Login - Forgot Password | `52:9017` | `src/app/(admin)/login/forgot-password/page.jsx` | pending |
| CMS Login - Forgot Password - Email Sent | `186:16184` | `src/app/(admin)/login/forgot-password/sent/page.jsx` | pending |

### Dashboard
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| Manage Website | `41:10941` | `src/app/(admin)/admin/dashboard/page.jsx` | pending |

### Product Management
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| CMS::Product (list) | `22:10065` | `src/app/(admin)/admin/products/page.jsx` | pending |
| CMS::Product - Add New | `22:11136` | `src/app/(admin)/admin/products/create/page.jsx` | pending |
| CMS::Product - Create New Entry | `263:20792` | (reference for create page) | pending |

### Banner Management
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| CMS::Banner (list) | `191:17200` | `src/app/(admin)/admin/banner/page.jsx` | pending |
| CMS::Banner - No Data | `259:16572` | (empty state in list page) | pending |
| CMS::Banner (edit) | `259:17832` | `src/app/(admin)/admin/banner/edit/[id]/page.jsx` | pending |

### Profile Management
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| CMS::Profile | `259:18935` | `src/app/(admin)/admin/profile/page.jsx` | pending |

### Blog Management
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| CMS::Blog (list) | `197:14002` | `src/app/(admin)/admin/blog/page.jsx` | pending |
| CMS::Blog - Create New Entry | `197:20398` | `src/app/(admin)/admin/blog/create/page.jsx` | pending |

### Video Highlight Management
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| CMS::VDO Highlight (list) | `197:21997` | `src/app/(admin)/admin/video-highlight/page.jsx` | pending |
| CMS::VDO Highlight - Create New Entry | `197:23144` | `src/app/(admin)/admin/video-highlight/create/page.jsx` | pending |

### Gallery Management
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| CMS::Gallery (list) | `263:19845` | `src/app/(admin)/admin/gallery/page.jsx` | pending |
| CMS::Gallery - Create New Entry | `272:22992` | `src/app/(admin)/admin/gallery/create/page.jsx` | pending |

### Manual Management
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| CMS::Manual (list) | `207:10965` | `src/app/(admin)/admin/manual/page.jsx` | pending |
| CMS::Manual - Create New Entry | `208:16042` | `src/app/(admin)/admin/manual/create/page.jsx` | pending |

### About Us
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| CMS::About Us | `208:28073` | `src/app/(admin)/admin/about-us/page.jsx` | pending |

### Branch Management
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| CMS::Branch (state 1) | `208:24414` | `src/app/(admin)/admin/branch/page.jsx` | pending |
| CMS::Branch (state 2) | `208:25321` | `src/app/(admin)/admin/branch/create/page.jsx` | pending |
| CMS::Branch (state 3) | `208:26355` | (reference for states) | pending |

### FAQ Management
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| CMS::FAQ (list) | `208:19255` | `src/app/(admin)/admin/faq/page.jsx` | pending |
| CMS::FAQ - Add Entry | `208:20079` | `src/app/(admin)/admin/faq/create/page.jsx` | pending |
| CMS::FAQ - No Data | `208:16684` | (empty state in list page) | pending |
| CMS::FAQ (list variant) | `208:23593` | (reference) | pending |
| CMS::FAQ - Add Entry (variant) | `208:22663` | (reference) | pending |
| CMS::FAQ - No Data (variant) | `208:21166` | (reference) | pending |

### Quotation Management
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| CMS-Quotation (list) | `22:9657` | `src/app/(admin)/admin/quotations/page.jsx` | pending |
| CMS-Quotation (detail) | `221:14848` | `src/app/(admin)/admin/quotations/[id]/page.jsx` | pending |

### User Management
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| CMS::Manage User - Role | `41:12694` | `src/app/(admin)/admin/users/page.jsx` | pending |

### Account Profile
| Frame | Node ID | Target File | Status |
|-------|---------|-------------|--------|
| CMS::Account Profile | `41:13568` | `src/app/(admin)/admin/account/page.jsx` | pending |

---

## Shared Components to Build First

| Component | File | Purpose |
|-----------|------|---------|
| Admin Layout | `src/app/(admin)/layout.jsx` | Route group layout (no public navbar/footer) |
| Admin Sidebar | `src/components/admin/AdminSidebar.jsx` | Navigation sidebar with menu items |
| Admin Header | `src/components/admin/AdminHeader.jsx` | Top header bar with user info |
| Admin Table | `src/components/admin/AdminTable.jsx` | Reusable data table with pagination |
| Admin Button | `src/components/admin/AdminButton.jsx` | Orange primary, secondary variants |
| Admin Input | `src/components/admin/AdminInput.jsx` | Text, select, file upload inputs |
| Admin Modal | `src/components/admin/AdminModal.jsx` | Confirmation dialogs |
| Admin Empty State | `src/components/admin/AdminEmptyState.jsx` | No data placeholder |

---

## Implementation Phases (Ralph Loop)

Following the Ralph Wiggum technique:
- Iteration beats perfection
- Failures provide data
- Clear measurable completion criteria
- Self-correction loops (build → check → fix → rebuild)
- Escape hatches after max iterations

---

### Phase 0: Shared Layout + Components

**Prompt:**
```
CONTEXT:
- Project: C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/
- Plan file: CMS_PLAN.md (read this first for full context)
- Stack: Next.js 16 App Router, React 19, Tailwind CSS 4, JSX
- Figma fileKey: aG8q1RVLHvT6xoQmem2082

TASK: Build the shared admin layout and reusable components used by ALL CMS pages.

STEP-BY-STEP PROCESS:
1. Read CMS_PLAN.md to understand the full CMS structure
2. Use Figma MCP get_design_context with fileKey=aG8q1RVLHvT6xoQmem2082, nodeId=22:10065 (Product list page — it shows the fullest sidebar with all nav items)
3. Extract the sidebar, header, and table patterns from the design
4. Create these files:

   src/app/(admin)/layout.jsx
   - Admin-only layout (NO TopBar, Navbar, Footer from public site)
   - Wraps children with AdminSidebar + AdminHeader
   - Import globals.css for Tailwind

   src/components/admin/AdminSidebar.jsx
   - Collapsible icon sidebar matching Figma (WoodSmith logo at top)
   - Nav items linking to all CMS routes:
     /admin/dashboard, /admin/banner, /admin/profile, /admin/blog,
     /admin/video-highlight, /admin/gallery, /admin/manual,
     /admin/about-us, /admin/branch, /admin/faq, /admin/products,
     /admin/quotations, /admin/users, /admin/account
   - Active state highlighting (orange) for current route
   - User avatar at bottom

   src/components/admin/AdminHeader.jsx
   - Top bar with page title, language switcher, settings icon, user avatar

   src/components/admin/AdminTable.jsx
   - Reusable data table with: checkbox column, sortable headers, pagination
   - Props: columns, data, onSort, onPageChange

   src/components/admin/AdminButton.jsx
   - Variants: primary (orange), secondary (outline), danger (red)
   - Props: variant, children, onClick, disabled

   src/components/admin/AdminInput.jsx
   - Types: text, textarea, select, file upload
   - Props: type, label, placeholder, value, onChange, required

   src/components/admin/AdminModal.jsx
   - Confirmation dialog with title, message, confirm/cancel buttons

   src/components/admin/AdminEmptyState.jsx
   - No data placeholder shown when table has zero rows

5. After creating all files, update CMS_PLAN.md Phase 0 status to done

VERIFICATION:
- Run npm run build — must pass with zero errors
- Verify layout.jsx does NOT include TopBar, Navbar, or Footer from public site
- Verify AdminSidebar has links to all 14 routes listed above
- Create a test page at src/app/(admin)/admin/dashboard/page.jsx that renders inside the layout to confirm it works

MEASURABLE COMPLETION CRITERIA:
- src/app/(admin)/layout.jsx exists and renders sidebar + header + children
- All 8 admin components exist in src/components/admin/
- AdminSidebar has nav links to all 14 admin routes
- Dashboard test page renders inside admin layout
- npm run build passes with zero errors
- CMS_PLAN.md Phase 0 status updated to done

ESCAPE HATCH:
If after 8 iterations components still fail to build, document issues in CMS_PLAN.md Known Issues section.

Output <promise>SHARED LAYOUT COMPLETE</promise> ONLY when ALL criteria above are met.
```

**Command:**
```
/ralph-loop:ralph-loop "<paste prompt above>" --max-iterations 10 --completion-promise "SHARED LAYOUT COMPLETE"
```

---

### Phase 1: Login Pages

**Prompt:**
```
CONTEXT:
- Project: C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/
- Plan file: CMS_PLAN.md (read this first for full Figma node mapping)
- Stack: Next.js 16 App Router, React 19, Tailwind CSS 4, JSX
- Figma fileKey: aG8q1RVLHvT6xoQmem2082

TASK: Implement the CMS Login section (3 pages).

STEP-BY-STEP PROCESS:
1. Read CMS_PLAN.md to get the node IDs for Login section
2. For EACH page, use Figma MCP get_design_context (fileKey=aG8q1RVLHvT6xoQmem2082, nodeId from plan)
3. Convert the Figma design to a Next.js App Router page using JSX + Tailwind CSS 4
4. Match the design precisely: colors, spacing, typography, Thai text, layout
5. These are standalone pages — NO admin sidebar layout
6. Static frontend only — use placeholder onClick handlers, no API calls
7. After creating each file, update CMS_PLAN.md status from pending to done

VERIFICATION (run after each page):
- Run npm run build from the project root to check for compile errors
- If build fails, read the error, fix the issue, rebuild
- Visually review: does the page structure match the Figma design?

MEASURABLE COMPLETION CRITERIA:
- src/app/(admin)/login/page.jsx exists and matches Figma node 41:14302
- src/app/(admin)/login/forgot-password/page.jsx exists and matches Figma node 52:9017
- src/app/(admin)/login/forgot-password/sent/page.jsx exists and matches Figma node 186:16184
- npm run build passes with zero errors
- All 3 Login entries in CMS_PLAN.md updated to done

ESCAPE HATCH:
If after 8 iterations pages still fail to build, stop and document:
- Which pages are done vs incomplete
- What build errors remain
- What approaches were tried

Output <promise>LOGIN PAGES COMPLETE</promise> ONLY when ALL criteria above are met.
```

**Command:**
```
/ralph-loop:ralph-loop "<paste prompt above>" --max-iterations 10 --completion-promise "LOGIN PAGES COMPLETE"
```

---

### Phase 2: Product + Banner

**Prompt:**
```
CONTEXT:
- Project: C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/
- Plan file: CMS_PLAN.md (read this first for full Figma node mapping)
- Stack: Next.js 16 App Router, React 19, Tailwind CSS 4, JSX
- Figma fileKey: aG8q1RVLHvT6xoQmem2082
- Prerequisite: Phase 0 (shared layout) and Phase 1 (login) must be done

TASK: Implement Product and Banner management pages (5 pages).

STEP-BY-STEP PROCESS:
1. Read CMS_PLAN.md to get node IDs for Product and Banner sections
2. For EACH page, use Figma MCP get_design_context with the correct nodeId
3. Convert to Next.js page using JSX + Tailwind CSS 4
4. REUSE existing components from src/components/admin/ (AdminSidebar, AdminTable, etc.)
5. Pages use the admin layout at src/app/(admin)/layout.jsx
6. Static frontend — populate tables with mock data arrays (10 rows minimum)
7. After creating each file, update CMS_PLAN.md status from pending to done

VERIFICATION (run after each page):
- Run npm run build — must pass with zero errors
- If build fails, read error output, fix the code, rebuild
- Check: does the page use the shared AdminSidebar and AdminHeader?
- Check: does the table match the Figma column structure?

MEASURABLE COMPLETION CRITERIA:
- src/app/(admin)/admin/products/page.jsx — product list with table, matches node 22:10065
- src/app/(admin)/admin/products/create/page.jsx — add product form, matches nodes 22:11136 / 263:20792
- src/app/(admin)/admin/banner/page.jsx — banner list with empty state, matches nodes 191:17200 / 259:16572
- src/app/(admin)/admin/banner/edit/[id]/page.jsx — banner edit form, matches node 259:17832
- npm run build passes with zero errors
- All Product and Banner entries in CMS_PLAN.md updated to done

ESCAPE HATCH:
If after 12 iterations not all pages are done, stop and document:
- Which pages are done vs incomplete
- What build errors or design mismatches remain
- Update CMS_PLAN.md with partial progress

Output <promise>PRODUCT BANNER COMPLETE</promise> ONLY when ALL criteria above are met.
```

**Command:**
```
/ralph-loop:ralph-loop "<paste prompt above>" --max-iterations 15 --completion-promise "PRODUCT BANNER COMPLETE"
```

---

### Phase 3: Blog + Video Highlight

**Prompt:**
```
CONTEXT:
- Project: C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/
- Plan file: CMS_PLAN.md (read this first)
- Stack: Next.js 16 App Router, React 19, Tailwind CSS 4, JSX
- Figma fileKey: aG8q1RVLHvT6xoQmem2082
- Prerequisite: Phases 0-2 must be done (check CMS_PLAN.md)

TASK: Implement Blog and Video Highlight CMS pages (4 pages).

STEP-BY-STEP PROCESS:
1. Read CMS_PLAN.md — get node IDs for Blog and Video Highlight sections
2. For EACH page, use Figma MCP get_design_context with correct nodeId
3. Convert to Next.js page, reuse admin layout and shared components
4. Static frontend with mock data arrays
5. Update CMS_PLAN.md status to done after each page

VERIFICATION:
- Run npm run build after each page — must pass
- Fix any errors before moving to next page
- Confirm shared components (sidebar, table) are reused, not duplicated

MEASURABLE COMPLETION CRITERIA:
- src/app/(admin)/admin/blog/page.jsx — matches node 197:14002
- src/app/(admin)/admin/blog/create/page.jsx — matches node 197:20398
- src/app/(admin)/admin/video-highlight/page.jsx — matches node 197:21997
- src/app/(admin)/admin/video-highlight/create/page.jsx — matches node 197:23144
- npm run build passes with zero errors
- All Blog and Video Highlight entries in CMS_PLAN.md updated to done

ESCAPE HATCH:
If after 10 iterations not complete, document what remains in CMS_PLAN.md.

Output <promise>BLOG VIDEO COMPLETE</promise> ONLY when ALL criteria above are met.
```

**Command:**
```
/ralph-loop:ralph-loop "<paste prompt above>" --max-iterations 12 --completion-promise "BLOG VIDEO COMPLETE"
```

---

### Phase 4: Gallery + Manual + About Us

**Prompt:**
```
CONTEXT:
- Project: C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/
- Plan file: CMS_PLAN.md (read this first)
- Stack: Next.js 16 App Router, React 19, Tailwind CSS 4, JSX
- Figma fileKey: aG8q1RVLHvT6xoQmem2082
- Prerequisite: Phases 0-3 must be done (check CMS_PLAN.md)

TASK: Implement Gallery, Manual, and About Us CMS pages (5 pages).

STEP-BY-STEP PROCESS:
1. Read CMS_PLAN.md — get node IDs for Gallery, Manual, About Us
2. For EACH page, use Figma MCP get_design_context with correct nodeId
3. Convert to Next.js page, reuse admin layout and shared components
4. Static frontend with mock data
5. Update CMS_PLAN.md status to done after each page

VERIFICATION:
- Run npm run build after each page — must pass
- Fix any errors before moving to next page

MEASURABLE COMPLETION CRITERIA:
- src/app/(admin)/admin/gallery/page.jsx — matches node 263:19845
- src/app/(admin)/admin/gallery/create/page.jsx — matches node 272:22992
- src/app/(admin)/admin/manual/page.jsx — matches node 207:10965
- src/app/(admin)/admin/manual/create/page.jsx — matches node 208:16042
- src/app/(admin)/admin/about-us/page.jsx — matches node 208:28073
- npm run build passes with zero errors
- All Gallery, Manual, About Us entries in CMS_PLAN.md updated to done

ESCAPE HATCH:
If after 10 iterations not complete, document what remains in CMS_PLAN.md.

Output <promise>GALLERY MANUAL ABOUT COMPLETE</promise> ONLY when ALL criteria above are met.
```

**Command:**
```
/ralph-loop:ralph-loop "<paste prompt above>" --max-iterations 12 --completion-promise "GALLERY MANUAL ABOUT COMPLETE"
```

---

### Phase 5: Branch + FAQ

**Prompt:**
```
CONTEXT:
- Project: C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/
- Plan file: CMS_PLAN.md (read this first)
- Stack: Next.js 16 App Router, React 19, Tailwind CSS 4, JSX
- Figma fileKey: aG8q1RVLHvT6xoQmem2082
- Prerequisite: Phases 0-4 must be done (check CMS_PLAN.md)

TASK: Implement Branch and FAQ CMS pages (5 pages).

SPECIAL NOTES:
- Branch has 3 Figma frames representing different states (empty, populated, create). Handle empty/populated states conditionally in the list page.
- FAQ has 6 Figma frames (2 variants of list, add, empty). Use the primary variant (nodes 208:19255, 208:20079, 208:16684) and reference the others for edge cases.

STEP-BY-STEP PROCESS:
1. Read CMS_PLAN.md — get node IDs for Branch and FAQ sections
2. For EACH page, use Figma MCP get_design_context with correct nodeId
3. Convert to Next.js page, reuse admin layout and shared components
4. Include empty state handling using AdminEmptyState component
5. Static frontend with mock data
6. Update CMS_PLAN.md status to done after each page

VERIFICATION:
- Run npm run build after each page — must pass
- Fix any errors before moving to next page
- Verify empty states render correctly when mock data array is empty

MEASURABLE COMPLETION CRITERIA:
- src/app/(admin)/admin/branch/page.jsx — matches nodes 208:24414 with empty state
- src/app/(admin)/admin/branch/create/page.jsx — matches node 208:25321
- src/app/(admin)/admin/faq/page.jsx — matches node 208:19255 with empty state from 208:16684
- src/app/(admin)/admin/faq/create/page.jsx — matches node 208:20079
- npm run build passes with zero errors
- All Branch and FAQ entries in CMS_PLAN.md updated to done

ESCAPE HATCH:
If after 10 iterations not complete, document what remains in CMS_PLAN.md.

Output <promise>BRANCH FAQ COMPLETE</promise> ONLY when ALL criteria above are met.
```

**Command:**
```
/ralph-loop:ralph-loop "<paste prompt above>" --max-iterations 12 --completion-promise "BRANCH FAQ COMPLETE"
```

---

### Phase 6: Quotation + User Management

**Prompt:**
```
CONTEXT:
- Project: C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/
- Plan file: CMS_PLAN.md (read this first)
- Stack: Next.js 16 App Router, React 19, Tailwind CSS 4, JSX
- Figma fileKey: aG8q1RVLHvT6xoQmem2082
- Prerequisite: Phases 0-5 must be done (check CMS_PLAN.md)

TASK: Implement Quotation and User Management CMS pages (3 pages).

STEP-BY-STEP PROCESS:
1. Read CMS_PLAN.md — get node IDs for Quotation and User Management
2. For EACH page, use Figma MCP get_design_context with correct nodeId
3. Convert to Next.js page, reuse admin layout and shared components
4. Quotation detail page uses dynamic route [id]
5. Static frontend with mock data
6. Update CMS_PLAN.md status to done after each page

VERIFICATION:
- Run npm run build after each page — must pass
- Fix any errors before moving to next page

MEASURABLE COMPLETION CRITERIA:
- src/app/(admin)/admin/quotations/page.jsx — matches node 22:9657
- src/app/(admin)/admin/quotations/[id]/page.jsx — matches node 221:14848
- src/app/(admin)/admin/users/page.jsx — matches node 41:12694
- npm run build passes with zero errors
- All Quotation and User entries in CMS_PLAN.md updated to done

ESCAPE HATCH:
If after 8 iterations not complete, document what remains in CMS_PLAN.md.

Output <promise>QUOTATION USER COMPLETE</promise> ONLY when ALL criteria above are met.
```

**Command:**
```
/ralph-loop:ralph-loop "<paste prompt above>" --max-iterations 10 --completion-promise "QUOTATION USER COMPLETE"
```

---

### Phase 7: Profile + Account + Final Verification

**Prompt:**
```
CONTEXT:
- Project: C:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/
- Plan file: CMS_PLAN.md (read this first)
- Stack: Next.js 16 App Router, React 19, Tailwind CSS 4, JSX
- Figma fileKey: aG8q1RVLHvT6xoQmem2082
- Prerequisite: Phases 0-6 must be done (check CMS_PLAN.md)

TASK: Implement remaining pages and do a full verification pass.

STEP 1 — IMPLEMENT REMAINING PAGES:
1. Read CMS_PLAN.md — find any pages still marked pending
2. Use Figma MCP get_design_context for each remaining node
3. Implement: Profile (259:18935), Account Profile (41:13568), Dashboard (41:10941)
4. Update CMS_PLAN.md status to done

STEP 2 — FULL VERIFICATION:
1. Run npm run build — must pass with zero errors
2. Check EVERY file in src/app/(admin)/ renders a valid page
3. Verify AdminSidebar has correct nav links to ALL routes:
   /admin/dashboard, /admin/banner, /admin/profile, /admin/blog,
   /admin/video-highlight, /admin/gallery, /admin/manual,
   /admin/about-us, /admin/branch, /admin/faq, /admin/products,
   /admin/quotations, /admin/users, /admin/account
4. Verify consistent styling: same sidebar, same header, same table component across pages
5. Fix any inconsistencies found

MEASURABLE COMPLETION CRITERIA:
- ZERO pending entries remain in CMS_PLAN.md — all must be done
- npm run build passes with zero errors
- AdminSidebar links to all 14 admin routes
- All pages use shared layout consistently
- CMS_PLAN.md Progress Tracking section fully updated

ESCAPE HATCH:
If after 8 iterations issues remain, document ALL remaining issues in CMS_PLAN.md under a Known Issues section with specific file paths and error descriptions.

Output <promise>ALL CMS PAGES COMPLETE</promise> ONLY when ALL criteria above are met.
```

**Command:**
```
/ralph-loop:ralph-loop "<paste prompt above>" --max-iterations 10 --completion-promise "ALL CMS PAGES COMPLETE"
```

---

## Progress Tracking

| Phase | Description | Pages | Max Iterations | Completion Promise | Status |
|-------|-------------|-------|----------------|-------------------|--------|
| Phase 0 | Shared Layout + Components | 8 components | 10 | SHARED LAYOUT COMPLETE | pending |
| Phase 1 | Login | 3 | 10 | LOGIN PAGES COMPLETE | pending |
| Phase 2 | Product + Banner | 5 | 15 | PRODUCT BANNER COMPLETE | pending |
| Phase 3 | Blog + Video Highlight | 4 | 12 | BLOG VIDEO COMPLETE | pending |
| Phase 4 | Gallery + Manual + About Us | 5 | 12 | GALLERY MANUAL ABOUT COMPLETE | pending |
| Phase 5 | Branch + FAQ | 5 | 12 | BRANCH FAQ COMPLETE | pending |
| Phase 6 | Quotation + Users | 3 | 10 | QUOTATION USER COMPLETE | pending |
| Phase 7 | Profile + Polish | 3 + review | 10 | ALL CMS PAGES COMPLETE | pending |

**Total: ~28 unique pages, 8 Ralph Loop sessions, max ~81 iterations**

## Known Issues
(Updated by Ralph Loop when escape hatches trigger)

None yet.
