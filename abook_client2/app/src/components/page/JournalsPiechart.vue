<template>
  <div>
    <NuxtLayout>
      <template #title>
        {{ month }}
        <select v-model="selectedFinanceDiv">
          <option
            v-for="{ value, label } of $tm('select.financeInOutDiv')"
            :key="value"
            :value="value"
            v-text="$rt(label)"
          />
        </select>
      </template>

      <div>
        <UiPieChart
          :dataset="dataset"
          @click="
            ({ id, selected }) =>
              (selectedAccountId = selected ? undefined : id)
          "
        />
      </div>

      <template #footer>
        <NuxtLink v-bind="prevMonth">
          {{ $t('actions.prev_month') }}
        </NuxtLink>
        <NuxtLink v-bind="nextMonth">
          {{ $t('actions.next_month') }}
        </NuxtLink>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import type { FinanceDiv } from '@abook/models'
import { FinanceDivs, JournalUtils } from '@abook/models'
import type { UseMonthlyJournalsState } from '~/composables/useMonthlyJournalsState'

const props = defineProps<UseMonthlyJournalsState>()

const selectedFinanceDiv = useState<FinanceDiv>(() => FinanceDivs.Expense)
const selectedAccountId = useState<string | undefined>()

const summary = computed(() =>
  JournalUtils.toSummaryOfFinance({
    journals: props.journals?.journals ?? [],
  }),
)

const dataset = computed(() => {
  return (
    summary.value.get(selectedFinanceDiv.value)?.accounts.map((account) => ({
      ...account,
      value: account.amount,
      selected: account.id === selectedAccountId.value,
    })) ?? []
  )
})

onBeforeUnmount(() => {
  selectedAccountId.value = undefined
})
</script>
