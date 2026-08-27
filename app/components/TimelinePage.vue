<script setup lang="ts">
interface Tl {
  id: string
  title: string
  path: string
  intro: string
  events: any[]
}

const props = defineProps<{ timeline: Tl; eyebrow: string; lead: string }>()

const years = computed(() => [...new Set(props.timeline.events.map((e) => e.year))])

const span = computed(() => {
  const nums = years.value.map(Number).filter(Number.isFinite)
  return nums.length ? `${Math.min(...nums)}–${Math.max(...nums)}` : ''
})
</script>

<template>
  <PageHero
    :eyebrow="eyebrow"
    :title="timeline.title"
    :lead="lead"
    :meta="[
      pluralize(timeline.events.length, 'подія', 'події', 'подій'),
      span,
      pluralize(years.length, 'рік у стрічці', 'роки у стрічці', 'років у стрічці'),
    ]" />

  <YearNav :years="years" />

  <section class="section">
    <div class="wrap">
      <div v-if="timeline.intro" class="tp__intro">
        <ProseBlock :html="timeline.intro" />
      </div>
      <Timeline :events="timeline.events" />
    </div>
  </section>
</template>

<style scoped>
.tp__intro { max-width: var(--wrap-text); margin-bottom: clamp(2rem, 4vw, 3rem); }
.tp__intro :deep(h3) { font-size: 1.25rem; }
</style>
