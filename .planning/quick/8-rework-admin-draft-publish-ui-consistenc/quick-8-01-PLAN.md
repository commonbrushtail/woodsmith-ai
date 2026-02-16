---
phase: quick-8
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - "src/app/(admin)/admin/blog/create/page.jsx"
  - "src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx"
  - "src/app/(admin)/admin/branch/create/page.jsx"
  - "src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx"
  - "src/app/(admin)/admin/manual/create/page.jsx"
  - "src/app/(admin)/admin/manual/edit/[id]/ManualEditClient.jsx"
  - "src/app/(admin)/admin/video-highlight/create/page.jsx"
  - "src/app/(admin)/admin/video-highlight/edit/[id]/VideoHighlightEditClient.jsx"
  - "src/app/(admin)/admin/faq/create/page.jsx"
  - "src/app/(admin)/admin/faq/edit/[id]/FaqEditClient.jsx"
autonomous: true
must_haves:
  truths:
    - "No DRAFT/PUBLISHED tab bar visible on any of these 10 create/edit pages"
    - "Sidebar shows status indicator dot + text for each page"
    - "Primary button says 'เผยแพร่' and calls handleSubmit(true)"
    - "Secondary button says 'บันทึกฉบับร่าง' and calls handleSubmit(false)"
    - "Create pages show gray dot + 'ฉบับร่าง' status"
    - "Edit pages derive status from entity.published (green dot + 'เผยแพร่แล้ว' if published)"
    - "All existing form fields and functionality remain intact"
  artifacts:
    - path: "src/app/(admin)/admin/blog/create/page.jsx"
      provides: "Blog create without tabs, with status sidebar"
    - path: "src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx"
      provides: "Blog edit without tabs, with status sidebar"
    - path: "src/app/(admin)/admin/branch/create/page.jsx"
      provides: "Branch create without tabs, with status sidebar"
    - path: "src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx"
      provides: "Branch edit without tabs, with status sidebar"
    - path: "src/app/(admin)/admin/manual/create/page.jsx"
      provides: "Manual create without tabs, with status sidebar"
    - path: "src/app/(admin)/admin/manual/edit/[id]/ManualEditClient.jsx"
      provides: "Manual edit without tabs, with status sidebar"
    - path: "src/app/(admin)/admin/video-highlight/create/page.jsx"
      provides: "Video create without tabs, with status sidebar"
    - path: "src/app/(admin)/admin/video-highlight/edit/[id]/VideoHighlightEditClient.jsx"
      provides: "Video edit without tabs, with status sidebar"
    - path: "src/app/(admin)/admin/faq/create/page.jsx"
      provides: "FAQ create without tabs, with status sidebar"
    - path: "src/app/(admin)/admin/faq/edit/[id]/FaqEditClient.jsx"
      provides: "FAQ edit without tabs, with status sidebar"
  key_links:
    - from: "sidebar publish button"
      to: "handleSubmit(true)"
      via: "onClick"
      pattern: "handleSubmit\\(true\\)"
    - from: "sidebar draft button"
      to: "handleSubmit(false)"
      via: "onClick"
      pattern: "handleSubmit\\(false\\)"
---

<objective>
Remove DRAFT/PUBLISHED tab bars and add consistent status sidebar to 10 Pattern A admin pages (blog, branch, manual, video-highlight, faq create + edit).

Purpose: Eliminate the non-functional DRAFT/PUBLISHED tab bar UI across standard admin pages. Replace with a consistent sidebar showing current status + publish/draft buttons.
Output: 10 updated admin page files with consistent sidebar UI.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@CLAUDE.md

These 10 files all follow the same pattern:
- They have `tabs` array with DRAFT/PUBLISHED, `activeTab` state, and a tab bar JSX block
- Their sidebar already has "Entry" heading with publish + save buttons
- The sidebar button wording is inconsistent: some say "บันทึก" (save) for draft, some say "เผยแพร่" for publish

