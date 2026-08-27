<script setup lang="ts">
import laws from '~/data/laws.json'

const active = ref<string | null>(null)

/** У WP лишилася точна копія однієї статті — у переліку показуємо оригінал. */
const listed = laws.items.filter((l) => !l.duplicateOf)

const groups = computed(() =>
  laws.categories
    .filter((c) => c.count > 0 && (!active.value || c.key === active.value))
    .map((c) => ({ ...c, items: listed.filter((l) => l.category === c.key) })))

useHead({ title: 'Порушені закони' })
useSeoMeta({
  description: `${listed.length} норм законодавства України, порушених під час захоплення та забудови берега Дніпра на Микільській Слобідці: Конституція, Водний і Земельний кодекси, охорона культурної спадщини та довкілля, кримінальні статті.`,
})
</script>

<template>
  <PageHero
    eyebrow="Правова частина"
    title="Порушені закони"
    lead="Перелік норм, порушених під час зміни цільового призначення, продажу та забудови берега. Кожну статтю наведено в тому обсязі, в якому вона стосується справи."
    :meta="[
      pluralize(listed.length, 'стаття', 'статті', 'статей'),
      pluralize(laws.categories.filter(c => c.count).length, 'кодекс і закон', 'кодекси і закони', 'кодексів і законів'),
    ]" />

  <!-- ------------------------------------------------------------ фільтр -->
  <nav class="filter no-print" aria-label="Фільтр за законом">
    <div class="wrap filter__inner">
      <button
        class="chip" :class="{ 'chip--on': !active }"
        @click="active = null">
        Усі <span class="chip__n">{{ listed.length }}</span>
      </button>
      <button
        v-for="c in laws.categories.filter(c => c.count)" :key="c.key"
        class="chip" :class="{ 'chip--on': active === c.key }"
        :style="{ '--cat': c.color }"
        @click="active = active === c.key ? null : c.key">
        <span class="chip__swatch" />
        {{ c.title }} <span class="chip__n">{{ c.count }}</span>
      </button>
    </div>
  </nav>

  <!-- ------------------------------------------------------------ список -->
  <section class="section">
    <div class="wrap">
      <div v-for="g in groups" :key="g.key" class="grp" :style="{ '--cat': g.color }">
        <header class="grp__head">
          <span class="grp__icon"><Ico :name="g.icon" /></span>
          <div>
            <h2 class="h3 grp__title">{{ g.full }}</h2>
            <p class="grp__count eyebrow">{{ pluralize(g.count, 'стаття', 'статті', 'статей') }}</p>
          </div>
        </header>

        <ul class="grp__list">
          <li v-for="l in g.items" :key="l.slug">
            <details class="law">
              <summary class="law__summary">
                <span class="law__head">
                  <span class="law__title">{{ l.title }}</span>
                  <span class="law__excerpt">{{ l.excerpt }}</span>
                </span>
                <Ico name="chevron-down" :size="18" class="law__chev" />
              </summary>
              <div class="law__body">
                <ProseBlock :html="l.html" />
                <NuxtLink :to="l.path" class="law__perma no-print">
                  <Ico name="link" :size="15" /> Окрема сторінка статті
                </NuxtLink>
              </div>
            </details>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ------------------------------------------------------------------ чипи */
.filter {
  position: sticky;
  top: 4.25rem;
  z-index: 50;
  background: color-mix(in srgb, var(--paper) 90%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}

.filter__inner {
  display: flex;
  gap: .4rem;
  overflow-x: auto;
  scrollbar-width: none;
  padding-block: .75rem;
}
.filter__inner::-webkit-scrollbar { display: none; }

.chip {
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  flex: none;
  padding: .45rem .85rem;
  border: 1px solid var(--line);
  border-radius: 100px;
  font-family: var(--font-ui);
  font-size: .85rem;
  font-weight: 600;
  color: var(--ink-2);
  white-space: nowrap;
  transition: border-color .16s, color .16s, background-color .16s;
}
.chip:hover { color: var(--ink); border-color: var(--ink-3); }
.chip--on { color: var(--ink); border-color: var(--ink); background: var(--paper-2); }

.chip__swatch {
  width: .6rem; height: .6rem; border-radius: 3px;
  background: var(--cat, var(--accent));
}

.chip__n { color: var(--ink-3); font-family: var(--font-mono); font-size: .78rem; }

/* --------------------------------------------------------------- групи */
.grp { margin-bottom: clamp(2.5rem, 5vw, 4rem); }
.grp:last-child { margin-bottom: 0; }

.grp__head {
  display: flex;
  align-items: center;
  gap: .9rem;
  padding-bottom: 1rem;
  margin-bottom: .5rem;
  border-bottom: 2px solid var(--cat);
}

.grp__icon {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  flex: none;
  border-radius: var(--r-sm);
  background: var(--cat);
  color: #15171c;
}

.grp__title { letter-spacing: -.015em; text-transform: none; }
.grp__count { margin-top: .2rem; }

.grp__list { list-style: none; padding: 0; }

/* -------------------------------------------------------------- стаття */
.law { border-bottom: 1px solid var(--line); }

.law__summary {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.05rem .25rem;
  cursor: pointer;
  list-style: none;
  transition: color .16s;
}
.law__summary::-webkit-details-marker { display: none; }
.law__summary:hover { color: var(--accent); }

.law__head { flex: 1; display: flex; flex-direction: column; gap: .3rem; min-width: 0; }

.law__excerpt {
  font-size: .88rem;
  line-height: 1.5;
  color: var(--ink-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.law[open] .law__excerpt { display: none; }

.law__title {
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.4;
  letter-spacing: -.01em;
  text-wrap: pretty;
}

.law__chev { color: var(--ink-3); flex: none; transition: transform .2s; }
.law[open] .law__chev { transform: rotate(180deg); }
.law[open] .law__summary { color: var(--accent); }

.law__body {
  padding: .25rem 0 1.75rem;
  border-inline-start: 2px solid var(--cat);
  padding-inline-start: 1.15rem;
  margin-bottom: .5rem;
  font-size: 1rem;
}

.law__perma {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  margin-top: 1.25rem;
  font-family: var(--font-ui);
  font-size: .85rem;
  font-weight: 600;
  color: var(--ink-3);
  text-decoration: none;
}
.law__perma:hover { color: var(--accent); }

@media print {
  .law__body { display: block !important; }
}
</style>
