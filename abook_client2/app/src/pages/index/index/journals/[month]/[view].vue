<template>
  <div>
    <PageJournalsTimeline
      v-if="$route.params.view === 'timeline'"
      v-bind="$props"
    />
    <PageJournalsCalendar
      v-if="$route.params.view === 'calendar'"
      v-bind="$props"
    />
    <PageJournalsPiechart
      v-if="$route.params.view === 'piechart'"
      v-bind="$props"
    />
  </div>
</template>

<script setup lang="ts">
import { ValidateUtils } from '@abook/models'
import type { UseMonthlyJournalsState } from '~/composables/useMonthlyJournalsState'

definePageMeta({
  validate(route) {
    return (
      ValidateUtils.validateMonth(String(route.params.month)) &&
      ['timeline', 'calendar', 'piechart'].includes(String(route.params.view))
    )
  },
})

defineProps<UseMonthlyJournalsState>()
</script>
