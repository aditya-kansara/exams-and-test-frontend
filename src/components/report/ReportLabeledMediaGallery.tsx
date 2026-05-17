import type { ResolvedMedia } from '@/lib/mediaSlots'

interface ReportLabeledMediaGalleryProps {
  items: ResolvedMedia[]
  imageClassName?: string
}

export function ReportLabeledMediaGallery({
  items,
  imageClassName = 'w-full max-h-64 object-contain rounded border border-gray-200 bg-white',
}: ReportLabeledMediaGalleryProps) {
  if (!items.length) return null

  return (
    <div className="mt-4 flex flex-col gap-4">
      {items.map((item) => (
        <figure key={`${item.display_order}-${item.storage_key}`}>
          <figcaption className="text-xs font-semibold text-[#1c90a6] uppercase tracking-wide mb-1.5">
            {item.display_order}
          </figcaption>
          <img
            src={item.url}
            alt={`Explanation ${item.display_order}`}
            className={imageClassName}
          />
        </figure>
      ))}
    </div>
  )
}
