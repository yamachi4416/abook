<template>
  <LayoutDefault>
    <template #title>{{ monthly }}</template>
    <dl>
      <template v-for="[date, items] in groups" :key="date">
        <dt>{{ date }}</dt>
        <dd>
          <ul>
            <li v-for="item in items" :key="item.id">
              <span>{{
                $t(`select.journalDiv.${item.journalDiv}.label`)
              }}</span>
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
      </template>
    </dl>
    <template #footer>
      <NuxtLink :to="{ params: { monthly: prevMonthly } }" :replace="true">
        {{ $t('actions.prev_month') }}
      </NuxtLink>
      <NuxtLink :to="{ params: { monthly: nextMonthly } }" :replace="true">
        {{ $t('actions.next_month') }}
      </NuxtLink>
    </template>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { JournalViewModel } from '~~/libs/models'

const props = defineProps<{
  journals: JournalViewModel[]
  monthly?: string
  prevMonthly?: string
  nextMonthly?: string
}>()

const groups = computed(() => {
  const journals = props.journals

  const map = new Map<string, typeof journals>()

  for (const journal of journals) {
    if (map.has(journal.accrualDate)) {
      map.get(journal.accrualDate)?.push(journal)
    } else {
      map.set(journal.accrualDate, [journal])
    }
  }

  return map
})
</script>