Create pages: blog/create, branch/create, manual/create, video-highlight/create, faq/create
Edit pages: blog/edit, branch/edit, manual/edit, video-highlight/edit, faq/edit
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update 5 create pages — remove tabs, add status sidebar</name>
  <files>
    src/app/(admin)/admin/blog/create/page.jsx
    src/app/(admin)/admin/branch/create/page.jsx
    src/app/(admin)/admin/manual/create/page.jsx
    src/app/(admin)/admin/video-highlight/create/page.jsx
    src/app/(admin)/admin/faq/create/page.jsx
  </files>
  <action>
For each of these 5 create page files, make these exact changes:

**1. Remove tab-related code:**
- Delete the `tabs` array declaration (`const tabs = [{ key: 'draft', ... }, { key: 'published', ... }]`)
- Delete the `activeTab` state (`const [activeTab, setActiveTab] = useState('draft')`)
- Delete the entire tab bar JSX block — the `<div className="flex gap-0 border-b border-[#e5e7eb]" role="tablist">` and everything inside it

**2. Replace sidebar Entry panel content** with this consistent pattern (inside the existing `<aside>` and its `<div>` container):

```jsx
<h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
  Entry
</h3>

{/* Status indicator */}
<div className="flex items-center gap-[8px]">
  <span className="w-[8px] h-[8px] rounded-full bg-[#9ca3af]" />
  <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
    สถานะ: ฉบับร่าง
  </span>
</div>

{/* Publish button */}
<button
  type="button"
  onClick={() => handleSubmit(true)}
  disabled={isPending}
  className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
>
  {isPending ? 'กำลังบันทึก...' : 'เผยแพร่'}
</button>

{/* Save as draft button */}
<button
  type="button"
  onClick={() => handleSubmit(false)}
  disabled={isPending}
  className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-white text-[#374151] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#e8eaef] cursor-pointer hover:bg-[#f9fafb] transition-colors disabled:opacity-50"
>
  บันทึกฉบับร่าง
</button>
```

Create pages always show draft status (gray dot) since new content starts as draft.

**3. Keep the header status badge as-is** — the blue "Draft" badge in the header already works correctly.

**4. Verify** that handleSubmit is still called with (true) for publish and (false) for draft. Do NOT change the handleSubmit function signature or implementation.

**IMPORTANT for Branch Create:** This file has a buggy `handleSubmit(activeTab === 'published')` in the secondary button. Since `activeTab` is being removed, change the secondary button's onClick to `handleSubmit(false)` explicitly.

**IMPORTANT for FAQ Create:** This page may have a different sidebar structure — adapt accordingly but keep the same consistent sidebar pattern.
  </action>
  <verify>
Grep all 5 create page files for `activeTab` — should return 0 results.
Grep all 5 create page files for `role="tablist"` — should return 0 results.
Grep all 5 create page files for `handleSubmit(true)` — should return 1 result each (publish button).
Grep all 5 create page files for `handleSubmit(false)` — should return 1 result each (draft button).
Grep all 5 create page files for `สถานะ: ฉบับร่าง` — should return 1 result each.
Run `npm run build` to verify no compile errors.
  </verify>
  <done>
All 5 create pages have: no tab bar, sidebar with gray status indicator showing "ฉบับร่าง", orange publish button calling handleSubmit(true), white draft button calling handleSubmit(false). Build passes.
  </done>
</task>

<task type="auto">
  <name>Task 2: Update 5 edit pages — remove tabs, add dynamic status sidebar</name>
  <files>
    src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx
    src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx
    src/app/(admin)/admin/manual/edit/[id]/ManualEditClient.jsx
    src/app/(admin)/admin/video-highlight/edit/[id]/VideoHighlightEditClient.jsx
    src/app/(admin)/admin/faq/edit/[id]/FaqEditClient.jsx
  </files>
  <action>
For each of these 5 edit page files, make these exact changes:

