<template>
  <LayoutDefault>
    <template #title>{{ period.period }}</template>
    <table>
      <tbody>
        <tr>
          <th>{{ $t('select.journalDiv.1.label') }}</th>
          <td>{{ $n(summary.income) }}</td>
          <th>{{ $t('select.journalDiv.2.label') }}</th>
          <td>{{ $n(summary.expense) }}</td>
          <th>{{ $t('select.journalDiv.3.label') }}</th>
          <td>{{ $n(summary.income - summary.expense) }}</td>
        </tr>
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th v-for="({ date }, i) in weeks?.[0]" :key="i">
            <DateFormat :value="date" format="ddd" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, w) in weeks" :key="w">
          <td v-for="({ date, day, sum }, d) in week" :key="d">
            <div>
              <DateFormat :value="date" :format="day == 1 ? 'M/D' : 'D'" />
            </div>
            <div>{{ $n(sum?.income ?? 0) }}</div>
            <div>{{ $n(sum?.expense ?? 0) }}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <template #footer>
      <NuxtLink :to="{ params: { period: prevPeriod.period } }" :replace="true">
        {{ $t('actions.prev_month') }}
      </NuxtLink>
      <NuxtLink to="/journals/new">
        {{ $t('actions.add') }}
      </NuxtLink>
      <NuxtLink :to="{ params: { period: nextPeriod.period } }" :replace="true">
        {{ $t('actions.next_month') }}
      </NuxtLink>
    </template>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { JournalDiv } from '~~/libs/models'
import { formatDate, toCalendar } from '~~/libs/models/utils/date'

const {
  period,
  calJournals,
  prevPeriod,
  nextPeriod,
  accrualDateStart,
  accrualDateEnd,
} = toReactive(useMonthlyJournals())

type Sums = {
  income: number
  expense: number
}

const daySums = computed(() => {
  const map = new Map<string, Sums>()

  for (const { accrualDate, journalDiv, amount, fee } of calJournals) {
    const sum: Sums = map.get(accrualDate) ?? {
      income: 0,
      expense: 0,
    }

    if (journalDiv === JournalDiv.Income) {
      sum.income += amount
    } else if (journalDiv === JournalDiv.Expense) {
      sum.expense += amount
    } else if (journalDiv === JournalDiv.Transfer) {
      sum.expense += fee?.amount ?? 0
    }

    map.set(accrualDate, sum)
  }

  return map
})

const weeks = computed(() => {
  if (accrualDateStart && accrualDateEnd) {
    const sums = daySums.value
    return toCalendar({
      beginDate: accrualDateStart,
      endDate: accrualDateEnd,
    }).map((week) =>
      week.map((date) => ({
        ...date,
        sum: sums.get(formatDate(date.date, 'YYYY-MM-DD')),
      })),
    )
  }
  return []
})

const summary = computed(() =>
  weeks.value
    .flatMap((week) => week)
    .filter(({ between }) => between)
    .reduce<Sums>(
      ({ income, expense }, { sum }) => ({
        income: income + (sum?.income ?? 0),
        expense: expense + (sum?.expense ?? 0),
      }),
      {
        income: 0,
        expense: 0,
      },
    ),
)
</script>
