---
phase: quick-18
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/(admin)/admin/layout.jsx
  - src/app/(admin)/admin/(dashboard)/layout.jsx
autonomous: true
must_haves:
  truths:
    - "Admin login page at /admin/login renders WITHOUT sidebar or dashboard chrome"
    - "Admin forgot-password and set-new-password pages render WITHOUT sidebar"
    - "Admin dashboard and all content management pages render WITH sidebar"
    - "All URLs remain unchanged (no URL-visible differences)"
    - "No x-pathname header workaround needed in any layout"
  artifacts:
    - path: "src/app/(admin)/admin/(dashboard)/layout.jsx"
      provides: "Dashboard layout with AdminSidebar, ErrorBoundary, ClientOnly wrapper"
      min_lines: 15
    - path: "src/app/(admin)/admin/layout.jsx"
      provides: "Minimal pass-through layout (no sidebar, no header sniffing)"
      min_lines: 3
  key_links:
    - from: "src/app/(admin)/admin/(dashboard)/layout.jsx"
      to: "src/components/admin/AdminSidebar.jsx"
      via: "import and render"
      pattern: "import AdminSidebar"
    - from: "src/app/(admin)/admin/(auth)/layout.jsx"
      to: "(auth)/login/page.jsx"
      via: "Next.js route group nesting — no sidebar inherited"
      pattern: "return children"
---

<objective>
Separate admin login layout from admin dashboard layout using sibling route groups.

Purpose: The admin login pages currently go through the same layout as dashboard pages. The admin/layout.jsx has a fragile x-pathname header workaround to conditionally skip the sidebar for login routes. The proper fix is to use sibling route groups: (auth) for login pages (no sidebar) and (dashboard) for content management pages (with sidebar). This eliminates the header-sniffing hack and gives each route group its own independent layout.

