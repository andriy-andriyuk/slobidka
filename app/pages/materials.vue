<script setup lang="ts">
import pages from '~/data/pages.json'

const items = pages.filter((p) => p.context)

useHead({ title: 'Матеріали та контекст' })
useSeoMeta({
  description: 'Аналітичні матеріали про механізми легалізації незаконних забудов у Києві: роль КМДА і Київради, ДАБІ, судової системи, а також розбір аукціонів Ощадбанку.',
})
</script>

<template>
  <PageHero
    eyebrow="Аналітика"
    title="Матеріали та контекст"
    lead="Окремі розбори того, як працює механізм: хто ухвалює рішення, хто видає дозволи, хто прикриває забудовника в судах і як виглядали аукціони зблизька."
    :meta="[pluralize(items.length, 'матеріал', 'матеріали', 'матеріалів')]" />

  <section class="section">
    <div class="wrap">
      <ul class="mlist">
        <li v-for="(m, i) in items" :key="m.path">
          <NuxtLink :to="m.path" class="mcard card">
            <span class="mcard__n">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="mcard__body">
              <h2 class="h3 mcard__title">{{ m.title }}</h2>
              <p v-if="m.lead" class="mcard__lead muted">{{ m.lead }}</p>
            </div>
            <Ico name="arrow-right" class="mcard__go" />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.mlist { list-style: none; padding: 0; display: grid; gap: .75rem; }

.mcard {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1.25rem;
  padding: 1.4rem 1.5rem;
  text-decoration: none;
  transition: transform .18s, box-shadow .18s, border-color .18s;
}
.mcard:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: color-mix(in oklab, var(--accent) 45%, var(--line));
}

.mcard__n {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.4rem;
  color: var(--line);
  letter-spacing: -.04em;
}
.mcard:hover .mcard__n { color: var(--accent); }

.mcard__title { letter-spacing: -.015em; }
.mcard__lead { margin-top: .35rem; font-size: .95rem; }

.mcard__go { color: var(--ink-3); flex: none; }
.mcard:hover .mcard__go { color: var(--accent); }
</style>
