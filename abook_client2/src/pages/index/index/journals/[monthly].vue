<template>
  <NuxtPage
    :journals="journals"
    :monthly="monthly"
    :prev-monthly="prevMonthly"
    :next-monthly="nextMonthly"
    :accrual-date-start="accrualDateStart"
    :accrual-date-end="accrualDateEnd"
  />
</template>

<script setup lang="ts">
definePageMeta({
  validate(route) {
    return /^20[0-9][0-9](1[0-2]|0[1-9])$/.test(String(route.params.monthly))
  },
})

const {
  journals,
  monthly,
  prevMonthly,
  nextMonthly,
  accrualDateStart,
  accrualDateEnd,
  setMonthly,
} = useMonthlyJournals()

await setMonthly(String(useRoute().params.monthly))
</script>
