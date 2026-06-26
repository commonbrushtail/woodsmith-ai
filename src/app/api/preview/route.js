import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/require-admin'
import { isInternalPath } from '@/lib/preview/internal-path'

// Enable Next.js Draft Mode, then redirect to an internal public path so the
// admin sees unpublished/draft content rendered on the real page.
//
// This is the ONLY place Draft Mode is turned on, and it is gated by
// requireAdmin(). Middleware skips /api/*, so this handler's own auth check
// is the enforcement point. The data layer (getReadClient) re-checks admin at
// read time, so the bypass cookie alone never exposes drafts.
export async function GET(request) {
  const { user } = await requireAdmin()
  if (!user) return new Response('Forbidden', { status: 403 })

  const path = new URL(request.url).searchParams.get('path') || '/'
  if (!isInternalPath(path)) return new Response('Invalid path', { status: 400 })

  const draft = await draftMode()
  draft.enable()

  redirect(path)
}
