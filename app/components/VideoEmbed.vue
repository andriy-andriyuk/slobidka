<script setup lang="ts">
/**
 * Відео з YouTube, прив’язане до події у Cool Timeline.
 * Обкладинка лежить локально, плеєр підвантажується лише після кліку —
 * до того сторінка не звертається до сторонніх серверів.
 */
const props = defineProps<{
  video: { id: string; url: string; thumb: string | null }
  title?: string
}>()

const playing = ref(false)

const src = computed(() =>
  `https://www.youtube-nocookie.com/embed/${props.video.id}?autoplay=1&rel=0`)
</script>

<template>
  <figure class="vid">
    <div v-if="playing" class="vid__frame">
      <iframe
        :src="src" :title="title || 'Відео'" allowfullscreen
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture" />
    </div>

    <button v-else class="vid__poster" type="button" @click="playing = true">
      <img v-if="video.thumb" :src="video.thumb" :alt="title || 'Обкладинка відео'" loading="lazy">
      <span v-else class="vid__blank" />
      <span class="vid__play"><Ico name="circle-play" :size="30" /></span>
      <span class="vid__hint">Дивитися на YouTube</span>
    </button>

    <figcaption class="vid__cap">
      <Ico name="external-link" :size="14" />
      <a :href="video.url" target="_blank" rel="noopener noreferrer">Відкрити відео у YouTube</a>
    </figcaption>
  </figure>
</template>

<style scoped>
.vid { margin: 1.5rem 0 0; }

.vid__frame, .vid__poster {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--r-sm);
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--paper-3);
  padding: 0;
}

.vid__frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }

.vid__poster { cursor: pointer; }
.vid__poster img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s, filter .3s; }
.vid__poster:hover img { transform: scale(1.02); filter: brightness(.85); }
.vid__blank { position: absolute; inset: 0; background: var(--paper-3); }

.vid__play {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #fff;
  filter: drop-shadow(0 2px 12px rgb(0 0 0 / 55%));
  transition: transform .2s;
}
.vid__poster:hover .vid__play { transform: scale(1.12); }
.vid__play :deep(.ico) { width: 3.5rem; height: 3.5rem; stroke-width: 1.5; }

.vid__hint {
  position: absolute;
  left: .75rem;
  bottom: .75rem;
  padding: .3rem .6rem;
  border-radius: 100px;
  background: rgb(8 10 12 / 72%);
  color: #fff;
  font-family: var(--font-mono);
  font-size: .7rem;
  letter-spacing: .05em;
  text-transform: uppercase;
}

.vid__cap {
  display: flex;
  align-items: center;
  gap: .4rem;
  margin-top: .6rem;
  font-size: .85rem;
  color: var(--ink-3);
}
.vid__cap a { color: inherit; text-decoration: none; }
.vid__cap a:hover { color: var(--accent); text-decoration: underline; }
</style>
