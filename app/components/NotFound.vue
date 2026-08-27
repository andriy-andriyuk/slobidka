<script setup lang="ts">
withDefaults(defineProps<{ code?: number | string; message?: string | null }>(), {
  code: 404,
  message: null,
})
</script>

<template>
  <section class="err">
    <div class="wrap err__inner">
      <p class="err__code">{{ code }}</p>
      <h1 class="h1">
        {{ String(code) === '404' ? 'Такої сторінки в архіві немає' : 'Щось пішло не так' }}
      </h1>
      <p class="lead err__lead">
        {{ message || (String(code) === '404'
          ? 'Можливо, посилання застаріле. Спробуйте почати з хронології.'
          : 'Спробуйте оновити сторінку.') }}
      </p>
      <div class="err__actions">
        <NuxtLink to="/" class="btn btn--primary">
          <Ico name="arrow-left" :size="18" /> На головну
        </NuxtLink>
        <NuxtLink to="/crime-story-details/" class="btn btn--ghost">Детальна історія</NuxtLink>
        <NuxtLink to="/laws-that-have-been-violated/" class="btn btn--ghost">Порушені закони</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.err { padding-block: clamp(4rem, 12vw, 9rem); }
.err__inner { max-width: 40rem; }

.err__code {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(4rem, 14vw, 8rem);
  line-height: .9;
  letter-spacing: -.05em;
  color: var(--accent);
  margin-bottom: 1rem;
}

.err__lead { margin-top: 1rem; }
.err__actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 2rem; }
</style>
