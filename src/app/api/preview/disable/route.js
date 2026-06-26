import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { isInternalPath } from '@/lib/preview/internal-path'

// Exit Draft Mode and return to the page the admin was viewing.
// No auth gate needed: disabling preview only ever removes access.
export async function GET(request) {
  const draft = await draftMode()
  draft.disable()

  const back = new URL(request.url).searchParams.get('path') || '/'
  redirect(isInternalPath(back) ? back : '/')
}
