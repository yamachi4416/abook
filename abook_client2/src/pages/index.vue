<template>
  <NuxtPage />
</template>

<script setup lang="ts">
onMounted(async () => {
  const { syncUser } = useUsersStore()
  const { fetchCurrent } = useAbooksStore()
  await Promise.all([syncUser(), fetchCurrent()])
})
</script>
