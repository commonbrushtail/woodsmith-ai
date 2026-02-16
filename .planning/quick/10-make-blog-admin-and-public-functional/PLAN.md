---
phase: quick-10
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/(admin)/admin/blog/create/page.jsx
  - src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx
  - src/app/(public)/blog/BlogPageClient.jsx
  - src/components/admin/BlogListClient.jsx
autonomous: true
must_haves:
  truths:
    - "Admin can create a blog post with category and it saves to the database"
    - "Admin can edit a blog post's category from the edit page"
    - "Admin blog list search filters posts by title"
    - "Public blog page category tabs correctly filter posts from the database"
    - "Blog create page does not show misleading end-date pickers"
  artifacts:
    - path: "src/app/(admin)/admin/blog/create/page.jsx"
      provides: "Blog create form with category submission and simplified publish date"
    - path: "src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx"
      provides: "Blog edit form with category select and publish date picker"
    - path: "src/app/(public)/blog/BlogPageClient.jsx"
      provides: "Public blog listing with aligned category tab filtering"
    - path: "src/components/admin/BlogListClient.jsx"
      provides: "Admin blog list with working search filter"
  key_links:
    - from: "src/app/(admin)/admin/blog/create/page.jsx"
      to: "src/lib/actions/blog.js"
      via: "formData.set('category', category)"
      pattern: "formData\\.set\\('category'"
    - from: "src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx"
      to: "src/lib/actions/blog.js"
      via: "formData.set('category', category)"
      pattern: "formData\\.set\\('category'"
    - from: "src/app/(public)/blog/BlogPageClient.jsx"
      to: "database category values"
      via: "categoryKey matching tab keys"
      pattern: "categoryKey.*activeTab"
---

<objective>
Fix 6 bugs that prevent the blog admin and public pages from functioning correctly.

Purpose: Blog posts created/edited via admin currently lose their category (never sent to server), the public page category tabs don't match admin values so filtering is broken, the edit page is missing category and publish date fields, the admin list search doesn't filter, and the create page shows misleading end-date pickers for a DB column that doesn't exist.

Output: Fully functional blog create/edit/list admin pages and correctly filtered public blog page.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/app/(admin)/admin/blog/create/page.jsx
@src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx
@src/app/(public)/blog/BlogPageClient.jsx
@src/components/admin/BlogListClient.jsx
@src/lib/actions/blog.js
@src/lib/validations/blog.js
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix blog create page - add category to FormData and remove misleading end-date pickers</name>
  <files>src/app/(admin)/admin/blog/create/page.jsx</files>
  <action>
Two bugs in this file:

**Bug 1 - Category not sent to server:**
In the `handleSubmit` function (around line 278), after `formData.set('title', title)`, add:
```js
formData.set('category', category)
```
This is the only missing line. The category state and select UI already exist and work.

**Bug 2 - Misleading end-date pickers:**
The `blog_posts` table only has a single `publish_date` column (no `publish_start`/`publish_end`). The end date/time pickers collect data that is never saved. Remove:
1. The `endDate` and `endTime` state variables (lines 222-223)
2. The `showEndCal` and `showEndTime` state variables (lines 229-230)
3. The entire "End date + time" section in the JSX (the divider `<div className="h-px bg-[#e8eaef]" />` and the entire end date block below it, lines ~591-656)
4. References to `endDate`/`endTime` in the clear button onClick handler
5. References to `showEndCal`/`showEndTime` in the picker toggle onClick handlers (remove `setShowEndCal(false); setShowEndTime(false)` from start picker handlers)

Update the section label from `กำหนดช่วงวันเวลาเริ่มต้น-สิ้นสุด การเผยแพร่` to `วันที่เผยแพร่` since there is no range anymore.

Update the clear button condition from `(startDate || startTime || endDate || endTime)` to `(startDate || startTime)`.

Update the clear button onClick from resetting all 4 values to just resetting `startDate` and `startTime`.

Remove the "วันเริ่มต้น" sub-label span since there's no start/end distinction anymore.

**Bug 3 - Align category option values to match public page:**
Change the category `<select>` options (lines 465-469) from:
```html
<option value="news">ข่าวสาร</option>
<option value="knowledge">ความรู้</option>
<option value="promotion">โปรโมชั่น</option>
<option value="inspiration">แรงบันดาลใจ</option>
```
to:
```html
<option value="ideas">ไอเดียและเคล็ดลับ</option>
<option value="trend">เทรนด์</option>
<option value="style">สไตล์และฟังก์ชัน</option>
<option value="knowledge">ความรู้ทั่วไป</option>
```
These values match the public BlogPageClient tab keys exactly (`ideas`, `trend`, `style`, `knowledge`).
  </action>
  <verify>
