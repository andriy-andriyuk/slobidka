<script setup lang="ts">
import site from '~/data/site.json'

const { theme, toggle } = useTheme()
const open = ref(false)
const route = useRoute()

const nav = [
  { to: '/', label: 'Хронологія' },
  { to: '/crime-story-details/', label: 'Детальна історія' },
  { to: '/злочин-микільсько-слобідська-7-9/', label: 'Слобідська 7–9' },
  { to: '/laws-that-have-been-violated/', label: 'Порушені закони' },
  { to: '/materials/', label: 'Матеріали' },
  { to: '/print-and-share/', label: 'Роздрукуй' },
]

watch(() => route.fullPath, () => { open.value = false })

const scrolled = ref(false)
function onScroll() { scrolled.value = window.scrollY > 8 }
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

function isActive(to: string) {
  const p = decodeURIComponent(route.path)
  return to === '/' ? p === '/' : p.startsWith(to.replace(/\/$/, ''))
}
</script>

<template>
  <header class="hdr no-print" :class="{ 'hdr--scrolled': scrolled }">
    <div class="wrap hdr__bar">
      <NuxtLink to="/" class="brand" @click="open = false">
        <span class="brand__mark" aria-hidden="true">
          <svg viewBox="0 0 32 32">
            <rect width="32" height="32" rx="8" fill="var(--ink)" />
            <g fill="#3fa06a">
              <path d="M16 5.5 24 17h-4.6l3.4 5.2H9.2L12.6 17H8Z" />
              <rect x="14.6" y="21" width="2.8" height="6" rx="1.2" />
            </g>
          </svg>
        </span>
        <span class="brand__text">
          <b>Микільсько-Слобідська</b>
          <i>.info</i>
        </span>
      </NuxtLink>

      <nav class="nav" :class="{ 'nav--open': open }" aria-label="Головне меню">
        <NuxtLink
          v-for="item in nav" :key="item.to" :to="item.to"
          class="nav__link" :class="{ 'nav__link--on': isActive(item.to) }">
          {{ item.label }}
        </NuxtLink>
        <NuxtLink to="/долучитися/" class="btn btn--primary nav__cta">Долучитися</NuxtLink>
      </nav>

      <div class="hdr__tools">
        <button class="icon-btn" :aria-label="theme === 'dark' ? 'Світла тема' : 'Темна тема'" @click="toggle">
          <Ico :name="theme === 'dark' ? 'sun' : 'moon'" />
        </button>
        <button
          class="icon-btn icon-btn--menu" :aria-expanded="open" aria-label="Меню"
          @click="open = !open">
          <Ico :name="open ? 'x' : 'menu'" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hdr {
  position: sticky;
  top: 0;
  z-index: 100;
  background: color-mix(in srgb, var(--paper) 86%, transparent);
  backdrop-filter: blur(14px) saturate(1.4);
  border-bottom: 1px solid transparent;
  transition: border-color .2s, background-color .2s;
}
.hdr--scrolled { border-bottom-color: var(--line); }

.hdr__bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 4.25rem;
}

/* --------------------------------------------------------------- логотип */
.brand {
  display: inline-flex;
  align-items: center;
  gap: .6rem;
  text-decoration: none;
  flex: none;
  margin-inline-end: auto;
}
.brand__mark { width: 2rem; height: 2rem; }
.brand__mark svg { width: 100%; height: 100%; }
.brand__text {
  font-family: var(--font-ui);
  font-size: .98rem;
  letter-spacing: -.02em;
  line-height: 1.1;
}
.brand__text b { font-weight: 700; }
.brand__text i { font-style: normal; color: var(--accent); font-weight: 600; }

@media (max-width: 26rem) {
  .brand__text b { font-size: .88rem; }
}

/* ------------------------------------------------------------------ меню */
.nav { display: flex; align-items: center; gap: .15rem; }

.nav__link {
  padding: .5rem .7rem;
  border-radius: 100px;
  font-family: var(--font-ui);
  font-size: .9rem;
  font-weight: 600;
  color: var(--ink-2);
  text-decoration: none;
  white-space: nowrap;
  transition: color .16s, background-color .16s;
}
.nav__link:hover { color: var(--ink); background: var(--paper-3); }
.nav__link--on { color: var(--accent); background: var(--accent-sub); }

.nav__cta { margin-inline-start: .5rem; padding: .55rem 1rem; font-size: .9rem; }

/* ------------------------------------------------------------- інструменти */
.hdr__tools { display: flex; align-items: center; gap: .25rem; flex: none; }

.icon-btn {
  display: grid;
  place-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 100px;
  color: var(--ink-2);
  transition: background-color .16s, color .16s;
}
.icon-btn:hover { background: var(--paper-3); color: var(--ink); }
.icon-btn--menu { display: none; }

/* ------------------------------------------------------------- мобільне */
@media (max-width: 68rem) {
  .icon-btn--menu { display: grid; }

  .nav {
    position: absolute;
    inset: 100% 0 auto;
    flex-direction: column;
    align-items: stretch;
    gap: .1rem;
    padding: .75rem clamp(1rem, 4vw, 2.5rem) 1.25rem;
    background: var(--paper);
    border-bottom: 1px solid var(--line);
    box-shadow: var(--shadow-lg);
    display: none;
  }
  .nav--open { display: flex; }

  .nav__link { padding: .75rem .8rem; font-size: 1rem; }
  .nav__cta { margin: .5rem 0 0; justify-content: center; }
}
</style>
