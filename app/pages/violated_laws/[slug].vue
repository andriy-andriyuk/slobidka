<script setup lang="ts">
import laws from '~/data/laws.json'

const route = useRoute()
const slug = computed(() => decodeURIComponent(String(route.params.slug)))

const law = computed(() => laws.items.find((l) => l.slug === slug.value))

if (!law.value) {
  throw createError({ statusCode: 404, statusMessage: 'Статтю не знайдено', fatal: true })
}

const cat = computed(() => laws.categories.find((c) => c.key === law.value!.category))

const related = computed(() =>
  laws.items
    .filter((l) => l.category === law.value!.category && l.slug !== law.value!.slug && !l.duplicateOf)
    .slice(0, 6))

useHead({ title: () => law.value!.title })
useSeoMeta({
  description: () => `${cat.value?.full ?? ''}. ${law.value!.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)}`,
})
</script>

<template>
  <PageHero
    v-if="law"
    :eyebrow="cat?.full"
    :title="law.title"
    :back="{ to: '/laws-that-have-been-violated/', label: 'Усі порушені закони' }" />

  <article class="section" :style="{ '--cat': cat?.color }">
    <div class="wrap wrap--text">

      <div class="law-body">
        <ProseBlock v-if="law" :html="law.html" />
      </div>

      <section v-if="related.length" class="rel no-print">
        <h2 class="eyebrow rel__title">Інші статті цього ж закону</h2>
        <ul class="rel__list">
          <li v-for="r in related" :key="r.slug">
            <NuxtLink :to="r.path">{{ r.title }}</NuxtLink>
          </li>
        </ul>
      </section>
    </div>
  </article>
</template>

<style scoped>

.law-body {
  border-inline-start: 3px solid var(--cat, var(--accent));
  padding-inline-start: clamp(1rem, 3vw, 1.75rem);
}

.rel { margin-top: clamp(2.5rem, 5vw, 4rem); padding-top: 2rem; border-top: 1px solid var(--line); }
.rel__title { margin-bottom: 1rem; }
.rel__list { list-style: none; padding: 0; display: grid; gap: 1px; background: var(--line); border-block: 1px solid var(--line); }

.rel__list a {
  display: block;
  padding: .85rem .25rem;
  background: var(--paper);
  text-decoration: none;
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: .95rem;
  line-height: 1.4;
  transition: color .16s, padding-inline-start .16s;
}
.rel__list a:hover { color: var(--accent); padding-inline-start: .75rem; }
</style>