**1. Remove tab-related code** (same as create pages):
- Delete `tabs` array
- Delete `activeTab` state (e.g., `const [activeTab, setActiveTab] = useState(post.published ? 'published' : 'draft')`)
- Delete the entire tab bar JSX block

**2. Replace sidebar Entry panel content** with this dynamic status pattern:

```jsx
<h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
  Entry
</h3>

{/* Status indicator — derived from entity's published field */}
<div className="flex items-center gap-[8px]">
  <span className={`w-[8px] h-[8px] rounded-full ${ENTITY.published ? 'bg-green-500' : 'bg-[#9ca3af]'}`} />
  <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
    สถานะ: {ENTITY.published ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
  </span>
</div>

{/* Publish button */}
<button
  type="button"
  onClick={() => handleSubmit(true)}
  disabled={isPending}
  className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
>
  {isPending ? 'กำลังบันทึก...' : 'เผยแพร่'}
</button>

{/* Save as draft button */}
<button
  type="button"
  onClick={() => handleSubmit(false)}
  disabled={isPending}
  className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-white text-[#374151] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#e8eaef] cursor-pointer hover:bg-[#f9fafb] transition-colors disabled:opacity-50"
>
  บันทึกฉบับร่าง
</button>
```

Replace `ENTITY` with the correct prop name for each file:
- BlogEditClient: `post` (i.e., `post.published`)
- BranchEditClient: `branch` (i.e., `branch.published`)
- ManualEditClient: `manual` (i.e., `manual.published`)
- VideoHighlightEditClient: `video` (i.e., `video.published`)
- FaqEditClient: `faq` (i.e., `faq.published`)

Check each file's component props to find the correct entity name.

**3. Fix BranchEditClient specifically:** The current secondary button has `handleSubmit(activeTab === 'published')` — change to `handleSubmit(false)`. This is a bug fix since `activeTab` is being removed.

**4. Ensure the header status badge still works.** Edit pages already have conditional badge rendering based on entity.published — leave those unchanged.
  </action>
  <verify>
Grep all 5 edit page files for `activeTab` — should return 0 results.
Grep all 5 edit page files for `role="tablist"` — should return 0 results.
Grep all 5 edit page files for `handleSubmit(true)` — should return 1 result each.
Grep all 5 edit page files for `handleSubmit(false)` — should return 1 result each.
Grep all 5 edit page files for `เผยแพร่แล้ว` — should return 1 result each (status text for published state).
Run `npm run build` to verify no compile errors.
  </verify>
  <done>
All 5 edit pages have: no tab bar, sidebar with dynamic status indicator (green/published or gray/draft) derived from entity prop, orange publish button calling handleSubmit(true), white draft button calling handleSubmit(false). No activeTab references remain. Build passes.
  </done>
</task>

</tasks>

<verification>
After both tasks:
1. `grep -r "activeTab" src/app/\(admin\)/admin/blog/ src/app/\(admin\)/admin/branch/ src/app/\(admin\)/admin/manual/ src/app/\(admin\)/admin/video-highlight/ src/app/\(admin\)/admin/faq/` returns no matches
2. `grep -r "role=\"tablist\"" src/app/\(admin\)/admin/blog/ src/app/\(admin\)/admin/branch/ src/app/\(admin\)/admin/manual/ src/app/\(admin\)/admin/video-highlight/ src/app/\(admin\)/admin/faq/` returns no matches
3. `npm run build` passes
</verification>

<success_criteria>
- All 10 files have DRAFT/PUBLISHED tab bar removed
- All 10 files have consistent sidebar with status indicator + publish + draft buttons
- Create pages show static "ฉบับร่าง" draft status
- Edit pages show dynamic status from entity.published field
- Publish button always calls handleSubmit(true), draft button always calls handleSubmit(false)
- Wording is consistent: "เผยแพร่" for publish, "บันทึกฉบับร่าง" for save as draft
- No build errors
</success_criteria>

<output>
After completion, create `.planning/quick/8-rework-admin-draft-publish-ui-consistenc/quick-8-01-SUMMARY.md`
</output>
