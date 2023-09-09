<template>
  <LayoutDefault>
    <template #title>
      {{ $t(`pages.accounts.${account.id ? 'edit' : 'new'}.title`) }}
    </template>
    <ul>
      <li>
        <label>{{ $t('form.avaliable') }}</label>
        <input v-model="account.avaliable" type="checkbox" />
      </li>
      <li>
        <label>{{ $t('form.financeName') }}</label>
        <select v-model="account.financeDiv">
          <option
            v-for="{ value, label } of $tm('select.financeDiv')"
            :key="value"
            :value="value"
            :disabled="!!account.id"
            v-text="$rt(label)"
          />
        </select>
      </li>
      <li>
        <label>{{ $t('form.color') }}</label>
        <input v-model="account.color" type="color" />
      </li>
      <li>
        <label>{{ $t('form.name') }}</label>
        <input v-model="account.name" type="text" />
      </li>
      <li v-if="showUseFee">
        <label>{{ $t('form.useFee') }}</label>
        <input v-model="account.useFee" type="checkbox" />
      </li>
      <li v-if="showUsuallyUsedForPayment">
        <label>{{ $t('form.usuallyUsedForPayment') }}</label>
        <input v-model="account.usuallyUsedForPayment" type="checkbox" />
      </li>
      <li>
        <label>{{ $t('form.usuallyUsedForReceipt') }}</label>
        <input v-model="account.usuallyUsedForReceipt" type="checkbox" />
      </li>
    </ul>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { AccountEditModel, FinanceDiv } from '~~/libs/models'

const route = useRoute()
const { getAccount, newAccount } = useAccountsStore()

const id = String(route.params.id)
const original = id === 'new' ? newAccount() : await getAccount(id)
const { cloned: account } = useCloned<AccountEditModel>(original)

const showUseFee = computed(() => account.value.financeDiv === 2)

const showUsuallyUsedForPayment = computed(
  () =>
    account.value.financeDiv === FinanceDiv.Assets ||
    account.value.financeDiv === FinanceDiv.Liabilities,
)
</script>
