<template>
  <NuxtPage v-if="isAuthenticated" />
</template>

<script setup lang="ts">
import { abooksService, usersService } from '@abook/models'

const { isAuthenticated } = await setup()

async function setup() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated.value) {
    const api = useApiRequest()
    const state = useCurrentAbookState()
    const { syncUser } = usersService({ api })
    const { fetchCurrent } = abooksService({ api, state })
    await Promise.all([syncUser(), fetchCurrent()])
  }

  return {
    isAuthenticated,
  }
}
</script>