1. Read the file and confirm `formData.set('category', category)` exists in handleSubmit
2. Confirm no `endDate`, `endTime`, `showEndCal`, `showEndTime` state variables exist
3. Confirm category option values are `ideas`, `trend`, `style`, `knowledge`
4. Confirm section label is `วันที่เผยแพร่`
5. Run `npm run build` to confirm no build errors
  </verify>
  <done>
Blog create page sends category to server, shows only a single publish date picker (no misleading end date), and category values match public page tab keys.
  </done>
</task>

<task type="auto">
  <name>Task 2: Add category select and publish date picker to blog edit page</name>
  <files>src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx</files>
  <action>
The edit page is missing category select and publish date picker that exist on the create page. Add them.

**Step 1 - Add imports:**
Add these imports at the top (after existing imports):
```js
import CalendarPicker from '@/components/admin/CalendarPicker'
import TimePickerDropdown from '@/components/admin/TimePickerDropdown'
```

**Step 2 - Add SVG icon components:**
Add `CalendarIcon` and `ClockIcon` components (copy from create page) after the existing icon components:
```js
function CalendarIcon({ size = 16, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function ClockIcon({ size = 16, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
```

**Step 3 - Add state variables:**
After the existing state declarations (around line 58), add:
```js
const [category, setCategory] = useState(post.category || '')
const [publishDate, setPublishDate] = useState(
  post.publish_date ? post.publish_date.split('T')[0] : ''
)
const [publishTime, setPublishTime] = useState(
  post.publish_date && post.publish_date.includes('T')
    ? post.publish_date.split('T')[1]?.slice(0, 5) || ''
    : ''
)
const [showCal, setShowCal] = useState(false)
const [showTime, setShowTime] = useState(false)
```

**Step 4 - Add category and publish_date to handleSubmit:**
In the `handleSubmit` function, after `formData.set('recommended', ...)` add:
```js
formData.set('category', category)
if (publishDate) {
  const pd = publishTime ? `${publishDate}T${publishTime}:00` : `${publishDate}T00:00:00`
  formData.set('publish_date', pd)
}
```

**Step 5 - Add helper function:**
Before the return statement, add:
```js
const formatDateDisplay = (dateStr) => {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${Number(y) + 543}`
}
```

**Step 6 - Add Category section to JSX:**
After the Title section and before the Content section (between the title `</section>` and the content `<section>`), add:
```jsx
{/* Category */}
<section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[8px]">
  <label htmlFor="blogCategory" className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
    หมวดหมู่
  </label>
  <div className="relative">
    <select
      id="blogCategory"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className={`
        w-full font-['IBM_Plex_Sans_Thai'] text-[14px] border border-[#e8eaef] rounded-[8px]
        px-[14px] py-[10px] outline-none appearance-none bg-white cursor-pointer
        focus:border-[#ff7e1b] focus:ring-1 focus:ring-[#ff7e1b]/20 transition-all
        ${category ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}
      `}
    >
      <option value="" disabled>เลือกหมวดหมู่</option>
      <option value="ideas">ไอเดียและเคล็ดลับ</option>
      <option value="trend">เทรนด์</option>
      <option value="style">สไตล์และฟังก์ชัน</option>
      <option value="knowledge">ความรู้ทั่วไป</option>
    </select>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
      <path d="M4 6L8 10L12 6" />
    </svg>
  </div>
