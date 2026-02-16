---
phase: quick-8
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - "src/app/(admin)/admin/products/create/ProductCreateClient.jsx"
  - "src/app/(admin)/admin/products/edit/[id]/ProductEditClient.jsx"
  - "src/app/(admin)/admin/banner/edit/[id]/BannerEditClient.jsx"
  - "src/app/(admin)/admin/about-us/page.jsx"
  - "src/app/(admin)/admin/profile/page.jsx"
autonomous: true
must_haves:
  truths:
    - "No DRAFT/PUBLISHED tab bar visible on any of these 5 pages"
    - "Products pages: sidebar shows status indicator, publish button says 'เผยแพร่' and calls handleSubmit(true), draft button says 'บันทึกฉบับร่าง' and calls handleSubmit(false)"
    - "Banner page: sidebar shows status using 'ใช้งาน'/'ไม่ใช้งาน' labels with banner.status field"
    - "About Us page: no tab bar, sidebar has single 'บันทึก' button only"
    - "Profile page: no tab bar, sidebar has single 'บันทึก' button only"
    - "Products primary button no longer depends on activeTab — always publishes"
  artifacts:
    - path: "src/app/(admin)/admin/products/create/ProductCreateClient.jsx"
      provides: "Products create without tabs, with corrected sidebar"
    - path: "src/app/(admin)/admin/products/edit/[id]/ProductEditClient.jsx"
      provides: "Products edit without tabs, with corrected sidebar"
    - path: "src/app/(admin)/admin/banner/edit/[id]/BannerEditClient.jsx"
      provides: "Banner edit without tabs, with status sidebar"
    - path: "src/app/(admin)/admin/about-us/page.jsx"
      provides: "About Us without tabs, single save button"
    - path: "src/app/(admin)/admin/profile/page.jsx"
      provides: "Profile without tabs, single save button"
  key_links:
    - from: "Products publish button"
      to: "handleSubmit(true)"
      via: "onClick - no longer depends on activeTab"
      pattern: "handleSubmit\\(true\\)"
    - from: "Banner publish button"
      to: "handleSave(true)"
      via: "onClick"
      pattern: "handleSave\\(true\\)"
---

<objective>
Remove DRAFT/PUBLISHED tab bars and fix sidebar UI on the 5 remaining admin pages: Products create/edit (Pattern B), Banner edit (Pattern C), About Us and Profile (Pattern D).

Purpose: Complete the draft/publish UI consistency rework for the non-standard pages that each have unique patterns requiring specific handling.
Output: 5 updated admin page files with consistent sidebar UI.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@CLAUDE.md

These 5 files have special patterns different from the standard 10 files in Plan 01:
- Products Create/Edit: primary button currently says "บันทึก" and uses `handleSubmit(activeTab === 'published')` — THIS IS A BUG since the tab controls what gets published
- Banner Edit: uses `status` field ('active'/'inactive') instead of `published` (true/false), and calls `handleSave` not `handleSubmit`
- About Us + Profile: no concept of published/draft — just need tab removal and keep single save button
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix Products create/edit — remove tabs, fix activeTab bug in sidebar</name>
  <files>
    src/app/(admin)/admin/products/create/ProductCreateClient.jsx
    src/app/(admin)/admin/products/edit/[id]/ProductEditClient.jsx
  </files>
  <action>
**ProductCreateClient.jsx changes:**

1. Remove tab-related code:
   - Delete: `const [activeTab, setActiveTab] = useState('draft')` (line ~86)
   - Delete: `const tabs = [{ key: 'draft', ... }, { key: 'published', ... }]` (lines ~135-138)
   - Delete: The entire tab bar JSX block (`<div className="flex gap-0 border-b border-[#e5e7eb]" role="tablist">` and its children, lines ~268-285)

2. Replace the sidebar content (inside the `<aside>` `<div>` with sticky positioning):

```jsx
<h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-[#1f2937] uppercase tracking-[0.5px] m-0">
  Entry
</h3>

{/* Status indicator */}
<div className="flex items-center gap-[8px]">
  <span className="w-[8px] h-[8px] rounded-full bg-[#9ca3af]" />
  <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
    สถานะ: ฉบับร่าง
  </span>
</div>

<button
  type="button"
  onClick={() => handleSubmit(true)}
  disabled={isPending}
  className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-white bg-orange border-0 rounded-[8px] py-[10px] cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
>
  {isPending ? 'กำลังบันทึก...' : 'เผยแพร่'}
</button>
<button
  type="button"
  onClick={() => handleSubmit(false)}
  disabled={isPending}
  className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#494c4f] bg-white border border-[#e8eaef] rounded-[8px] py-[10px] cursor-pointer hover:bg-[#f3f4f6] transition-colors disabled:opacity-50"
>
  บันทึกฉบับร่าง
</button>
```

