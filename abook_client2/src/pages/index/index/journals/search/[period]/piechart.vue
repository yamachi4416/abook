<template>
  <LayoutDefault>
    <template #title>
      {{ period.period }}
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
          ({ id, selected }) => (selectedAccountId = selected ? undefined : id)
        "
      />
    </div>

    <template #footer>
      <NuxtLink :to="{ params: { period: prevPeriod.period } }" :replace="true">
        {{ $t('actions.prev_month') }}
      </NuxtLink>
      <NuxtLink :to="{ params: { period: nextPeriod.period } }" :replace="true">
        {{ $t('actions.next_month') }}
      </NuxtLink>
    </template>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { FinanceDiv } from '~~/libs/models'
import { toSummaryOfFinance } from '~~/libs/models/utils/journal'

const selectedFinanceDiv = useState<FinanceDiv>(() => FinanceDiv.Income)
const selectedAccountId = useState<string | undefined>()

const { period, prevPeriod, nextPeriod, journals, allAccounts } = toReactive(
  usePeriodJournals(),
)

const summary = computed(() =>
  toSummaryOfFinance({ journals, accounts: allAccounts }),
)

const dataset = computed(() => {
  return summary.value
    .filter(({ financeDiv }) => financeDiv === selectedFinanceDiv.value)
    .flatMap(({ accounts }) => accounts)
    .filter(({ amount }) => amount > 0)
    .map((account) => ({
      ...account,
      value: account.amount,
      selected: account.id === selectedAccountId.value,
    }))
})

onBeforeUnmount(() => {
  selectedAccountId.value = undefined
})
</script>
