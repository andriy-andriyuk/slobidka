<script setup lang="ts">
import timelines from '~/data/timelines.json'
import laws from '~/data/laws.json'
import pages from '~/data/pages.json'

const short = timelines.find((t) => t.id === 'crime-story')!
const detailed = timelines.find((t) => t.id === 'crime-story-details')!
const sl79 = timelines.find((t) => t.id === 'slobidska-7-9')!

const years = timelines
  .flatMap((t) => t.events.map((e) => Number(e.year)))
  .filter((y) => Number.isFinite(y))
const from = Math.min(...years)
const to = Math.max(...years)
const totalEvents = timelines.reduce((a, t) => a + t.events.length, 0)

const stats = [
  { value: '7,07', unit: 'га', label: 'берега Дніпра, виведеного з громадської власності' },
  { value: String(laws.items.filter((l) => !l.duplicateOf).length), unit: '', label: 'норм законодавства порушено при захопленні' },
  { value: `${to - from}`, unit: 'років', label: `задокументованої історії, ${from}–${to}` },
  { value: String(totalEvents), unit: '', label: 'подій у хронології з посиланнями на джерела' },
]

const routes = [
  {
    to: '/crime-story-details/',
    icon: 'file-text',
    title: 'Детальна історія злочину',
    text: 'Повна хронологія: рішення Київради, банкрутства, аукціони, суди та спротив громади.',
    meta: pluralize(detailed.events.length, 'подія', 'події', 'подій'),
  },
  {
    to: '/злочин-микільсько-слобідська-7-9/',
    icon: 'map-pin',
    title: 'Злочин: Микільсько-Слобідська 7–9',
    text: 'Окрема ділянка з власною історією захоплення — від 2003 року до сьогодні.',
    meta: pluralize(sl79.events.length, 'подія', 'події', 'подій'),
  },
  {
    to: '/laws-that-have-been-violated/',
    icon: 'scale',
    title: 'Порушені закони',
    text: 'Конституція, Водний і Земельний кодекси, охорона спадщини та довкілля, кримінальні статті.',
    meta: pluralize(laws.items.filter((l) => !l.duplicateOf).length, 'стаття', 'статті', 'статей'),
  },
]

const materials = pages.filter((p) => p.context).slice(0, 3)

// title лишаємо порожнім: titleTemplate у app.vue сам підставить назву сайту,
// інакше вона задвоювалась у вкладці браузера
useHead({ title: '' })
useSeoMeta({
  description: 'Громадський архів про спробу рейдерського захоплення 7,07 га берега Дніпра на Микільській Слобідці: хронологія подій, документи та перелік порушених законів.',
  ogTitle: 'Микільсько-Слобідська.info — незаконні забудови на Микільській Слобідці',
  ogDescription: 'Спроба рейдерства 7,07 га берега Дніпра: хронологія, документи, рішення, аукціони та порушені закони.',
  ogImage: '/media/2017/08/2007_LATEST.png',
})
</script>