Output: Clean layout separation where (auth) and (dashboard) are sibling route groups under admin/, each with their own layout.
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/app/(admin)/admin/layout.jsx
@src/app/(admin)/admin/(auth)/layout.jsx
@src/app/(admin)/admin/(auth)/login/page.jsx
@src/app/(admin)/layout.jsx
@src/components/admin/AdminSidebar.jsx
@src/components/ErrorBoundary.jsx
@src/components/admin/ClientOnly.jsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Move sidebar layout into (dashboard) route group and relocate all admin content directories</name>
  <files>
    src/app/(admin)/admin/layout.jsx
    src/app/(admin)/admin/(dashboard)/layout.jsx
  </files>
  <action>
    The current problem: admin/layout.jsx applies to ALL routes under admin/, including (auth)/login pages. It uses a fragile x-pathname header check to conditionally skip the sidebar for login routes. This is wrong — route groups nested inside a directory still inherit the parent directory's layout.

    The fix: Use sibling route groups so (auth) and (dashboard) each have independent layouts.

    Current structure (broken):
    ```
    admin/
      layout.jsx        <-- Sidebar + x-pathname workaround (applies to ALL children)
      (auth)/
        layout.jsx      <-- Pass-through (but admin/layout.jsx still wraps it)
        login/...
      dashboard/        <-- Goes through admin/layout.jsx
      products/...      <-- Goes through admin/layout.jsx
    ```

    Target structure (correct):
    ```
    admin/
      layout.jsx        <-- Minimal pass-through (no sidebar, no header sniffing)
      (auth)/
        layout.jsx      <-- Pass-through (no sidebar) -- already exists, no change
        login/...
      (dashboard)/
        layout.jsx      <-- Sidebar + ErrorBoundary + ClientOnly (NEW)
        dashboard/...   <-- All admin content pages moved here
        products/...
        blog/...
        ...etc
    ```

    Steps:

    1. Create src/app/(admin)/admin/(dashboard)/layout.jsx with the sidebar layout.
       Copy the CURRENT sidebar rendering from admin/layout.jsx but WITHOUT the x-pathname header workaround:
       ```jsx
       import AdminSidebar from '../../../../components/admin/AdminSidebar'
       import ErrorBoundary from '../../../../components/ErrorBoundary'
       import ClientOnly from '../../../../components/admin/ClientOnly'

       export default function DashboardLayout({ children }) {
         return (
           <div className="flex h-screen w-full bg-white overflow-hidden">
             <AdminSidebar />
             <main className="flex-1 overflow-y-auto px-[32px] py-[20px]">
               <ErrorBoundary>
                 <ClientOnly>
                   {children}
                 </ClientOnly>
               </ErrorBoundary>
             </main>
           </div>
         )
       }
       ```
       Note: This is no longer async — no need for headers() since there is no pathname checking. Import paths go one level deeper (../../../../ instead of ../../../) because (dashboard) adds one more directory level in the filesystem.

    2. Move ALL 18 admin content directories into (dashboard)/:
       - about-us -> (dashboard)/about-us
       - account -> (dashboard)/account
       - banner -> (dashboard)/banner
       - blog -> (dashboard)/blog
       - blog-categories -> (dashboard)/blog-categories
       - branch -> (dashboard)/branch
       - categories -> (dashboard)/categories
       - dashboard -> (dashboard)/dashboard
       - faq -> (dashboard)/faq
       - gallery -> (dashboard)/gallery
       - manual -> (dashboard)/manual
       - products -> (dashboard)/products
       - product-types -> (dashboard)/product-types
       - quotations -> (dashboard)/quotations
       - site-settings -> (dashboard)/site-settings
       - users -> (dashboard)/users
       - variations -> (dashboard)/variations
       - video-highlight -> (dashboard)/video-highlight

       Use `mv` commands to move each directory. Since (dashboard) is a route group (parentheses), it is invisible in URLs. All URLs remain exactly the same:
       - /admin/dashboard still works
       - /admin/products still works
       - /admin/blog still works
       - etc.

    3. Simplify admin/layout.jsx to a minimal pass-through:
       ```jsx
       export default function AdminLayout({ children }) {
         return children
       }
       ```
       Remove ALL imports (headers, AdminSidebar, ErrorBoundary, ClientOnly).
       Remove the x-pathname header workaround entirely.
       This layout now does nothing — it just passes children through. The actual layout logic is handled by the sibling route group layouts.

    4. Do NOT modify (auth)/layout.jsx — it already returns just children, which is correct.

    IMPORTANT: The middleware still sets x-pathname header (used for other purposes potentially), so do NOT remove it from middleware.js. Just stop reading it in the admin layout.

    WHY this works: In Next.js App Router, when you have:
      admin/layout.jsx -> (dashboard)/layout.jsx -> dashboard/page.jsx
    The layout chain is: admin/layout -> (dashboard)/layout -> page
    And for auth:
      admin/layout.jsx -> (auth)/layout.jsx -> login/page.jsx
    The layout chain is: admin/layout -> (auth)/layout -> page

    Since admin/layout is now minimal (just children), each route group controls its own chrome independently.
  </action>
  <verify>
    1. Verify directory structure:
       - ls src/app/(admin)/admin/(dashboard)/ should show all 18 content directories + layout.jsx
       - ls src/app/(admin)/admin/(auth)/ should show layout.jsx + login/
       - ls src/app/(admin)/admin/ should show only (auth)/, (dashboard)/, and layout.jsx (no content directories at this level)
    2. Run: npm run build -- confirm no build errors (import paths, missing files)
    3. Run: npm test -- all existing tests pass
    4. Verify admin/layout.jsx is minimal (no AdminSidebar import, no headers import, no x-pathname logic)
    5. Verify (dashboard)/layout.jsx has AdminSidebar, ErrorBoundary, ClientOnly with correct import paths
  </verify>
  <done>
    - /admin/login renders WITHOUT sidebar (goes through (auth)/layout.jsx which has no sidebar)
    - /admin/dashboard renders WITH sidebar (goes through (dashboard)/layout.jsx which has sidebar)
    - All 18 admin content sections render with sidebar layout
    - admin/layout.jsx is a clean pass-through with no x-pathname header workaround
    - No URL changes — all routes remain identical
    - Build succeeds, all tests pass
  </done>
</task>

</tasks>

<verification>
1. Build: npm run build exits 0 (no broken imports from directory moves)
2. Tests: npm test passes (no test references admin layout file paths directly)
3. Layout separation: admin/layout.jsx contains NO AdminSidebar import and NO headers() call
4. Dashboard layout: (dashboard)/layout.jsx renders AdminSidebar + ErrorBoundary + ClientOnly
5. File structure: No content directories remain at admin/ level (all moved to (dashboard)/)
</verification>

<success_criteria>
- Admin login page renders in a clean, standalone layout without sidebar
- All admin content management pages render with the sidebar layout
- The x-pathname header workaround is completely removed from admin/layout.jsx
- Zero URL changes — all routes function identically
- Build and tests pass
</success_criteria>

<output>
After completion, create `.planning/quick/18-the-admin-login-shouldn-t-use-the-same-l/18-SUMMARY.md`
</output>
