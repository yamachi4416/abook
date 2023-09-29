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

const { state } = setup()

function setup() {
  const { state, searchJournals } = journalsMonthlyComponent({
    journalsService: journalsService({
      api: useApiRequest(),
    }),
    state: useMonthlyJournalsState({
      abook: useCurrentAbookState().current,
    }),
  })

  const abort = new AbortController()

  onBeforeRouteUpdate(() => {
    abort.abort()
  })

  state.month = String(useRoute().params.month)

  Promise.all([
    searchJournals({ month: state.month, signal: abort.signal }),
    searchJournals({
      month: state.prevMonth.to.params.month,
      signal: abort.signal,
    }),
    searchJournals({
      month: state.nextMonth.to.params.month,
      signal: abort.signal,
    }),
  ])

  return {
    state,
  }
}
</script>
