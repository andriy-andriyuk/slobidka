<script setup lang="ts">
const props = defineProps<{ years: string[] }>()

const active = ref(props.years[0] ?? '')

let observer: IntersectionObserver | null = null

onMounted(() => {
  const targets = props.years
    .map((y) => document.getElementById(`year-${y}`))
    .filter((el): el is HTMLElement => !!el)

  observer = new IntersectionObserver(
    (entries) => {
      const hit = entries.filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (hit) active.value = hit.target.id.replace('year-', '')
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
  )
  targets.forEach((t) => observer!.observe(t))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <nav class="yn no-print" aria-label="Роки">
    <div class="wrap yn__inner">
      <span class="yn__label eyebrow">Роки</span>
      <div class="yn__scroll">
        <a
          v-for="y in years" :key="y" :href="`#year-${y}`"
          class="yn__chip" :class="{ 'yn__chip--on': active === y }">{{ y }}</a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.yn {
  position: sticky;
  top: 4.25rem;
  z-index: 50;
  background: color-mix(in srgb, var(--paper) 90%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}

.yn__inner { display: flex; align-items: center; gap: 1rem; min-height: 3.25rem; }

.yn__label { flex: none; }
@media (max-width: 40rem) { .yn__label { display: none; } }

.yn__scroll {
  display: flex;
  gap: .25rem;
  overflow-x: auto;
  scrollbar-width: none;
  padding-block: .5rem;
  mask-image: linear-gradient(90deg, transparent, #000 .75rem, #000 calc(100% - .75rem), transparent);
}
.yn__scroll::-webkit-scrollbar { display: none; }

.yn__chip {
  flex: none;
  padding: .3rem .7rem;
  border-radius: 100px;
  font-family: var(--font-mono);
  font-size: .8rem;
  font-weight: 500;
  color: var(--ink-2);
  text-decoration: none;
  transition: background-color .16s, color .16s;
}
.yn__chip:hover { background: var(--paper-3); color: var(--ink); }
.yn__chip--on { background: var(--accent); color: var(--accent-ink); }
</style>
