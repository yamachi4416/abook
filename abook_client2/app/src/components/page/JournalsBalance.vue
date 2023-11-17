<template>
  <div>
    <NuxtLayout>
      <template #title>{{ month }}</template>
      <div>
        <table>
          <thead>
            <th></th>
            <th v-for="{ month } of periods" :key="month">{{ month }}</th>
          </thead>
          <tbody v-for="finance of finances" :key="finance.financeDiv">
            <tr>
              <th>{{ $t(`select.financeDiv.${finance.financeDiv}.label`) }}</th>
              <td v-for="{ month, amount } of finance.amounts" :key="month">
                {{ $n(amount) }}
              </td>
            </tr>
            <tr
              v-for="{ account, amounts } of finance.accounts"
              :key="account.id"
            >
              <th>{{ account.name }}</th>
              <td v-for="{ month, amount } of amounts" :key="month">
                {{ $n(amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <template #footer>
        <NuxtLink v-bind="nextMonth">
          {{ $t('actions.next_month') }}
        </NuxtLink>
        <NuxtLink v-bind="prevMonth">
          {{ $t('actions.prev_month') }}
        </NuxtLink>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { JournalUtils } from '@abook/models'
import type { UseJournalsBalanceState } from '~/composables/useJournalsBalanceState'

const props = defineProps<UseJournalsBalanceState>()
const finances = computed(() =>
  JournalUtils.toJournalsBalanceTable({
    accounts: props.accounts,
    periods: props.periods,
    balances: props.balances,
  }),
)
</script>