</section>
```

**Step 7 - Add Publish Date section to JSX:**
After the Recommendation section and before the closing `</div>` of the main form area, add:
```jsx
{/* Publish Date */}
<section className="bg-white rounded-[12px] border border-[#e8eaef] p-[24px] flex flex-col gap-[16px]">
  <label className="font-['IBM_Plex_Sans_Thai'] text-[14px] font-medium text-[#1f2937]">
    วันที่เผยแพร่
  </label>
  {(publishDate || publishTime) && (
    <button
      type="button"
      onClick={() => { setPublishDate(''); setPublishTime('') }}
      className="self-start font-['IBM_Plex_Sans_Thai'] text-[12px] text-[#6b7280] hover:text-red-500 hover:border-red-300 border border-[#e8eaef] rounded-[6px] px-[10px] py-[4px] bg-white cursor-pointer transition-colors"
    >
      ล้างค่า
    </button>
  )}
  <div className="flex items-center gap-[12px]">
    {/* Date picker */}
    <div className="relative flex-1">
      <button
        type="button"
        onClick={() => { setShowCal(!showCal); setShowTime(false) }}
        className={`
          w-full flex items-center gap-[8px] border border-[#e8eaef] rounded-[8px]
          px-[14px] py-[10px] bg-white cursor-pointer transition-all text-left
          font-['IBM_Plex_Sans_Thai'] text-[14px]
          ${showCal ? 'border-[#ff7e1b] ring-1 ring-[#ff7e1b]/20' : 'hover:border-[#d1d5db]'}
          ${publishDate ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}
        `}
        aria-label="Select publish date"
      >
        <CalendarIcon size={16} color="#6b7280" />
        <span>{publishDate ? formatDateDisplay(publishDate) : 'dd/mm/yyyy'}</span>
      </button>
      {showCal && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowCal(false)} />
          <CalendarPicker
            selectedDate={publishDate}
            onSelect={setPublishDate}
            onClose={() => setShowCal(false)}
          />
        </>
      )}
    </div>
    {/* Time picker */}
    <div className="relative w-[140px]">
      <button
        type="button"
        onClick={() => { setShowTime(!showTime); setShowCal(false) }}
        className={`
          w-full flex items-center gap-[8px] border border-[#e8eaef] rounded-[8px]
          px-[14px] py-[10px] bg-white cursor-pointer transition-all text-left
          font-['IBM_Plex_Sans_Thai'] text-[14px]
          ${showTime ? 'border-[#ff7e1b] ring-1 ring-[#ff7e1b]/20' : 'hover:border-[#d1d5db]'}
          ${publishTime ? 'text-[#1f2937]' : 'text-[#bfbfbf]'}
        `}
        aria-label="Select publish time"
      >
        <ClockIcon size={16} color="#6b7280" />
        <span>{publishTime || '00:00'}</span>
      </button>
      {showTime && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowTime(false)} />
          <TimePickerDropdown
            selectedTime={publishTime}
            onSelect={setPublishTime}
            onClose={() => setShowTime(false)}
          />
        </>
      )}
    </div>
  </div>
</section>
```

Use the same category values as the create page: `ideas`, `trend`, `style`, `knowledge`.
  </action>
  <verify>
1. Read the file and confirm category state initialized from `post.category`
2. Confirm `formData.set('category', category)` in handleSubmit
3. Confirm `formData.set('publish_date', pd)` in handleSubmit
4. Confirm CalendarPicker and TimePickerDropdown imports exist
5. Confirm category select JSX with correct option values exists
6. Run `npm run build` to confirm no build errors
  </verify>
  <done>
Blog edit page has category select field (pre-populated from post data) and publish date/time picker (pre-populated from post.publish_date). Both values are sent to the server on save.
  </done>
</task>

<task type="auto">
  <name>Task 3: Fix public blog page category display labels</name>
  <files>src/app/(public)/blog/BlogPageClient.jsx</files>
  <action>
The public blog page's category filtering logic already works correctly: it lowercases `p.category` and compares against tab keys. With the admin now saving `ideas`, `trend`, `style`, `knowledge` as category values, the filtering will work.

However, the `category` field displayed on each BlogCard currently shows the raw DB value (e.g., "ideas", "trend") which is not user-friendly. The BlogCard renders `{category}` directly as the display text.

Update the `allPosts` mapping (around line 128-136) to use a display-friendly category label. Add a category label map at the top of the component (inside the function, before the state declarations):

```js
const CATEGORY_LABELS = {
  ideas: 'ไอเดียและเคล็ดลับ',
  trend: 'เทรนด์',
  style: 'สไตล์และฟังก์ชัน',
  knowledge: 'ความรู้ทั่วไป',
}
```

Then update the `allPosts` mapping to use this map for the display `category`:

```js
const allPosts = dbPosts.length > 0
  ? dbPosts.map(p => ({
      id: p.id,
      slug: p.slug,
      image: p.cover_image_url || imgCard1,
      category: CATEGORY_LABELS[(p.category || '').toLowerCase()] || p.category || 'บทความ',
      categoryKey: (p.category || '').toLowerCase(),
      title: p.title,
    }))
  : fallbackPosts
