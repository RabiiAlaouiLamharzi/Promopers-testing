import { translations } from '@/lib/translations'

const ABOUT_PAGE_PREFIX = 'aboutPage.'

function stripAboutPagePrefix(s: string): string {
  if (!s || typeof s !== 'string') return s
  return s.replace(/^\s*aboutPage\./i, '').trim()
}

/**
 * Returns the display label for a team role.
 * - Never returns a string starting with "aboutPage." (strips it if present).
 * - If roleKey contains a space (after stripping), it's free text → return as-is.
 * - Otherwise try t(`aboutPage.${roleKey}`); if that returns a key or empty, use default translations.
 */
export function getRoleDisplayLabel(
  roleKey: string,
  t: (key: string) => string,
  language: string
): string {
  if (!roleKey) return ''
  const key = stripAboutPagePrefix(roleKey)
  if (key.includes(' ')) return key
  const translated = t(`aboutPage.${key}`)
  const cleanTranslated = stripAboutPagePrefix(translated)
  if (cleanTranslated && cleanTranslated !== key) return cleanTranslated
  const fallback = (translations as Record<string, { aboutPage?: Record<string, string> }>)[language]?.aboutPage?.[key]
  const result = typeof fallback === 'string' ? fallback : key
  return stripAboutPagePrefix(result)
}
