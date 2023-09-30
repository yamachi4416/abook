<template>
  <NuxtPage v-bind="state" />
</template>

<script setup lang="ts">
import {
  ValidateUtils,
  journalsMonthlyComponent,
  journalsService,
} from '@abook/models'

definePageMeta({
  validate(route) {
    return ValidateUtils.validateMonth(String(route.params.month))
  },
})

const { state } = setup()

function setup() {
  const { state, searchJournals } = journalsMonthlyComponent({
    journalsService: journalsService({
      api: useApiRequest(),
    }),
    state: useMonthlyJournalsState({
      month: computed(() => String(useRoute().params.month)),
      abook: useCurrentAbookState().current,
    }),
  })

  const abort = new AbortController()

  onBeforeRouteUpdate(() => {
    abort.abort()
  })

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
