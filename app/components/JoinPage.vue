<script setup lang="ts">
import site from '~/data/site.json'

const props = defineProps<{ title: string }>()

const meta: Record<string, string> = {
  youtube: 'Відеозаписи акцій, сесій Київради та зйомка з місця подій.',
  facebook: 'Найактивніша спільнота: новини, обговорення, координація дій.',
  viber: 'Оперативний чат сусідів — швидкі сповіщення про техніку на ділянці.',
}
</script>

<template>
  <PageHero
    eyebrow="Спільнота"
    :title="title"
    lead="Боротьба за берег велася і ведеться силами сусідів. Ось де вони спілкуються — там і найсвіжіші новини про долю ділянки." />

  <section class="section">
    <div class="wrap">
      <ul class="join">
        <li v-for="s in site.social" :key="s.key">
          <a :href="s.href" target="_blank" rel="noopener noreferrer" class="join__card card" :class="`join__card--${s.key}`">
            <span class="join__icon"><Ico :name="s.icon" :size="24" /></span>
            <span class="join__body">
              <span class="join__label eyebrow">{{ s.label }}</span>
              <span class="join__title">{{ s.title }}</span>
              <span class="join__text muted">{{ meta[s.key] }}</span>
            </span>
            <Ico name="external-link" :size="18" class="join__go" />
          </a>
        </li>
      </ul>

    </div>
  </section>
</template>

<style scoped>
.join { list-style: none; padding: 0; display: grid; gap: .85rem; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); }

.join__card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: start;
  gap: 1rem;
  height: 100%;
  padding: 1.5rem;
  text-decoration: none;
  transition: transform .18s, box-shadow .18s, border-color .18s;
}
.join__card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--brand, var(--accent)); }

.join__card--youtube  { --brand: #ff0033; }
.join__card--facebook { --brand: #0866ff; }
.join__card--viber    { --brand: #7360f2; }

.join__icon {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: var(--r-sm);
  background: color-mix(in srgb, var(--brand) 12%, transparent);
  color: var(--brand);
  flex: none;
}

.join__body { display: flex; flex-direction: column; gap: .3rem; }
.join__label { color: var(--brand); }
.join__title { font-family: var(--font-ui); font-weight: 650; font-size: 1.05rem; letter-spacing: -.015em; line-height: 1.3; }
.join__text { font-size: .92rem; line-height: 1.5; }

.join__go { color: var(--ink-3); flex: none; }
.join__card:hover .join__go { color: var(--brand); }

</style>
