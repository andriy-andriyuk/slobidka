<script setup lang="ts">
import timelines from '~/data/timelines.json'

const timeline = timelines.find((t) => t.id === 'crime-story-details')!

useHead({ title: timeline.title })
useSeoMeta({
  description: 'Повна хронологія захоплення 7,07 га берега Дніпра на Микільській Слобідці: рішення Київради, банкрутства, застава в Ощадбанку, аукціони, суди та спротив громади.',
  ogImage: '/media/2017/08/2007_LATEST.png',
})
</script>

<template>
  <TimelinePage
    :timeline="timeline"
    eyebrow="Повне розслідування"
    lead="Рік за роком: як земля, відведена під парк та громадські пляжі, змінювала власників, цільове призначення й опинилася під забудовою. З посиланнями на рішення, реєстри та документи." />
</template>
