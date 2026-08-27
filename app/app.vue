<script setup lang="ts">
import site from '~/data/site.json'

useHead({
  titleTemplate: (t) => (t ? `${t} — ${site.name}` : site.name),
})

useSeoMeta({
  ogSiteName: site.name,
  ogType: 'website',
  ogLocale: 'uk_UA',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