<template>
  <!-- ------------------------------------------------------------ герой -->
  <section class="hero">
    <div class="wrap hero__grid">
      <div class="hero__copy">
        <p class="eyebrow hero__eyebrow">
          <span class="dot" /> Громадський архів · Київ, Лівий берег
        </p>

        <h1 class="h-display hero__title">
          Спроба рейдерства<br class="hero__br">
          <span class="hero__accent">7,07 гектара</span><br class="hero__br">
          берега Дніпра
        </h1>

        <p class="hero__lead">
          Микільська Слобідка. Земля, призначена під парк, реабілітаційний центр і громадські
          пляжі, за {{ to - from }} років перетворилася на майданчик для житлової забудови —
          через рішення Київради, банкрутства, заставу в Ощадбанку та аукціони.
          Тут зібрано те, що вдалося задокументувати.
        </p>

        <div class="hero__actions">
          <NuxtLink to="#chronology" class="btn btn--primary">
            Читати хронологію
            <Ico name="arrow-right" :size="18" />
          </NuxtLink>
          <NuxtLink to="/laws-that-have-been-violated/" class="btn btn--night">
            Порушені закони
          </NuxtLink>
        </div>
      </div>

      <figure class="hero__figure">
        <img
          src="/media/2017/08/2007_LATEST.png"
          alt="Супутниковий знімок берега Дніпра на Микільській Слобідці з позначеною червоним ділянкою 7,07 га"
          width="600" height="600" fetchpriority="high">
        <figcaption>
          Ділянка, об’єднана рішенням Київради № 67/1901 від 26.07.2007
        </figcaption>
      </figure>
    </div>

    <div class="wrap">
      <dl class="stats">
        <div v-for="s in stats" :key="s.label" class="stats__item">
          <dt class="stats__value">
            {{ s.value }}<span v-if="s.unit" class="stats__unit">{{ s.unit }}</span>
          </dt>
          <dd class="stats__label">{{ s.label }}</dd>
        </div>
      </dl>
    </div>
  </section>

  <!-- ------------------------------------------------------- хронологія -->
  <section id="chronology" class="section">
    <div class="wrap">
      <header class="sec-head">
        <p class="eyebrow eyebrow--accent">Коротко</p>
        <h2 class="h1">Як це відбувалося</h2>
        <p class="lead">
          Хронологія захоплення та віджиму берегу Дніпра у громади Микільської Слобідки —
          шість ключових моментів. Розгорнута версія з документами у детальній історії.
        </p>
      </header>

      <Timeline :events="short.events" />

      <div class="sec-cta">
        <NuxtLink to="/crime-story-details/" class="btn btn--primary">
          Детальна історія злочину — {{ pluralize(detailed.events.length, 'подія', 'події', 'подій') }}
          <Ico name="arrow-right" :size="18" />
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- ---------------------------------------------------------- розділи -->
  <section class="section section--tight routes">
    <div class="wrap">
      <div class="routes__grid">
        <NuxtLink v-for="r in routes" :key="r.to" :to="r.to" class="route card">
          <span class="route__icon"><Ico :name="r.icon" /></span>
          <span class="route__meta eyebrow">{{ r.meta }}</span>
          <h3 class="h3 route__title">{{ r.title }}</h3>
          <p class="route__text muted">{{ r.text }}</p>
          <span class="route__go">Перейти <Ico name="arrow-right" :size="16" /></span>
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- -------------------------------------------------------- матеріали -->
  <section class="section">
    <div class="wrap">
      <header class="sec-head sec-head--row">
        <div>
          <p class="eyebrow eyebrow--accent">Контекст</p>
          <h2 class="h2">Хто і як це зробив можливим</h2>
        </div>
        <NuxtLink to="/materials/" class="btn btn--ghost">
          Усі матеріали <Ico name="arrow-right" :size="16" />
        </NuxtLink>
      </header>

      <ul class="mats">
        <li v-for="m in materials" :key="m.path">
          <NuxtLink :to="m.path" class="mat">
            <h3 class="mat__title">{{ m.title }}</h3>
            <p v-if="m.lead" class="mat__lead muted">{{ m.lead }}</p>
            <Ico name="arrow-right" :size="18" class="mat__go" />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>

  <!-- -------------------------------------------------------------- CTA -->
  <section class="cta no-print">
    <div class="wrap cta__inner">
      <div>
        <h2 class="h2 cta__title">Історія не закінчена</h2>
        <p class="cta__text">
          Архів лишається відкритим, а матеріали — придатними до друку й поширення.
          Долучайтеся до спільнот, які стежать за долею берега.
        </p>
      </div>
      <div class="cta__actions">
        <NuxtLink to="/долучитися/" class="btn btn--primary">Долучитися</NuxtLink>
        <NuxtLink to="/print-and-share/" class="btn btn--night">
          <Ico name="printer" :size="18" /> Роздрукуй та пошир
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ------------------------------------------------------------------ герой */
.hero {
  position: relative;
  background: var(--night);
  color: var(--night-ink);
  padding-block: clamp(3rem, 8vw, 6rem) 0;
  overflow: hidden;
}

/* ледь помітна сітка — натяк на кадастровий план */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgb(255 255 255 / 4%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 4%) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(120% 90% at 70% 0%, #000 20%, transparent 75%);
  pointer-events: none;
}

.hero__grid {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, .7fr);
  align-items: center;
  gap: clamp(2rem, 5vw, 4rem);
  padding-bottom: clamp(3rem, 6vw, 4.5rem);
}

@media (max-width: 62rem) {
  .hero__grid { grid-template-columns: 1fr; }
  .hero__figure { max-width: min(26rem, 100%); }
}

.hero__eyebrow { display: flex; align-items: start; gap: .6rem; color: var(--night-ink2); }

.dot {
  flex: none;
  margin-top: .45em;
  width: .5rem; height: .5rem; border-radius: 100px;
  background: var(--accent);
  box-shadow: 0 0 0 4px rgb(194 64 44 / 25%);
}

.hero__title { margin-top: 1.25rem; color: #fff; }
.hero__accent { color: var(--accent); }

.hero__lead {
  margin-top: 1.5rem;
  max-width: 46ch;
  font-size: clamp(1.02rem, 1.6vw, 1.15rem);
  line-height: 1.65;
  color: var(--night-ink2);
  text-wrap: pretty;
}

.hero__actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 2rem; }

.hero__figure { position: relative; }

