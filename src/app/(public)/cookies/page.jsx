import { getLegalPage } from '@/lib/data/public'
import LegalContentView, { LEGAL_TITLES } from '@/components/LegalContentView'

export const metadata = {
  title: 'นโยบายคุกกี้ | WoodSmith',
}

export default async function CookiePolicyPage() {
  const { data } = await getLegalPage('cookies')

  return (
    <LegalContentView title={LEGAL_TITLES.cookies} content={data?.content} updatedAt={data?.updated_at} />
  )
}
