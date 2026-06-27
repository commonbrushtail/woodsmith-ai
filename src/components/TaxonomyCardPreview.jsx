/**
 * Lightweight preview of how a category / product-type appears as a card in
 * the product listing. Taxonomy pages are composite (they also list products),
 * so this card is the representative single-item live preview.
 *
 * @param {{ name?: string, imageUrl?: string|null, typeLabel?: string }} props
 */
export default function TaxonomyCardPreview({ name, imageUrl, typeLabel }) {
  return (
    <div className="flex justify-center p-[32px]">
      <div className="w-[280px]">
        <div className="relative w-full aspect-square overflow-hidden rounded-[12px] bg-[#e8e3da]">
          {imageUrl && (
            <img src={imageUrl} alt={name || ''} className="absolute inset-0 size-full object-cover" />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-[16px]">
            <p className="m-0 font-['IBM_Plex_Sans_Thai'] font-semibold text-[18px] text-white">
              {name || 'ชื่อหมวดหมู่'}
            </p>
          </div>
        </div>
        {typeLabel && (
          <p className="mt-[8px] text-center font-['IBM_Plex_Sans_Thai'] text-[13px] text-[#6b7280]">
            {typeLabel}
          </p>
        )}
      </div>
    </div>
  )
}
