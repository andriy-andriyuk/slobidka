<script setup lang="ts">
// Ця сторінка існує лише для того, щоб зібрати справжній 404.html:
// після генерації scripts/postbuild.mjs переносить її у корінь і прибирає теку.
useHead({
  title: 'Сторінку не знайдено',
  meta: [{ name: 'robots', content: 'noindex' }],
})
</script>

<template>
  <NotFound :code="404" />
</template>
