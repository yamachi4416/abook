<template>
  <LayoutDefault>
    <dl v-for="[date, items] in groups" :key="date">
      <dt>{{ date }}</dt>
      <dd>
        <ul>
          <li v-for="item in items" :key="item.id">
            <span>{{ $t(`select.journalDiv.${item.journalDiv}.label`) }}</span>
            <span>{{ item.debitAccount.name }}</span>
            <span>{{ item.creditAccount.name }}</span>
            <span>{{ item.amount - (item.fee?.amount ?? 0) }}</span>
            <span v-if="item.memo" v-text="item.memo"></span>
            <span v-if="item.fee">{{ item.fee.account.name }}</span>
            <span v-if="item.fee">{{ item.creditAccount.name }}</span>
            <span v-if="item.fee">{{ item.fee.amount }}</span>
          </li>
        </ul>
      </dd>
    </dl>
    <template #footer>
      <NuxtLink :to="`/journals/timeline/${prevFrom}`" :replace="true">
        {{ $t('actions.prev_month') }}
      </NuxtLink>
      <NuxtLink :to="`/journals/timeline/${nextFrom}`" :replace="true">
        {{ $t('actions.next_month') }}
      </NuxtLink>
    </template>
  </LayoutDefault>
</template>

<script setup lang="ts">
import {
  toEndOfMonthDate,
  toStartOfMonthDate,
} from '~~/libs/models/utils/abook'
import { formatDate, parseDate } from '~~/libs/models/utils/date'

const { searchJournals } = useJournalsStore()

const fromDate = parseDate(String(useRoute().params.from), 'YYYYMM')

const prevFrom = useDateFormat(
  new Date(fromDate.getFullYear(), fromDate.getMonth() - 1, 1),
  'YYYYMM',
)

const nextFrom = useDateFormat(
  new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 1),
  'YYYYMM',
)

const groups = await getJournalGroups(fromDate)

async function getJournalGroups(date: Date) {
  const abook = useAbooksStore().current!

  const accrualDateStart = formatDate(
    toStartOfMonthDate({ date, abook }),
    'YYYY-MM-DD',
  )
  const accrualDateEnd = formatDate(
    toEndOfMonthDate({ date, abook }),
    'YYYY-MM-DD',
  )

  const journals = await searchJournals({
    accrualDateStart,
    accrualDateEnd,
  })

  const map = new Map<string, typeof journals>()

  for (const journal of journals) {
    if (map.has(journal.accrualDate)) {
      map.get(journal.accrualDate)?.push(journal)
    } else {
      map.set(journal.accrualDate, [journal])
    }
  }

  return map
}
</script>
