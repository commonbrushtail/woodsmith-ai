import { getCategory } from '@/lib/actions/categories'
import ProductTypeEditClient from './ProductTypeEditClient'

export default async function ProductTypeEditPage({ params }) {
  const { id } = await params

  const { data: category } = await getCategory(id)

  if (!category) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#6b7280]">
          ไม่พบประเภทสินค้านี้
        </p>
      </div>
    )
  }

  return <ProductTypeEditClient category={category} />
}
