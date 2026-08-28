<script setup lang="ts">
import pages from '~/data/pages.json'

const page = pages.find((p) => p.slug === 'print-and-share')!

const files = page.downloads ?? []

useHead({ title: 'Роздрукуй та пошир' })
useSeoMeta({
  description: 'Готові до друку плакати та листівки про захоплення берега Дніпра на Микільській Слобідці — формати A3, A4, A5 у PDF.',
})
</script>

<template>
  <PageHero
    eyebrow="Матеріали для друку"
    title="Роздрукуй та пошир"
    lead="Плакати й листівки, зроблені громадою у 2017–2018 роках. Формати придатні для друку вдома або в копіцентрі — розвісити в під’їзді, роздати сусідам, узяти на акцію."
    :meta="[pluralize(files.length, 'аркуш', 'аркуші', 'аркушів'), 'Висока роздільність', 'Вільне поширення']" />

  <section class="section">
    <div class="wrap">
      <ul class="sheets">
        <li v-for="(f, i) in files" :key="f.href" class="sheet card">
          <a :href="f.href" target="_blank" rel="noopener noreferrer" class="sheet__view">
            <img :src="f.thumb" :alt="f.title" loading="lazy" decoding="async">
            <span class="sheet__zoom"><Ico name="zoom-in" :size="20" /></span>
          </a>
          <div class="sheet__body">
            <span class="sheet__n">{{ String(i + 1).padStart(2, '0') }}</span>
            <h2 class="sheet__title">{{ f.title }}</h2>
            <p class="sheet__meta">
              {{ f.width }} × {{ f.height }} px · {{ fileSize(f.bytes) }}
            </p>
            <a :href="f.href" download class="sheet__dl">
              <Ico name="download" :size="16" /> Зберегти для друку
            </a>
          </div>
        </li>
      </ul>

    </div>
  </section>
</template>

<style scoped>
.sheets {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(19rem, 1fr));
}

.sheet {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform .18s, box-shadow .18s, border-color .18s;
}
.sheet:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: color-mix(in oklab, var(--accent) 45%, var(--line));
}

.sheet__view {
  position: relative;
  display: block;
  background: var(--paper-3);
  border-bottom: 1px solid var(--line);
}
.sheet__view img {
  width: 100%;
  height: auto;
  max-height: 20rem;
  object-fit: contain;
  object-position: center top;
}

.sheet__zoom {
  position: absolute;
  right: .6rem;
  bottom: .6rem;
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 100px;
  background: rgb(8 10 12 / 70%);
  color: #fff;
  opacity: 0;
  transition: opacity .18s;
}
.sheet:hover .sheet__zoom { opacity: 1; }

.sheet__body {
  display: flex;
  flex-direction: column;
  gap: .3rem;
  padding: 1.1rem 1.25rem 1.25rem;
  flex: 1;
}

.sheet__n {
  font-family: var(--font-mono);
  font-size: .72rem;
  letter-spacing: .1em;
  color: var(--ink-3);
}

.sheet__title {
  font-family: var(--font-ui);
  font-weight: 650;
  font-size: 1rem;
  line-height: 1.35;
  letter-spacing: -.01em;
  text-wrap: pretty;
}

.sheet__meta {
  font-family: var(--font-mono);
  font-size: .74rem;
  letter-spacing: .04em;
  color: var(--ink-3);
}

.sheet__dl {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  margin-top: auto;
  padding-top: .9rem;
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: .875rem;
  color: var(--accent);
  text-decoration: none;
  align-self: start;
}
.sheet__dl:hover { text-decoration: underline; }

@media (max-width: 40rem) {
  .sheet__title { font-size: 1.08rem; }
  .sheet__meta { font-size: .82rem; }
  .sheet__dl { font-size: .95rem; }
}
</style>
