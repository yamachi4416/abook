<template>
  <div>
    <NuxtLayout>
      <template #title>
        {{ month }}
      </template>
      <div>
        <dl>
          <template
            v-for="{ date, accrualDate, journals } of timeline"
            :key="accrualDate"
          >
            <dt>
              <DateFormat :value="date" format="YYYY/MM/DD (ddd)" />
            </dt>
            <dd>
              <ul>
                <li v-for="item in journals" :key="item.id">
                  <NuxtLink :to="`/journals/${item.id}`">
                    <span>
                      {{ $t(`select.journalDiv.${item.journalDiv}.label`) }}
                    </span>
                    <span>{{ item.debitAccount.name }}</span>
                    <span>{{ item.creditAccount.name }}</span>
                    <span>{{ $n(item.amount - (item.fee?.amount ?? 0)) }}</span>
                    <template v-if="item.fee">
                      <span>{{ item.fee.account.name }}</span>
                      <span>{{ item.creditAccount.name }}</span>
                      <span>{{ $n(item.fee.amount ?? 0) }}</span>
                    </template>
                    <span v-if="item.memo" v-text="item.memo"></span>
                  </NuxtLink>
                </li>
              </ul>
            </dd>
          </template>
        </dl>
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
const timeline = computed(() =>
  JournalUtils.toJournalsTimeline({
    journals: props.journals?.journals ?? [],
  }),
)
</script>
