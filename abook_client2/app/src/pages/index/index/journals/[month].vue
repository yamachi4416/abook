<template>
  <NuxtPage v-bind="state" />
</template>

<script setup lang="ts">
import { journalsMonthlyComponent, journalsService } from '@abook/models'

definePageMeta({
  validate(route) {
    return /2[0-9]{3}1[0-2]|0[1-9]/.test(String(route.params.month))
  },
})

const { state, searchJournals } = journalsMonthlyComponent({
  journalsService: journalsService({
    api: useApiRequest(),
  }),
  state: useMonthlyJournalsState({
    abook: useCurrentAbookState().current,
  }),
})

const currentMonth = String(useRoute().params.month)

state.month = currentMonth

Promise.all([
  searchJournals(currentMonth),
  searchJournals(state.prevMonth.to.params.month),
  searchJournals(state.nextMonth.to.params.month),
])
</script>
