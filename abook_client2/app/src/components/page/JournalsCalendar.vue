<template>
  <div>
    <NuxtLayout>
      <template #title>{{ month }}</template>
      <div>
        <table>
          <tbody>
            <tr>
              <th>{{ $t('select.journalDiv.1.label') }}</th>
              <td>{{ $n(calendar.summary.income) }}</td>
              <th>{{ $t('select.journalDiv.2.label') }}</th>
              <td>{{ $n(calendar.summary.expense) }}</td>
              <th>{{ $t('label.balance') }}</th>
              <td>
                {{ $n(calendar.summary.income - calendar.summary.expense) }}
              </td>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th v-for="({ date }, i) in calendar.weeks?.[0]" :key="i">
                <DateFormat :value="date" format="ddd" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, w) in calendar.weeks" :key="w">
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
      </div>
      <template #footer>
        <NuxtLink v-bind="prevMonth">
          {{ $t('actions.prev_month') }}
        </NuxtLink>
        <NuxtLink to="/journals/new">
          {{ $t('actions.add') }}
        </NuxtLink>
        <NuxtLink v-bind="nextMonth">
          {{ $t('actions.next_month') }}
        </NuxtLink>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { JournalUtils } from '@abook/models'
import { type UseMonthlyJournalsState } from '~/composables/useMonthlyJournalsState'

const props = defineProps<UseMonthlyJournalsState>()
const calendar = computed(() =>
  JournalUtils.toJournalsCalendar({
    month: props.month ?? '',
    monthlyJournals: props.monthlyJournals,
  }),
)
</script>
