/** Перемикач світлої/темної теми зі збереженням вибору. */
export function useTheme() {
  const theme = useState<'light' | 'dark'>('theme', () => 'light')

  function apply(next: 'light' | 'dark') {
    theme.value = next
    if (import.meta.client) {
      document.documentElement.dataset.theme = next
      try { localStorage.setItem('slobidka-theme', next) } catch { /* приватний режим */ }
    }
  }

  function toggle() {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => {
    // тему вже виставив інлайн-скрипт у <head> — просто синхронізуємо стан
    const current = document.documentElement.dataset.theme as 'light' | 'dark' | undefined
    if (current) { theme.value = current; return }

    let saved: string | null = null
    try { saved = localStorage.getItem('slobidka-theme') } catch { /* приватний режим */ }
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    apply((saved as 'light' | 'dark') || system)
  })

  return { theme, toggle }
}
