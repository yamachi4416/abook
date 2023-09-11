<template>
  <LayoutDefault>
    <template #title>
      {{ $t(`pages.accounts.${account.id ? 'edit' : 'new'}.title`) }}
    </template>
    <ValidationErrorMessages :errors="errors" name="*" />
    <ul>
      <li>
        <label>{{ $t('form.avaliable') }}</label>
        <input v-model="account.avaliable" type="checkbox" />
        <ValidationErrorMessages :errors="errors" name="avaliable" />
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
        <ValidationErrorMessages :errors="errors" name="financeDiv" />
      </li>
      <li>
        <label>{{ $t('form.color') }}</label>
        <input v-model="account.color" type="color" />
        <ValidationErrorMessages :errors="errors" name="color" />
      </li>
      <li>
        <label>{{ $t('form.name') }}</label>
        <input v-model="account.name" type="text" />
        <ValidationErrorMessages :errors="errors" name="name" />
      </li>
      <li v-if="account.isEnableUseFee">
        <label>{{ $t('form.useFee') }}</label>
        <input v-model="account.useFee" type="checkbox" />
        <ValidationErrorMessages :errors="errors" name="useFee" />
      </li>
      <li v-if="account.isEnableUsuallyUsedForPayment">
        <label>{{ $t('form.usuallyUsedForPayment') }}</label>
        <input v-model="account.usuallyUsedForPayment" type="checkbox" />
        <ValidationErrorMessages
          :errors="errors"
          name="usuallyUsedForPayment"
        />
      </li>
      <li>
        <label>{{ $t('form.usuallyUsedForReceipt') }}</label>
        <input v-model="account.usuallyUsedForReceipt" type="checkbox" />
        <ValidationErrorMessages
          :errors="errors"
          name="usuallyUsedForReceipt"
        />
      </li>
    </ul>
    <template #footer>
      <button @click="save">{{ $t('actions.save') }}</button>
    </template>
  </LayoutDefault>
</template>

<script setup lang="ts">
const { account, saveAccount, errors } = await useAccountEdit({
  id: String(useRoute().params.id),
})

async function save() {
  await saveAccount()
  if (!errors.hasErrors()) {
    useRouter().push('/accounts')
  }
}
</script>
