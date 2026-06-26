import { getLegalPage } from '@/lib/data/public'
import LegalContentView, { LEGAL_TITLES } from '@/components/LegalContentView'

export const metadata = {
  title: 'นโยบายความเป็นส่วนตัว | WoodSmith',
}

export default async function PrivacyPolicyPage() {
  const { data } = await getLegalPage('privacy')

  return (
    <LegalContentView title={LEGAL_TITLES.privacy} content={data?.content} updatedAt={data?.updated_at} />
  )
}
