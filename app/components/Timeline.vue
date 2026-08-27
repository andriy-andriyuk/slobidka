<script setup lang="ts">
interface TlEvent {
  n: number
  year: string
  date: string
  title: string
  icon: string
  href: string | null
  external: boolean
  page: string | null
  hasPage: boolean
  iso: string | null
  video: { id: string; url: string; thumb: string | null } | null
  html: string
}

const props = defineProps<{ events: TlEvent[]; compact?: boolean }>()

/** Групуємо події за роками, зберігаючи порядок стрічки. */
const groups = computed(() => {
  const out: { year: string; items: TlEvent[] }[] = []
  for (const e of props.events) {
    const last = out.at(-1)
    if (last && last.year === e.year) last.items.push(e)
    else out.push({ year: e.year, items: [e] })
  }
  return out
})

/** Зовнішнє посилання показуємо лише тоді, коли власної сторінки події немає. */
function outward(e: TlEvent) {
  return !e.page && e.href ? e.href : null
}
</script>

<template>
  <div class="tl">
    <template v-for="g in groups" :key="g.year">
      <div :id="`year-${g.year}`" class="tl__year">
        <span class="tl__year-num">{{ g.year }}</span>
        <span class="tl__year-rule" />
        <span class="tl__year-count">{{ pluralize(g.items.length, 'подія', 'події', 'подій') }}</span>
      </div>

      <article v-for="e in g.items" :key="e.n" class="tl__item">
        <time v-if="e.iso" class="tl__date" :datetime="e.iso">{{ e.date }}</time>
        <div v-else class="tl__date">{{ e.date }}</div>

        <div class="tl__node" aria-hidden="true">
          <span class="tl__dot"><Ico :name="e.icon" :size="16" /></span>
        </div>

        <div class="tl__body">
          <h3 class="tl__title h3">
            <NuxtLink v-if="e.page" :to="e.page">{{ e.title }}</NuxtLink>
            <a v-else-if="outward(e)" :href="outward(e)!" target="_blank" rel="noopener noreferrer">
              {{ e.title }}<Ico name="external-link" :size="15" class="tl__ext" />
            </a>
            <span v-else>{{ e.title }}</span>
          </h3>

          <time v-if="e.iso" class="tl__date tl__date--inline" :datetime="e.iso">{{ e.date }}</time>
          <div v-else class="tl__date tl__date--inline">{{ e.date }}</div>

          <div v-if="e.html" class="tl__prose">
            <ProseBlock :html="e.html" />
          </div>

          <VideoEmbed v-if="e.video" :video="e.video" :title="e.title" />

          <NuxtLink v-if="e.page" :to="e.page" class="tl__more">
            Повна довідка про подію
            <Ico name="arrow-right" :size="16" />
          </NuxtLink>
        </div>
      </article>
    </template>
  </div>
</template>

<style scoped>
.tl {
  --gutter: 0rem;      /* колонка з датою (лише на широких екранах) */
  --node: 2.75rem;     /* колонка з вузлом */
  position: relative;
}

/* неперервна вертикальна лінія — «хребет» розслідування */
.tl::before {
  content: '';
  position: absolute;
  top: 1.5rem;
  bottom: 3rem;
  left: calc(var(--gutter) + var(--node) / 2);
  width: 2px;
  background: linear-gradient(
    to bottom,
    transparent,
    var(--line) 2rem,
    var(--line) calc(100% - 6rem),
    transparent
  );
}

/* ------------------------------------------------------------------- рік */
.tl__year {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: clamp(2.5rem, 5vw, 4rem) 0 1.75rem;
  padding-left: calc(var(--gutter) + var(--node) + .75rem);
}
.tl__year:first-child { margin-top: 0; }

.tl__year-num {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.75rem, 4.5vw, 2.6rem);
  letter-spacing: -.04em;
  line-height: 1;
  color: var(--ink);
}

.tl__year-rule { flex: 1; height: 1px; background: var(--line); }

.tl__year-count {
  font-family: var(--font-mono);
  font-size: .72rem;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--ink-3);
  white-space: nowrap;
}

/* маскуємо лінію під позначкою року */
.tl__year::before {
  content: '';
  position: absolute;
  left: calc(var(--gutter) + var(--node) / 2 - 5px);
  top: -.75rem;
  bottom: -.75rem;
  width: 12px;
  background: var(--paper);
}

/* ----------------------------------------------------------------- подія */
.tl__item {
  position: relative;
  display: grid;
  grid-template-columns: var(--node) minmax(0, 1fr);
  gap: 0 .75rem;
  padding-bottom: clamp(2rem, 4vw, 3rem);
}

.tl__date {
  display: none;
  font-family: var(--font-mono);
  font-size: .78rem;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--ink-3);
  padding-top: .8rem;
  text-align: right;
  padding-right: .25rem;
}

.tl__date--inline {
  display: block;
  text-align: start;
  padding: 0;
  margin-top: .4rem;
  margin-bottom: 0;
}

.tl__node { display: grid; place-items: start center; padding-top: .35rem; }

.tl__dot {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 100px;
  background: var(--paper-2);
  border: 1px solid var(--line);
  color: var(--accent);
  box-shadow: 0 0 0 5px var(--paper);
  transition: border-color .2s, color .2s, transform .2s;
}

.tl__item:hover .tl__dot {
  border-color: var(--accent);
  transform: scale(1.06);
}

.tl__body { min-width: 0; padding-top: .1rem; }

.tl__title { line-height: 1.35; letter-spacing: -.015em; }
.tl__title a { text-decoration: none; }
.tl__title a:hover { color: var(--accent); }

.tl__ext {
  display: inline-block;
  vertical-align: -.1em;
  margin-inline-start: .35em;
  color: var(--ink-3);
}

.tl__prose { margin-top: .75rem; font-size: 1rem; }
.tl__prose :deep(img) { max-height: 32rem; object-fit: contain; }

.tl__more {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  margin-top: 1.15rem;
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: .9rem;
  color: var(--accent);
  text-decoration: none;
}
.tl__more:hover { gap: .65rem; }
.tl__more .ico { transition: transform .18s; }

/* ------------------------------------------------------ широкі екрани */
@media (min-width: 60rem) {
  .tl { --gutter: 8.5rem; }

  .tl__item { grid-template-columns: var(--gutter) var(--node) minmax(0, 1fr); }

  .tl__date { display: block; }
  .tl__date--inline { display: none; }

  .tl__body { padding-top: .55rem; }
}
</style>
