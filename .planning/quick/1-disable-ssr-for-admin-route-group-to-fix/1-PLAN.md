---
phase: quick-1
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/admin/ClientOnly.jsx
  - src/app/(admin)/admin/layout.jsx
  - src/components/admin/CategoriesListClient.jsx
autonomous: true

must_haves:
  truths:
    - Admin pages render without hydration errors in console
    - dnd-kit sortable lists work correctly in admin pages
    - Admin pages do not SSR (client-only rendering)
  artifacts:
    - path: "src/components/admin/ClientOnly.jsx"
      provides: "Client-only mount guard component"
      min_lines: 15
    - path: "src/app/(admin)/admin/layout.jsx"
      provides: "Admin layout wrapping children with ClientOnly"
      contains: "ClientOnly"
  key_links:
    - from: "src/app/(admin)/admin/layout.jsx"
      to: "src/components/admin/ClientOnly.jsx"
      via: "import and wrap children"
      pattern: "<ClientOnly>"
---

<objective>
Eliminate dnd-kit hydration errors across ALL admin pages by disabling SSR for the entire admin route group. Admin pages are internal-only (not SEO-relevant), so client-only rendering is safe. This fixes pre-existing `aria-describedby` mismatches in 7 admin list pages (categories, product-types, banners, FAQ, gallery, manuals, video-highlights).

Purpose: Permanent fix for dnd-kit hydration errors without per-component workarounds
Output: ClientOnly wrapper + updated admin layout + reverted CategoriesListClient
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@c:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/.planning/PROJECT.md
@c:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/src/app/(admin)/admin/layout.jsx
@c:/Users/commo/OneDrive/Documents/GitHub/woodsmith-ai/src/components/admin/CategoriesListClient.jsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create ClientOnly wrapper component</name>
  <files>src/components/admin/ClientOnly.jsx</files>
  <action>
Create a new `ClientOnly.jsx` component in `src/components/admin/`:

```jsx
'use client'

import { useState, useEffect } from 'react'

export default function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return fallback
  }

  return <>{children}</>
}
```

This delays rendering until after client-side mount, preventing SSR/client HTML mismatches. The component is marked `'use client'`, uses a `mounted` state guard, and accepts optional fallback content.
  </action>
  <verify>File exists and exports ClientOnly component with mounted guard</verify>
  <done>ClientOnly.jsx created in src/components/admin/</done>
</task>

<task type="auto">
  <name>Task 2: Update admin layout to wrap children with ClientOnly</name>
  <files>src/app/(admin)/admin/layout.jsx</files>
  <action>
Modify `src/app/(admin)/admin/layout.jsx`:

1. Import ClientOnly: `import ClientOnly from '../../../components/admin/ClientOnly'`
2. Wrap the `{children}` slot (inside ErrorBoundary) with `<ClientOnly>{children}</ClientOnly>`

Final structure:
```jsx
<main className="flex-1 overflow-y-auto px-[32px] py-[20px]">
  <ErrorBoundary>
    <ClientOnly>
      {children}
    </ClientOnly>
  </ErrorBoundary>
</main>
```

Do NOT add `'use client'` to the layout itself — the layout remains a Server Component, only the children slot is client-only.
  </action>
  <verify>Layout imports ClientOnly and wraps children; layout has no 'use client' directive</verify>
  <done>Admin layout updated to disable SSR for all admin pages</done>
</task>

<task type="auto">
  <name>Task 3: Revert mounted guard in CategoriesListClient</name>
  <files>src/components/admin/CategoriesListClient.jsx</files>
  <action>
Remove the recently-added mounted state guard from `CategoriesListClient.jsx`:

1. Remove line 159: `const [mounted, setMounted] = useState(false)`
2. Remove line 161: `useEffect(() => { setMounted(true) }, [])`
3. Remove the conditional rendering at lines 271-395 — remove the `{mounted ? (` and the `) : ( ... )}` fallback
4. Keep the DndContext directly in the JSX without the mounted guard

The DndContext should render unconditionally because the layout-level ClientOnly wrapper now handles SSR prevention globally.
  </action>
  <verify>CategoriesListClient has no `mounted` state, DndContext renders unconditionally</verify>
  <done>Component-level workaround removed — layout-level fix is sufficient</done>
</task>

</tasks>

<verification>
1. Start dev server: `npm run dev`
2. Navigate to admin categories list: `http://localhost:3000/admin/categories`
3. Check browser console — should have ZERO hydration warnings related to `aria-describedby`
4. Test drag-and-drop — should work correctly
5. Verify other admin list pages (banners, FAQ, gallery, manuals, video-highlights, product-types) — all should render without hydration errors
</verification>

<success_criteria>
- ClientOnly component exists in `src/components/admin/`
- Admin layout wraps children with ClientOnly
- CategoriesListClient has no mounted state guard
- All admin pages render client-only (no SSR)
- Zero hydration errors in browser console for admin pages
- dnd-kit drag-and-drop functionality works across all admin list pages
</success_criteria>

<output>
After completion, create `.planning/quick/1-disable-ssr-for-admin-route-group-to-fix/1-SUMMARY.md`
</output>
