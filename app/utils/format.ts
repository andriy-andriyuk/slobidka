/** Українська множина: 1 подія, 2 події, 5 подій. */
export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

export function pluralize(n: number, one: string, few: string, many: string) {
  return `${n} ${plural(n, one, few, many)}`
}

/** Розмір файлу у звичних одиницях. */
export function fileSize(bytes: number | null | undefined) {
  if (!bytes) return ''
  const mb = bytes / 1024 / 1024
  if (mb < 1) return `${Math.round(bytes / 1024)} КБ`
  return `${mb.toFixed(mb < 10 ? 1 : 0).replace('.', ',')} МБ`
}
