<script setup lang="ts">
import site from '~/data/site.json'

const year = new Date().getFullYear()

const cols = [
  {
    title: 'Розслідування',
    links: [
      { to: '/', label: 'Хронологія захоплення' },
      { to: '/crime-story-details/', label: 'Детальна історія злочину' },
      { to: '/злочин-микільсько-слобідська-7-9/', label: 'Злочин: Микільсько-Слобідська 7–9' },
      { to: '/laws-that-have-been-violated/', label: 'Порушені закони' },
    ],
  },
  {
    title: 'Матеріали',
    links: [
      { to: '/materials/', label: 'Аналітика та контекст' },
      { to: '/де-знаходиться-сучасна-микільська-сл/', label: 'Де це знаходиться' },
      { to: '/print-and-share/', label: 'Роздрукуй та пошир' },
      { to: '/долучитися/', label: 'Долучитися' },
    ],
  },
]
</script>

<template>
  <footer class="ftr no-print">
    <div class="wrap">
      <div class="ftr__top">
        <div class="ftr__brand">
          <p class="ftr__name">{{ site.name }}</p>
          <p class="ftr__desc">{{ site.description }}</p>
          <div class="ftr__social">
            <a
              v-for="s in site.social" :key="s.key" :href="s.href"
              class="soc" target="_blank" rel="noopener noreferrer" :title="s.title">
              <Ico :name="s.icon" />
              <span>{{ s.label }}</span>
            </a>
          </div>
        </div>

        <nav v-for="col in cols" :key="col.title" class="ftr__col">
          <p class="ftr__col-title">{{ col.title }}</p>
          <NuxtLink v-for="l in col.links" :key="l.to" :to="l.to" class="ftr__link">
            {{ l.label }}
          </NuxtLink>
        </nav>
      </div>

      <div class="ftr__bottom">
        <p>
          Громадський архів. Матеріали зібрано у 2017–2021 роках мешканцями Микільської Слобідки.
        </p>
        <p class="ftr__note">
          © {{ year }} · Вільне поширення заохочується
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.ftr {
  background: var(--night);
  color: var(--night-ink2);
  padding-block: clamp(3rem, 6vw, 4.5rem) 2rem;
  font-size: .95rem;
}

.ftr__top {
  display: grid;
  gap: clamp(2rem, 5vw, 3.5rem);
  grid-template-columns: minmax(16rem, 1.4fr) repeat(2, minmax(11rem, 1fr));
  padding-bottom: 2.5rem;
  border-bottom: 1px solid var(--night-line);
}

@media (max-width: 52rem) {
  .ftr__top { grid-template-columns: 1fr 1fr; }
  .ftr__brand { grid-column: 1 / -1; }
}

.ftr__name {
  font-family: var(--font-ui);
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--night-ink);
  letter-spacing: -.02em;
}
.ftr__desc { margin-top: .35rem; max-width: 28ch; }

.ftr__social { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.25rem; }

.soc {
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  padding: .45rem .85rem;
  border: 1px solid var(--night-line);
  border-radius: 100px;
  font-size: .85rem;
  font-weight: 600;
  font-family: var(--font-ui);
  text-decoration: none;
  color: var(--night-ink);
  transition: background-color .16s, border-color .16s;
}
.soc:hover { background: rgb(255 255 255 / 8%); border-color: rgb(255 255 255 / 30%); }
.soc .ico { width: 1.05rem; height: 1.05rem; }

.ftr__col { display: flex; flex-direction: column; align-items: start; gap: .55rem; }

.ftr__col-title {
  font-family: var(--font-mono);
  font-size: .72rem;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--night-ink2);
  opacity: .7;
  margin-bottom: .25rem;
}

.ftr__link {
  text-decoration: none;
  color: var(--night-ink);
  font-size: .92rem;
  transition: color .16s;
  text-wrap: pretty;
}
.ftr__link:hover { color: var(--accent); }

.ftr__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: .75rem;
  padding-top: 1.75rem;
  font-size: .85rem;
}
.ftr__note { opacity: .7; }
</style>
