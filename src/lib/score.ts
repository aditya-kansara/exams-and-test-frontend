const MIN_THETA = -3
const MAX_THETA = 3
const MAX_SCALED_SCORE = 500

export const normalizeThetaToScaledScore = (theta: number | null | undefined): number => {
  if (typeof theta !== 'number' || !isFinite(theta)) return 0
  const clamped = Math.max(MIN_THETA, Math.min(MAX_THETA, theta))
  const normalized = ((clamped - MIN_THETA) / (MAX_THETA - MIN_THETA)) * MAX_SCALED_SCORE
  return Math.round(normalized)
}