The key fix: The old primary button had `handleSubmit(activeTab === 'published')` which was a bug — it published only when the tab was on "PUBLISHED". Now it explicitly calls `handleSubmit(true)` to always publish. The label changes from "บันทึก" to "เผยแพร่".

**ProductEditClient.jsx changes:**

1. Remove tab-related code:
   - Delete: `const [activeTab, setActiveTab] = useState(product.published ? 'published' : 'draft')` (line ~98)
   - Delete: `const tabs = [...]` (lines ~156-159)
   - Delete: The entire tab bar JSX block (lines ~277-294)

2. Replace the sidebar content:

```jsx
<h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[14px] text-[#1f2937] uppercase tracking-[0.5px] m-0">
  Entry
</h3>

{/* Status indicator — derived from product.published */}
<div className="flex items-center gap-[8px]">
  <span className={`w-[8px] h-[8px] rounded-full ${product.published ? 'bg-green-500' : 'bg-[#9ca3af]'}`} />
  <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
    สถานะ: {product.published ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
  </span>
</div>

<button
  type="button"
  onClick={() => handleSubmit(true)}
  disabled={isPending}
  className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-white bg-orange border-0 rounded-[8px] py-[10px] cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
>
  {isPending ? 'กำลังบันทึก...' : 'เผยแพร่'}
</button>
<button
  type="button"
  onClick={() => handleSubmit(false)}
  disabled={isPending}
  className="w-full font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#494c4f] bg-white border border-[#e8eaef] rounded-[8px] py-[10px] cursor-pointer hover:bg-[#f3f4f6] transition-colors disabled:opacity-50"
>
  บันทึกฉบับร่าง
</button>
```

Same bug fix as create: old primary button had `handleSubmit(activeTab === 'published')`. Now explicit `handleSubmit(true)`.
  </action>
  <verify>
Grep both product files for `activeTab` — should return 0 results.
Grep both product files for `role="tablist"` — should return 0 results.
Grep both product files for `handleSubmit(true)` — should return 1 result each (publish button).
Grep both product files for `handleSubmit(false)` — should return 1 result each (draft button).
Grep both product files for `activeTab === 'published'` — should return 0 results (bug is fixed).
  </verify>
  <done>
Both product pages have no tab bar, sidebar with status indicator, explicit publish/draft buttons, and the activeTab-dependent publish bug is fixed.
  </done>
</task>

<task type="auto">
  <name>Task 2: Update Banner edit, About Us, and Profile — remove tabs with pattern-specific handling</name>
  <files>
    src/app/(admin)/admin/banner/edit/[id]/BannerEditClient.jsx
    src/app/(admin)/admin/about-us/page.jsx
    src/app/(admin)/admin/profile/page.jsx
  </files>
  <action>
**BannerEditClient.jsx changes:**

Banner uses `status` field ('active'/'inactive') instead of `published`, and calls `handleSave` not `handleSubmit`.

1. Remove tab-related code:
   - Delete: `const [activeTab, setActiveTab] = useState(banner.status === 'active' ? 'published' : 'draft')` (lines ~64-66)
   - Delete: `const tabs = [...]` (lines ~68-71)
   - Delete: The entire tab bar JSX block (lines ~147-168)

2. Replace the sidebar content:

```jsx
<h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
  Entry
</h3>

{/* Status indicator — uses banner.status */}
<div className="flex items-center gap-[8px]">
  <span className={`w-[8px] h-[8px] rounded-full ${banner.status === 'active' ? 'bg-green-500' : 'bg-[#9ca3af]'}`} />
  <span className="font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
    สถานะ: {banner.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
  </span>
</div>

{/* Publish button — sets status to 'active' */}
<button
  type="button"
  onClick={() => handleSave(true)}
  disabled={isPending}
  className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-orange text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-orange/90 transition-colors disabled:opacity-50"
>
  {isPending ? 'กำลังบันทึก...' : 'เผยแพร่'}
</button>

{/* Save as inactive button */}
<button
  type="button"
  onClick={() => handleSave(false)}
  disabled={isPending}
  className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-white text-[#374151] font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border border-[#e5e7eb] cursor-pointer hover:bg-[#f9fafb] transition-colors disabled:opacity-50"
>
  บันทึกฉบับร่าง
</button>
```

