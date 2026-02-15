---
phase: quick-4
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx
autonomous: true

must_haves:
  truths:
    - "Save button preserves current publish status (draft stays draft, published stays published)"
    - "Publish button still sets status to published"
    - "Active tab reflects current branch published state"
  artifacts:
    - path: "src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx"
      provides: "Branch edit form with correct save behavior"
      min_lines: 300
  key_links:
    - from: "Save button (line 289)"
      to: "handleSubmit function"
      via: "onClick handler"
      pattern: "handleSubmit\\(activeTab === 'published'\\)"
---

<objective>
Fix the branch edit Save button to preserve the current publish status instead of always setting branches to draft.

Purpose: Prevent accidental status changes when admins edit published branches. Currently, the "บันทึก" (Save) button calls `handleSubmit(false)`, which always sets `published: false`, demoting published branches to draft.

Output: Save button that preserves the active tab status (draft or published).
</objective>

<execution_context>
@C:/Users/commo/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/commo/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx
</context>

<tasks>

<task type="auto">
  <name>Fix Save button to preserve publish status</name>
  <files>src/app/(admin)/admin/branch/edit/[id]/BranchEditClient.jsx</files>
  <action>
Change line 289 from:
```js
onClick={() => handleSubmit(false)}
```

To:
```js
onClick={() => handleSubmit(activeTab === 'published')}
```

This makes the Save button preserve the current active tab status:
- If branch is in "published" tab (activeTab === 'published'), save as published
- If branch is in "draft" tab (activeTab === 'draft'), save as draft

The `activeTab` state is already initialized from `branch.published` (line 40), and users can switch tabs to change status before saving. The "เผยแพร่" (Publish) button on line 279 already correctly calls `handleSubmit(true)` to force publish.
  </action>
  <verify>
1. Read the modified file to confirm the change
2. Run `npm run lint` to check for syntax errors
  </verify>
  <done>
- Line 289 calls `handleSubmit(activeTab === 'published')` instead of `handleSubmit(false)`
- No lint errors
- Save button now preserves current tab status
- Publish button still forces published=true
  </done>
</task>

</tasks>

<verification>
Manual verification steps (after deployment):
1. Navigate to `/admin/branch` in browser
2. Edit a published branch
3. Make a change (e.g., update phone number)
4. Click "บันทึก" (Save) button
5. Expected: Branch remains published (green badge, "Published" status)
6. Edit a draft branch
7. Make a change
8. Click "บันทึก" (Save) button
9. Expected: Branch remains draft (blue badge, "Draft" status)
</verification>

<success_criteria>
- Save button preserves the current publish status determined by active tab
- Publish button still forces status to published
- No regression in branch edit functionality
- Lint passes
</success_criteria>

<output>
After completion, create `.planning/quick/4-fix-branch-edit-save-button-to-preserve-/4-01-SUMMARY.md`
</output>
