<template>
  <div>
    <PageJournalsBalance v-bind="state" />
  </div>
</template>

<script setup lang="ts">
import {
  ValidateUtils,
  accountsService,
  journalsBalanceComponent,
  journalsService,
} from '@abook/models'

definePageMeta({
  validate(route) {
    return ValidateUtils.validateMonth(String(route.query.to))
  },
})

const { state } = await setup()

async function setup() {
  const api = useApiRequest()
  const { state, searchBalances } = journalsBalanceComponent({
    accountsService: accountsService({ api }),
    journalsService: journalsService({ api }),
    state: useJournalsBalanceState({
      month: computed(() => String(useRoute().query.to)),
      months: ref(6),
      abook: useCurrentAbookState().current,
    }),
  })

  let abort = new AbortController()

  await fetchBalances()

  watch(
    () => state.month,
    async () => {
      await fetchBalances()
    },
  )

  return {
    state,
  }

  async function fetchBalances() {
    abort?.abort()
    abort = new AbortController()
    if (ValidateUtils.validateMonth(state.month)) {
      await searchBalances({ signal: abort.signal })
    }
  }
}
</script>
