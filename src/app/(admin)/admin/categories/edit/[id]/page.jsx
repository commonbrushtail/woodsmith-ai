import { getCategory, getCategories } from '@/lib/actions/categories'
import CategoryEditClient from './CategoryEditClient'

export default async function CategoryEditPage({ params }) {
  const { id } = await params

  const [categoryRes, categoriesRes] = await Promise.all([
    getCategory(id),
    getCategories(),
  ])

  if (!categoryRes.data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="font-['IBM_Plex_Sans_Thai'] text-[16px] text-[#6b7280]">
          ไม่พบหมวดหมู่สินค้านี้
        </p>
      </div>
    )
  }

  // Only top-level categories as parent options
  const parentCategories = (categoriesRes.data || []).filter(c => !c.parent_id)

  return (
    <CategoryEditClient
      category={categoryRes.data}
      parentCategories={parentCategories}
    />
  )
}
