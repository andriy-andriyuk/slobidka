<script setup lang="ts">
/**
 * Рендерить збережений HTML зі старого WordPress і додає лайтбокс:
 * більшість зображень тут — скани документів, їх треба розглядати.
 */
const props = defineProps<{ html: string }>()

const root = ref<HTMLElement | null>(null)
const zoomed = ref<{ src: string; alt: string } | null>(null)

function onClick(e: MouseEvent) {
  const img = (e.target as HTMLElement)?.closest?.('img')
  if (!img || !root.value?.contains(img)) return
  // зображення всередині посилання лишаємо посиланню
  if (img.closest('a')) return
  e.preventDefault()
  // за наявності показуємо оригінал, а не зменшену копію зі сторінки
  const el = img as HTMLImageElement
  zoomed.value = {
    src: el.dataset.full || el.currentSrc || el.src,
    alt: el.getAttribute('alt') || '',
  }
}

function close() { zoomed.value = null }

function onKey(e: KeyboardEvent) { if (e.key === 'Escape') close() }

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

watch(zoomed, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <div ref="root" class="prose prose--zoom" @click="onClick" v-html="props.html" />

  <Teleport to="body">
    <div v-if="zoomed" class="lb no-print" role="dialog" aria-modal="true" @click="close">
      <button class="lb__close" aria-label="Закрити"><Ico name="x" /></button>
      <img :src="zoomed.src" :alt="zoomed.alt" @click.stop>
    </div>
  </Teleport>
</template>

<style scoped>
.prose--zoom :deep(img) { cursor: zoom-in; }
.prose--zoom :deep(a img) { cursor: pointer; }

.lb {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: grid;
  place-items: center;
  padding: clamp(1rem, 4vw, 3rem);
  background: rgb(6 8 10 / 88%);
  backdrop-filter: blur(6px);
  cursor: zoom-out;
  animation: lb-in .16s ease-out;
}

.lb img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  border-radius: var(--r-sm);
  box-shadow: 0 30px 80px -20px rgb(0 0 0 / 70%);
  cursor: default;
}

.lb__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 100px;
  color: #fff;
  background: rgb(255 255 255 / 12%);
}
.lb__close:hover { background: rgb(255 255 255 / 22%); }

@keyframes lb-in { from { opacity: 0 } to { opacity: 1 } }
</style>
