<template>
  <div v-if="!isAuthenticated">
    <h1>{{ $t('pages.others.login.title') }}</h1>
    <NuxtLink to="/auth/signIn">SignIn</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated } = useAuth()
</script>
