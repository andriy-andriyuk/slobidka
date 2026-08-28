<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  lead?: string | null
  meta?: string[]
  back?: { to: string; label: string }
}>()
</script>

<template>
  <header class="ph">
    <div class="wrap">
      <NuxtLink v-if="back" :to="back.to" class="ph__back no-print">
        <Ico name="arrow-left" :size="16" /> {{ back.label }}
      </NuxtLink>

      <p v-if="eyebrow" class="eyebrow eyebrow--accent ph__eyebrow">{{ eyebrow }}</p>
      <h1 class="h1 ph__title">{{ title }}</h1>
      <p v-if="lead" class="lead ph__lead">{{ lead }}</p>

      <ul v-if="meta?.length" class="ph__meta">
        <li v-for="m in meta" :key="m">{{ m }}</li>
      </ul>
    </div>
  </header>
</template>

<style scoped>
.ph {
  padding-block: clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 3vw, 2.5rem);
  border-bottom: 1px solid var(--line);
  background:
    radial-gradient(80% 120% at 0% 0%, var(--accent-sub), transparent 60%),
    var(--paper);
}

.ph__back {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  margin-bottom: 1.25rem;
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: .875rem;
  color: var(--ink-2);
  text-decoration: none;
}
.ph__back:hover { color: var(--accent); }

.ph__eyebrow { margin-bottom: .7rem; }
.ph__title { max-width: 22ch; }
.ph__lead { margin-top: 1rem; max-width: 55ch; }

.ph__meta {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
}

.ph__meta li {
  padding: .3rem .7rem;
  border: 1px solid var(--line);
  border-radius: 100px;
  background: var(--paper-2);
  font-family: var(--font-mono);
  font-size: .72rem;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--ink-2);
}

@media (max-width: 40rem) {
  .ph__meta li { font-size: .8rem; }
  .ph__back { font-size: .95rem; }
}
</style>
