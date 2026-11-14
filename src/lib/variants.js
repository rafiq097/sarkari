/**
 * Stream variants of an exam profile (for example SEBI Grade A: General, IT, Legal).
 * A profile's `variants` array holds, per stream, only the fields that differ; every
 * other field is shared. These helpers merge one variant over the shared fields.
 * Plain JavaScript, so the data build script (scripts/build-data.mjs) uses the same
 * merge as the pages (exam page, eligibility checker, syllabus overlap).
 */

/** Fields a variant may override. Anything else must stay in the shared profile. */
export const variantOverrideKeys = ['eligibility', 'eligibilityRules', 'posts', 'selection', 'syllabus', 'syllabusTags', 'pattern']

/** True for a plain object (not an array, not null). */
function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Merges a variant value over the shared value. Objects merge key by key, at any depth,
 * so a variant can change one nested value (for example eligibility.education.summary).
 * Arrays and plain values are replaced whole: a variant's post list is its full list.
 */
function mergeOverride(sharedValue, variantValue) {
  if (!isPlainObject(sharedValue) || !isPlainObject(variantValue)) return variantValue
  const merged = { ...sharedValue }
  for (const [key, value] of Object.entries(variantValue)) merged[key] = mergeOverride(sharedValue[key], value)
  return merged
}

/** The variant with the given id, or the first variant, or null when the profile has none. */
export function pickVariant(exam, variantId) {
  const variants = exam.variants ?? []
  return variants.find((variant) => variant.id === variantId) ?? variants[0] ?? null
}

/**
 * The profile as seen for one variant: shared fields with that variant's overrides
 * merged in, plus `activeVariant` ({ id, name }). Profiles without variants are
 * returned unchanged. An unknown or missing id falls back to the first variant.
 */
export function applyVariant(exam, variantId) {
  const variant = pickVariant(exam, variantId)
  if (!variant) return exam
  const merged = { ...exam, activeVariant: { id: variant.id, name: variant.name } }
  for (const key of variantOverrideKeys) {
    if (variant[key] !== undefined) merged[key] = mergeOverride(exam[key], variant[key])
  }
  return merged
}