.hero__figure img {
  width: 100%;
  border-radius: var(--r);
  border: 1px solid var(--night-line);
  box-shadow: 0 30px 70px -30px rgb(0 0 0 / 80%);
}

.hero__figure figcaption {
  margin-top: .85rem;
  font-family: var(--font-mono);
  font-size: .72rem;
  line-height: 1.5;
  letter-spacing: .03em;
  color: var(--night-ink2);
  opacity: .8;
}

/* ---------------------------------------------------------------- цифри */
.stats {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  background: var(--night-line);
  border-top: 1px solid var(--night-line);
}

@media (max-width: 55rem) { .stats { grid-template-columns: repeat(2, 1fr); } }

.stats__item { background: var(--night); padding: clamp(1.25rem, 3vw, 2rem) clamp(.75rem, 2vw, 1.5rem); }

.stats__value {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  letter-spacing: -.04em;
  line-height: 1;
  color: #fff;
}

.stats__unit {
  font-family: var(--font-ui);
  font-size: .45em;
  font-weight: 600;
  margin-inline-start: .3em;
  color: var(--accent);
  letter-spacing: 0;
}

.stats__label {
  margin-top: .6rem;
  font-size: .85rem;
  line-height: 1.45;
  color: var(--night-ink2);
  text-wrap: pretty;
}

/* -------------------------------------------------------- заголовки сек. */
.sec-head { max-width: 46rem; margin-bottom: clamp(2rem, 4vw, 3rem); }
.sec-head .h1, .sec-head .h2 { margin-top: .6rem; }
.sec-head .lead { margin-top: .9rem; }

.sec-head--row {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
  max-width: none;
  flex-wrap: wrap;
}

.sec-cta { display: flex; justify-content: center; margin-top: 1rem; }

/* ---------------------------------------------------------------- картки */
.routes__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
  gap: 1rem;
}

.route {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  padding: 1.5rem;
  text-decoration: none;
  transition: transform .18s, box-shadow .18s, border-color .18s;
}
.route:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: color-mix(in oklab, var(--accent) 45%, var(--line));
}

.route__icon {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--r-sm);
  background: var(--accent-sub);
  color: var(--accent);
  margin-bottom: .5rem;
}

.route__meta { color: var(--ink-3); }
.route__title { letter-spacing: -.015em; }
.route__text { font-size: .95rem; flex: 1; }

.route__go {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  margin-top: .75rem;
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: .9rem;
  color: var(--accent);
}

/* ------------------------------------------------------------- матеріали */
.mats { list-style: none; padding: 0; display: grid; gap: 1px; background: var(--line); border-block: 1px solid var(--line); }

.mat {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 1.25rem;
  row-gap: .3rem;
  padding: 1.25rem .5rem;
  background: var(--paper);
  text-decoration: none;
  transition: background-color .16s, padding-inline .16s;
}
.mat:hover { background: var(--paper-2); padding-inline: 1rem .5rem; }

.mat__title {
  grid-column: 1;
  grid-row: 1;
  font-family: var(--font-ui);
  font-weight: 650;
  font-size: 1.05rem;
  line-height: 1.3;
  letter-spacing: -.015em;
  text-wrap: pretty;
}

.mat__lead {
  grid-column: 1;
  grid-row: 2;
  font-size: .92rem;
  line-height: 1.5;
}

.mat__go {
  grid-column: 2;
  grid-row: 1 / -1;
  align-self: center;
  color: var(--ink-3);
}
.mat:hover .mat__go { color: var(--accent); }

@media (max-width: 30rem) {
  .mat { padding-block: 1.1rem; column-gap: .9rem; }
  .mat__go { width: 1.1rem; height: 1.1rem; }
}

/* ------------------------------------------------------------------- CTA */
.cta { background: var(--night); color: var(--night-ink); padding-block: clamp(3rem, 6vw, 4.5rem); }

.cta__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.cta__title { color: #fff; }
.cta__text { margin-top: .75rem; max-width: 48ch; color: var(--night-ink2); text-wrap: pretty; }
.cta__actions { display: flex; flex-wrap: wrap; gap: .75rem; }

/* ------------------------------------------------------ мобільні кеглі
   Розміщено в кінці навмисно: інакше базові правила з тією ж
   специфічністю, оголошені нижче, перекрили б медіазапит. */
@media (max-width: 40rem) {
  .hero__lead { font-size: 1.1rem; line-height: 1.6; }

  .stats__item { padding: 1.4rem 1rem; }
  .stats__value { font-size: 2.15rem; }
  .stats__label { font-size: .95rem; line-height: 1.4; }

  .route__text { font-size: 1rem; }
  .route__go { font-size: .98rem; }
  .mat__title { font-size: 1.1rem; }
  .mat__lead { font-size: .98rem; }

  .cta__text { font-size: 1.05rem; }
}
</style>
