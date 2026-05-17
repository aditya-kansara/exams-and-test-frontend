interface ReportMediaGalleryProps {
  urls: string[]
  alt: string
  /** row = wrap in a row (report question/explanation); stack = full-width column (exam options) */
  layout?: 'row' | 'stack'
  className?: string
  imageClassName?: string
}

const LAYOUT_CLASS = {
  row: 'flex flex-wrap gap-3 my-3',
  stack: 'flex flex-col gap-3 mt-4 w-full',
} as const

const IMAGE_CLASS = {
  row: 'max-h-72 max-w-full object-contain rounded-md border border-gray-200 bg-white',
  stack: 'w-full max-h-48 object-contain rounded-md border border-gray-200 bg-white',
} as const

export function ReportMediaGallery({
  urls,
  alt,
  layout = 'row',
  className,
  imageClassName,
}: ReportMediaGalleryProps) {
  if (!urls.length) return null

  const containerClass = className ?? LAYOUT_CLASS[layout]
  const imgClass = imageClassName ?? IMAGE_CLASS[layout]

  return (
    <div className={containerClass}>
      {urls.map((url, index) => (
        <img
          key={`${url}-${index}`}
          src={url}
          alt={`${alt}${urls.length > 1 ? ` ${index + 1}` : ''}`}
          className={imgClass}
        />
      ))}
    </div>
  )
}
