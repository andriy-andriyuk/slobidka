<script setup lang="ts">
import icons from '~/data/icons.json'

const props = defineProps<{ name: string; size?: string | number }>()

const body = computed(() => (icons as Record<string, string>)[props.name] ?? '')
const px = computed(() => (props.size ? `${props.size}` : null))
</script>

<template>
  <svg
    class="ico"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    :style="px ? { width: px + 'px', height: px + 'px' } : undefined"
    v-html="body"
  />
</template>
