<template>
  <div>
    <NuxtLayout>
      <template #title>
        {{ $t(`pages.accounts.${account.id ? 'edit' : 'new'}.title`) }}
      </template>
      <ValidationErrorMessages :errors="errors" name="*" />
      <form @submit.prevent>
        <p>
          <label>{{ $t('form.avaliable') }}</label>
          <input v-model="account.avaliable" type="checkbox" />
          <ValidationErrorMessages :errors="errors" name="avaliable" />
        </p>
        <p>
          <label>{{ $t('form.financeName') }}</label>
          <select v-model.number="account.financeDiv">
            <option
              v-for="{ value, label } of $tm('select.financeDiv')"
              :key="value"
              :value="value"
              :disabled="!!account.id"
              v-text="$rt(label)"
            />
          </select>
          <ValidationErrorMessages :errors="errors" name="financeDiv" />
        </p>
        <p>
          <label>{{ $t('form.color') }}</label>
          <input v-model="account.color" type="color" />
          <ValidationErrorMessages :errors="errors" name="color" />
        </p>
        <p>
          <label>{{ $t('form.name') }}</label>
          <input v-model="account.name" type="text" />
          <ValidationErrorMessages :errors="errors" name="name" />
        </p>
        <p v-if="account.isEnableUseFee">
          <label>{{ $t('form.useFee') }}</label>
          <input v-model="account.useFee" type="checkbox" />
          <ValidationErrorMessages :errors="errors" name="useFee" />
        </p>
        <p v-if="account.isEnableUsuallyUsedForPayment">
          <label>{{ $t('form.usuallyUsedForPayment') }}</label>
          <input v-model="account.usuallyUsedForPayment" type="checkbox" />
          <ValidationErrorMessages
            :errors="errors"
            name="usuallyUsedForPayment"
          />
        </p>
        <p>
          <label>{{ $t('form.usuallyUsedForReceipt') }}</label>
          <input v-model="account.usuallyUsedForReceipt" type="checkbox" />
          <ValidationErrorMessages
            :errors="errors"
            name="usuallyUsedForReceipt"
          />
        </p>
      </form>
      <template #footer>
        <button @click="save">{{ $t('actions.save') }}</button>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import {
  AccountEditState,
  ValidateUtils,
  accountEditComponent,
  accountsService,
} from '@abook/models'

definePageMeta({
  validate(route) {
    const id = String(route.params.id)
    return id === 'new' || ValidateUtils.validateId(id)
  },
})

const { account, errors, save } = await setup()

async function setup() {
  const { state, errors, readAccount, saveAccount } =
    accountEditComponent<AccountEditState>({
      accountsService: accountsService({ api: useApiRequest() }),
      state: toReactive({
        original: ref(),
        acconut: ref(),
        editor: ref(),
        errors: ref(),
      }),
    })

  const id = String(useRoute().params.id)
  await readAccount({ id: id === 'new' ? undefined : id })

  if (!state.editor) {
    throw createError({ statusCode: 404 })
  }

  return {
    account: state.editor,
    errors,
    save,
  }

  async function save() {
    await saveAccount()
    if (!errors.hasErrors()) {
      useRouter().back()
    }
  }
}
</script>
