import { getLegalPage } from '@/lib/data/public'
import LegalContentView, { LEGAL_TITLES } from '@/components/LegalContentView'

export const metadata = {
  title: 'ข้อกำหนดและเงื่อนไขการใช้งาน | WoodSmith',
}

export default async function TermsPage() {
  const { data } = await getLegalPage('terms')

  return (
    <LegalContentView title={LEGAL_TITLES.terms} content={data?.content} updatedAt={data?.updated_at} />
  )
}
