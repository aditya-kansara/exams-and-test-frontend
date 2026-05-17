import { supabase } from '@/lib/supabase'

export type ItemMediaAsset = {
  storage_key: string
  display_order: string
}

export type ParsedMediaId = {
  block: 'question' | 'explanation'
  slot: 'M' | 'A' | 'B' | 'C' | 'D' | 'E'
  index: number
}

export type ResolvedMedia = ItemMediaAsset & {
  url: string
}

export type SlotMediaMap = Record<'A' | 'B' | 'C' | 'D' | 'E', ResolvedMedia[]>

export type GroupedMedia = {
  question: {
    main: ResolvedMedia[]
    options: SlotMediaMap
  }
  explanation: {
    main: ResolvedMedia[]
    options: SlotMediaMap
  }
}

const MEDIA_ID_PATTERN = /^(QM|QA|QB|QC|QD|QE|EM|EA|EB|EC|ED|EE)(\d+)$/i

const QUESTION_PREFIX: Record<string, ParsedMediaId['slot'] | 'M'> = {
  QM: 'M',
  QA: 'A',
  QB: 'B',
  QC: 'C',
  QD: 'D',
  QE: 'E',
}

const EXPLANATION_PREFIX: Record<string, ParsedMediaId['slot'] | 'M'> = {
  EM: 'M',
  EA: 'A',
  EB: 'B',
  EC: 'C',
  ED: 'D',
  EE: 'E',
}

function emptySlotMap(): SlotMediaMap {
  return { A: [], B: [], C: [], D: [], E: [] }
}

export function getItemMediaBucket(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ITEM_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    'item-bucket'
  )
}

export function parseMediaId(displayOrder: string): ParsedMediaId | null {
  const normalized = displayOrder.trim().toUpperCase()
  const match = normalized.match(MEDIA_ID_PATTERN)
  if (!match) return null

  const prefix = match[1]
  const index = parseInt(match[2], 10)
  if (!Number.isFinite(index) || index < 1) return null

  if (prefix.startsWith('Q')) {
    const slot = QUESTION_PREFIX[prefix]
    if (!slot) return null
    return { block: 'question', slot, index }
  }

  const slot = EXPLANATION_PREFIX[prefix]
  if (!slot) return null
  return { block: 'explanation', slot, index }
}

export function buildPublicMediaUrl(storageKey: string): string | null {
  if (!storageKey?.trim()) return null
  try {
    const bucket = getItemMediaBucket()
    const { data } = supabase.storage.from(bucket).getPublicUrl(storageKey)
    return data?.publicUrl ?? null
  } catch {
    return null
  }
}

function sortByMediaIndex(a: ResolvedMedia, b: ResolvedMedia): number {
  const pa = parseMediaId(a.display_order)
  const pb = parseMediaId(b.display_order)
  return (pa?.index ?? 0) - (pb?.index ?? 0)
}

/** Group media by question/explanation block and slot; resolve Supabase public URLs. */
export function groupAndResolveMedia(media: ItemMediaAsset[] | undefined): GroupedMedia {
  const result: GroupedMedia = {
    question: { main: [], options: emptySlotMap() },
    explanation: { main: [], options: emptySlotMap() },
  }

  if (!media?.length) return result

  for (const asset of media) {
    const parsed = parseMediaId(asset.display_order)
    if (!parsed) continue

    const url = buildPublicMediaUrl(asset.storage_key)
    if (!url) continue

    const resolved: ResolvedMedia = { ...asset, display_order: asset.display_order.trim(), url }
    const target = parsed.block === 'question' ? result.question : result.explanation

    if (parsed.slot === 'M') {
      target.main.push(resolved)
    } else {
      target.options[parsed.slot].push(resolved)
    }
  }

  result.question.main.sort(sortByMediaIndex)
  result.explanation.main.sort(sortByMediaIndex)
  for (const slot of ['A', 'B', 'C', 'D', 'E'] as const) {
    result.question.options[slot].sort(sortByMediaIndex)
    result.explanation.options[slot].sort(sortByMediaIndex)
  }

  return result
}

/** Option index 1–5 (A–E) → resolved image URLs for exam QuestionCard. */
export function getExamOptionImageUrls(media: ItemMediaAsset[] | undefined): Record<number, string[]> {
  const grouped = groupAndResolveMedia(media)
  const urls: Record<number, string[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] }
  const slotToIndex = { A: 1, B: 2, C: 3, D: 4, E: 5 } as const
  for (const slot of ['A', 'B', 'C', 'D', 'E'] as const) {
    urls[slotToIndex[slot]] = grouped.question.options[slot].map((m) => m.url)
  }
  return urls
}

export function getExamQuestionImageUrls(media: ItemMediaAsset[] | undefined): string[] {
  return groupAndResolveMedia(media).question.main.map((m) => m.url)
}

const EXPLANATION_SLOT_ORDER: Array<'M' | 'A' | 'B' | 'C' | 'D' | 'E'> = [
  'M',
  'A',
  'B',
  'C',
  'D',
  'E',
]

/** All explanation images (EM*, EA*–EE*) in display order with URLs. */
export function getLabeledExplanationMedia(
  media: ItemMediaAsset[] | undefined,
): ResolvedMedia[] {
  const grouped = groupAndResolveMedia(media)
  const items: ResolvedMedia[] = []

  for (const slot of EXPLANATION_SLOT_ORDER) {
    if (slot === 'M') {
      items.push(...grouped.explanation.main)
    } else {
      items.push(...grouped.explanation.options[slot])
    }
  }

  return items
}
