<template>
  <NuxtPage />
</template>

<script setup lang="ts">
definePageMeta({
  validate(route) {
    const m = /20[0-9][0-9](?:1[0-2]|0[1-9](?:[012][0-9])?)/.source
    const regxp = new RegExp(`^(?:${m})|(?:${m}-${m})$`)
    return regxp.test(String(route.params.period))
  },
})

await useMonthlyJournals().setPeriod(String(useRoute().params.period))
</script>
