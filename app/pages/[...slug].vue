<script setup lang="ts">
import pages from '~/data/pages.json'
import timelines from '~/data/timelines.json'

const route = useRoute()

/** Шляхи зі старого WP — кирилицею, тому нормалізуємо кодування та слеш. */
const path = computed(() => {
  const raw = decodeURIComponent(route.path)
  return raw.endsWith('/') ? raw : `${raw}/`
})

const timeline = computed(() => timelines.find((t) => t.path === path.value))
const page = computed(() => pages.find((p) => p.path === path.value))
const isJoin = computed(() => path.value === '/долучитися/')

if (!timeline.value && !page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Сторінку не знайдено', fatal: true })
}

useHead({ title: () => timeline.value?.title ?? page.value?.title ?? '' })
useSeoMeta({
  description: () =>
    page.value?.lead
    ?? page.value?.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180)
    ?? '',
})
</script>

<template>
  <TimelinePage
    v-if="timeline"
    :timeline="timeline"
    eyebrow="Окрема ділянка"
    lead="Микільсько-Слобідська, 7–9 — сусідня ділянка з власною історією захоплення: від рішень початку 2000-х до забудови, яка триває." />

  <JoinPage v-else-if="isJoin && page" :title="page.title" />

  <template v-else-if="page">
    <PageHero
      :eyebrow="page.context ? 'Матеріал' : undefined"
      :title="page.title"
      :lead="page.lead"
      :back="page.context ? { to: '/materials/', label: 'Усі матеріали' } : undefined" />

    <article class="section">
      <div class="wrap wrap--text">
        <ProseBlock :html="page.html" />
      </div>
    </article>
  </template>
</template>
