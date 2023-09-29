<template>{{ value }}</template>

<script setup lang="ts">
import { formatDate } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    value: Date
    format: string
    locales?: string
  }>(),
  {
    locales: () => useI18n().locale.value,
  },
)

const value = computed(() =>
  formatDate(props.value, props.format, {
    locales: props.locales,
  }),
)
</script>
