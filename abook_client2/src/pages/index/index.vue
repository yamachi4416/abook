<template>
  <NuxtPage v-if="isAuthenticated" />
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth()

if (isAuthenticated.value) {
  const { syncUser } = useUsersStore()
  const { fetchCurrent } = useAbooksStore()
  await Promise.all([syncUser(), fetchCurrent()])
}
</script>