```

This way `categoryKey` stays as the raw value for filtering (e.g., `ideas`), while `category` shows the Thai label for display (e.g., `ไอเดียและเคล็ดลับ`).
  </action>
  <verify>
1. Read the file and confirm CATEGORY_LABELS map exists with all 4 keys
2. Confirm `allPosts` mapping uses `CATEGORY_LABELS` for the `category` display field
3. Confirm `categoryKey` still uses raw lowercase value for filtering
4. Run `npm run build` to confirm no build errors
  </verify>
  <done>
Public blog page displays Thai category labels on cards while correctly filtering by tab using raw category key values. All 4 category tabs (ideas, trend, style, knowledge) now match admin category values.
  </done>
</task>

<task type="auto">
  <name>Task 4: Fix admin blog list search to actually filter results</name>
  <files>src/components/admin/BlogListClient.jsx</files>
  <action>
The `searchQuery` state updates when the user types in the search input, but it is never used to filter `sortedBlogs`. The search bar is purely cosmetic.

**Fix:** After the `sortedBlogs` sort (line 149-153), add a filtering step. Replace the current `sortedBlogs` definition:

```js
const sortedBlogs = [...blogs].sort((a, b) =>
  sortAsc
    ? (a.sort_order ?? 0) - (b.sort_order ?? 0)
    : (b.sort_order ?? 0) - (a.sort_order ?? 0)
)
```

with:

```js
const filteredBlogs = searchQuery.trim()
  ? blogs.filter(b => b.title?.toLowerCase().includes(searchQuery.trim().toLowerCase()))
  : blogs

const sortedBlogs = [...filteredBlogs].sort((a, b) =>
  sortAsc
    ? (a.sort_order ?? 0) - (b.sort_order ?? 0)
    : (b.sort_order ?? 0) - (a.sort_order ?? 0)
)
```

This filters the blog list by title (case-insensitive) before sorting. The search filters client-side since all blogs are already loaded.

Also update the empty state message row. Currently it checks `sortedBlogs.length === 0` which is correct, but the message should differentiate between "no blogs at all" vs "no search results". Update the empty state `<td>` content from:

```
ไม่พบข้อมูลบทความ
```

to:

```jsx
{searchQuery.trim() ? `ไม่พบบทความที่ตรงกับ "${searchQuery.trim()}"` : 'ไม่พบข้อมูลบทความ'}
```
  </action>
  <verify>
1. Read the file and confirm `filteredBlogs` variable exists and filters by `searchQuery`
2. Confirm `sortedBlogs` sorts the `filteredBlogs` (not raw `blogs`)
3. Confirm empty state message differentiates between no results and no blogs
4. Run `npm run build` to confirm no build errors
  </verify>
  <done>
Admin blog list search bar filters displayed blogs by title in real-time. Empty state shows appropriate message based on whether a search is active.
  </done>
</task>

<task type="auto">
  <name>Task 5: Run build and tests to verify all changes</name>
  <files>
    src/app/(admin)/admin/blog/create/page.jsx
    src/app/(admin)/admin/blog/edit/[id]/BlogEditClient.jsx
    src/app/(public)/blog/BlogPageClient.jsx
    src/components/admin/BlogListClient.jsx
  </files>
  <action>
Run the full build and test suite to confirm nothing is broken:

1. Run `npm run build` — must succeed with no errors
2. Run `npm test` — existing tests must still pass (199 of 202; 3 pre-existing failures are acceptable)

If any blog-related tests fail due to the changes (e.g., tests referencing old category values like "news", "promotion", "inspiration"), update those test files to use the new category values (`ideas`, `trend`, `style`, `knowledge`).

Check for blog-related test files:
- `tests/components/admin/blog*.test.*`
- `tests/lib/actions/blog*.test.*`
- Any test importing BlogListClient or BlogPageClient

If build fails due to import issues with CalendarPicker or TimePickerDropdown in the edit page, verify the import paths match the actual file locations in `src/components/admin/`.
  </action>
  <verify>
1. `npm run build` exits with code 0
2. `npm test` shows no new test failures beyond the 3 pre-existing ones
  </verify>
  <done>
All 4 modified files compile successfully. No new test regressions introduced. Blog admin create, edit, and list pages are functional. Public blog category filtering works correctly.
  </done>
</task>

</tasks>

<verification>
After all tasks complete:
1. Blog create page: category select sends value to server via FormData, end-date pickers removed, category values match public page
2. Blog edit page: category select field exists and is pre-populated from post data, publish date picker exists and is pre-populated, both send to server on save
3. Public blog page: category tabs filter correctly against DB values, category labels display in Thai
4. Admin blog list: search input filters displayed blogs by title in real-time
5. Build succeeds, no new test failures
</verification>

<success_criteria>
- Admin creates blog with category "ideas" -> saves to DB with category="ideas"
- Admin edits blog -> can change category, value persists on save
- Admin edits blog -> can set/change publish date, value persists on save
- Public blog page -> clicking "ไอเดียและเคล็ดลับ" tab shows only posts with category="ideas"
- Admin blog list -> typing in search box filters the table rows by title
- Blog create page -> no end-date picker shown, only single publish date
- `npm run build` succeeds
</success_criteria>

<output>
After completion, create `.planning/quick/10-make-blog-admin-and-public-functional/SUMMARY.md`
</output>
