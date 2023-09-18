<template>
  <LayoutDefault>
    <template #title>{{ period.period }}</template>
    <table>
      <thead>
        <th></th>
        <th v-for="month of balance.months" :key="month">
          {{ month }}
        </th>
      </thead>
      <tbody
        v-for="{
          financeDiv,
          summaries: finances,
          accounts,
        } of balance.summaries"
        :key="financeDiv"
      >
        <tr>
          <th>{{ $t(`select.financeDiv.${financeDiv}.label`) }}</th>
          <td v-for="{ month, amount } of finances" :key="month">
            {{ $n(amount) }}
          </td>
        </tr>
        <tr v-for="{ id, name, summaries } of accounts" :key="id">
          <th>{{ name }}</th>
          <td v-for="{ month, amount } of summaries" :key="month">
            {{ $n(amount) }}
          </td>
        </tr>
      </tbody>
    </table>
    <template #footer>
      <NuxtLink :to="{ params: { period: nextPeriod.period } }" :replace="true">
        {{ $t('actions.next_month') }}
      </NuxtLink>
      <NuxtLink :to="{ params: { period: prevPeriod.period } }" :replace="true">
        {{ $t('actions.prev_month') }}
      </NuxtLink>
    </template>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { toMonthlySummaryOfFinance } from '~~/libs/models/utils/journal'

const { abook, journals, allAccounts, period, prevPeriod, nextPeriod } =
  toReactive(usePeriodJournals())

const balance = computed(() =>
  toMonthlySummaryOfFinance({
    journals,
    accounts: allAccounts,
    abook: abook!,
    fromMonth: period.from,
    toMonth: period.to,
  }),
)
</script>
