<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

useHead({ title: props.error?.statusCode === 404 ? 'Сторінку не знайдено' : 'Помилка' })
</script>

<template>
  <NuxtLayout>
    <NotFound :code="error?.statusCode ?? 500" :message="error?.statusMessage" />
  </NuxtLayout>
</template>
