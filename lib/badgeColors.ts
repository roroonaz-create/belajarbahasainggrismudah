// Tailwind only emits classes that appear verbatim in scanned files,
// so badge colors must be full literal class strings, not interpolations.

export const badgeColors: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  purple: 'bg-purple-100 text-purple-800',
  orange: 'bg-orange-100 text-orange-800',
  red: 'bg-red-100 text-red-800',
  teal: 'bg-teal-100 text-teal-800',
  pink: 'bg-pink-100 text-pink-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  gray: 'bg-gray-100 text-gray-800',
}

export const solidBadgeColors: Record<string, string> = {
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  purple: 'bg-purple-500 text-white',
  orange: 'bg-orange-500 text-white',
  red: 'bg-red-500 text-white',
  teal: 'bg-teal-500 text-white',
  pink: 'bg-pink-500 text-white',
  indigo: 'bg-indigo-500 text-white',
  yellow: 'bg-yellow-500 text-white',
  gray: 'bg-gray-500 text-white',
}

export function getBadgeClasses(color?: string | null): string {
  return badgeColors[color || 'gray'] || badgeColors.gray
}

export function getSolidBadgeClasses(color?: string | null): string {
  return solidBadgeColors[color || 'gray'] || solidBadgeColors.gray
}