Note: Keep the existing `handleSave` function name (NOT handleSubmit) — banner uses `handleSave(publish)` where true sets status='active' and false sets status='inactive'. This existing logic is correct.

**AboutUsPage (about-us/page.jsx) changes:**

This page has no `published` field — it is always published. Just remove tabs and keep single save button.

1. Remove tab-related code:
   - Delete: `const [activeTab, setActiveTab] = useState('published')` (line ~41)
   - Delete: `const tabs = [...]` (lines ~81-84)
   - Delete: The entire tab bar JSX block (lines ~130-153)

2. The sidebar already has a single "บันทึก" button calling `handleSubmit` (no publish arg). Keep this as-is. No status indicator needed since About Us has no draft/published concept. The sidebar should remain:

```jsx
<h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
  Entry
</h3>

<button
  type="button"
  onClick={handleSubmit}
  disabled={isPending}
  className="flex-1 flex items-center justify-center gap-[6px] px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
>
  {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
</button>
```

Remove the dots menu button next to the save button (it does nothing). Keep the sidebar simpler.

**ProfilePage (profile/page.jsx) changes:**

Same as About Us — no `published` field.

1. Remove tab-related code:
   - Delete: `const [activeTab, setActiveTab] = useState('draft')` (line ~48)
   - Delete: `const tabs = [...]` (lines ~80-83)
   - Delete: The entire tab bar JSX block

2. Keep single save button in sidebar. The `handleSubmit` in Profile takes a `publish` arg but ignores it (just saves the form data). Keep the sidebar simple with just a "บันทึก" button:

```jsx
<h3 className="font-['IBM_Plex_Sans_Thai'] font-semibold text-[12px] text-[#9ca3af] tracking-[0.8px] uppercase m-0">
  Entry
</h3>

<button
  type="button"
  onClick={() => handleSubmit()}
  disabled={isPending}
  className="w-full flex items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-[#ff7e1b] text-white font-['IBM_Plex_Sans_Thai'] font-medium text-[14px] border-0 cursor-pointer hover:bg-[#e56f15] transition-colors disabled:opacity-50"
>
  {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
</button>
```
  </action>
  <verify>
Grep all 3 files for `activeTab` — should return 0 results.
Grep all 3 files for `role="tablist"` — should return 0 results.
Grep banner file for `banner.status === 'active'` — should return results (status indicator uses it).
Grep banner file for `handleSave(true)` — should return 1 result (publish button).
Grep banner file for `handleSave(false)` — should return 1 result (save as inactive button).
Run `npm run build` to verify no compile errors across all 15 modified files.
  </verify>
  <done>
Banner edit has status indicator using 'ใช้งาน'/'ไม่ใช้งาน' labels, publish/draft buttons using handleSave. About Us and Profile have tab bars removed and retain single save button only. No activeTab references remain in any of the 5 files. Build passes.
  </done>
</task>

</tasks>

<verification>
After both tasks:
1. `grep -r "activeTab" src/app/\(admin\)/admin/products/ src/app/\(admin\)/admin/banner/ src/app/\(admin\)/admin/about-us/ src/app/\(admin\)/admin/profile/` returns no matches
2. `grep -r "role=\"tablist\"" src/app/\(admin\)/admin/products/ src/app/\(admin\)/admin/banner/ src/app/\(admin\)/admin/about-us/ src/app/\(admin\)/admin/profile/` returns no matches
3. No instances of `handleSubmit(activeTab` anywhere in the codebase
4. `npm run build` passes
</verification>

<success_criteria>
- Products pages: tab bar removed, publish button explicitly calls handleSubmit(true) (activeTab bug fixed), draft button calls handleSubmit(false)
- Banner page: tab bar removed, status shows "ใช้งาน"/"ไม่ใช้งาน", buttons call handleSave(true)/handleSave(false)
- About Us: tab bar removed, single "บันทึก" button retained
- Profile: tab bar removed, single "บันทึก" button retained
- No build errors
</success_criteria>

<output>
After completion, create `.planning/quick/8-rework-admin-draft-publish-ui-consistenc/quick-8-02-SUMMARY.md`
</output>
