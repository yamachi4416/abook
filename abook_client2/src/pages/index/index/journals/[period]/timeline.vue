<template>
  <LayoutDefault>
    <template #title>{{ period.to }}</template>
    <dl>
      <template v-for="[date, items] in groups" :key="date">
        <dt>
          <DateFormat :value="date" format="YYYY/MM/DD (ddd)" />
        </dt>
        <dd>
          <ul>
            <li v-for="item in items" :key="item.id">
              <NuxtLink :to="`/journals/${item.id}`">
                <span>
                  {{ $t(`select.journalDiv.${item.journalDiv}.label`) }}
                </span>
                <span>{{ item.debitAccount.name }}</span>
                <span>{{ item.creditAccount.name }}</span>
                <span>{{ $n(item.amount - (item.fee?.amount ?? 0)) }}</span>
                <span v-if="item.fee">{{ item.fee.account.name }}</span>
                <span v-if="item.fee">{{ item.creditAccount.name }}</span>
                <span v-if="item.fee">{{ $n(item.fee.amount ?? 0) }}</span>
                <span v-if="item.memo" v-text="item.memo"></span>
              </NuxtLink>
            </li>
          </ul>
        </dd>
      </template>
    </dl>
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
import { parseDate } from '~~/libs/models/utils/date'

const { journals, period, prevPeriod, nextPeriod } = toReactive(
  useMonthlyJournals(),
)

const groups = computed(() => {
  const map = new Map<string, typeof journals>()

  for (const journal of journals) {
    if (map.has(journal.accrualDate)) {
      map.get(journal.accrualDate)?.push(journal)
    } else {
      map.set(journal.accrualDate, [journal])
    }
  }

  return [...map.entries()].map<[Date, typeof journals]>(([date, items]) => [
    parseDate(date, 'YYYY-MM-DD'),
    items,
  ])
})
</script>
