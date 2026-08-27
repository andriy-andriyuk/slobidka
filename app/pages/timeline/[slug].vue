<script setup lang="ts">
import events from '~/data/events.json'
import timelines from '~/data/timelines.json'

const route = useRoute()
const slug = computed(() => decodeURIComponent(String(route.params.slug)))

const event = computed(() => events.find((e) => e.slug === slug.value))

if (!event.value) {
  throw createError({ statusCode: 404, statusMessage: 'Подію не знайдено', fatal: true })
}

/** Стрічка, у якій ця подія трапляється, — щоб дати посилання «назад». */
const path = computed(() => `/timeline/${slug.value}/`)

const parent = computed(() => {
  const tl = timelines.find((t) => t.events.some((e) => e.page === path.value))
  return tl ?? timelines[0]!
})

const inTimeline = computed(() =>
  parent.value.events.find((e) => e.page === path.value))

const dateLabel = computed(() => {
  const e = inTimeline.value
  if (!e) return null
  return e.year && !e.date.includes(e.year) ? `${e.date} ${e.year}` : e.date
})

/** Сусідні події тієї самої стрічки. */
const siblings = computed(() => {
  const list = parent.value.events.filter((e) => e.page)
  const i = list.findIndex((e) => e.page === path.value)
  return { prev: i > 0 ? list[i - 1] : null, next: i >= 0 && i < list.length - 1 ? list[i + 1] : null }
})

useHead({ title: () => event.value!.title })
useSeoMeta({
  description: () => event.value!.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180),
})
</script>

<template>
  <PageHero
    v-if="event"
    eyebrow="Подія хронології"
    :title="event.title"
    :meta="dateLabel ? [dateLabel] : []"
    :back="{ to: parent.path, label: parent.title }" />

  <article class="section">
    <div class="wrap wrap--text">
      <ProseBlock v-if="event" :html="event.html" />

      <VideoEmbed v-if="event?.video" :video="event.video" :title="event.title" />

      <nav v-if="siblings.prev || siblings.next" class="sib no-print" aria-label="Сусідні події">
        <NuxtLink v-if="siblings.prev" :to="siblings.prev.page!" class="sib__link sib__link--prev">
          <Ico name="arrow-left" :size="16" />
          <span>
            <b class="eyebrow">Попередня</b>
            {{ siblings.prev.title }}
          </span>
        </NuxtLink>
        <NuxtLink v-if="siblings.next" :to="siblings.next.page!" class="sib__link sib__link--next">
          <span>
            <b class="eyebrow">Наступна</b>
            {{ siblings.next.title }}
          </span>
          <Ico name="arrow-right" :size="16" />
        </NuxtLink>
      </nav>
    </div>
  </article>
</template>

<style scoped>
.sib {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: .75rem;
  margin-top: clamp(2.5rem, 5vw, 4rem);
  padding-top: 2rem;
  border-top: 1px solid var(--line);
}

.sib__link {
  display: flex;
  align-items: center;
  gap: .75rem;
  padding: 1rem 1.15rem;
  border: 1px solid var(--line);
  border-radius: var(--r);
  background: var(--paper-2);
  text-decoration: none;
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: .95rem;
  line-height: 1.35;
  transition: border-color .16s, transform .16s;
}
.sib__link:hover { border-color: var(--accent); transform: translateY(-2px); }
.sib__link--next { text-align: end; justify-content: end; }

.sib__link b { display: block; margin-bottom: .25rem; }
.sib__link .ico { color: var(--ink-3); flex: none; }
</style>
