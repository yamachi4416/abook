<template>
  <LayoutDefault>
    <template #title>
      {{ $t(`pages.journals.${journal.id ? 'edit' : 'new'}.title`) }}
    </template>
    <ValidationErrorMessages :errors="errors" name="*" />
    <form @submit.prevent>
      <p>
        <label>{{ $t('form.accrualDate') }}</label>
        <input v-model="journal.accrualDate" type="date" />
        <ValidationErrorMessages :errors="errors" name="accrualDate" />
      </p>
      <p>
        <label>{{ $t('form.journalDiv') }}</label>
        <select v-model.number="journal.journalDiv">
          <option
            v-for="{ value, label } of $tm('select.journalDiv')"
            :key="value ?? 0"
            :value="value ?? undefined"
            v-text="$rt(label)"
          />
        </select>
        <ValidationErrorMessages :errors="errors" name="journalDiv" />
      </p>
      <p>
        <label>{{ $t(`form.debitAccount_${journal.journalDiv ?? ''}`) }}</label>
        <select v-model="journal.debitAccountId">
          <option></option>
          <option
            v-for="{ id, name } in debitAccounts"
            :key="id"
            :value="id"
            v-text="name"
          />
        </select>
        <ValidationErrorMessages :errors="errors" name="debitAccount" />
      </p>
      <p>
        <label>{{
          $t(`form.creditAccount_${journal.journalDiv ?? ''}`)
        }}</label>
        <select v-model="journal.creditAccountId">
          <option></option>
          <option
            v-for="{ id, name } in creditAccounts"
            :key="id"
            :value="id"
            v-text="name"
          />
        </select>
        <ValidationErrorMessages :errors="errors" name="creditAccount" />
      </p>
      <p v-if="journal.useFee && feeAccounts.length">
        <label>{{ $t('form.fee.account') }}</label>
        <select v-model="journal.feeAccountId">
          <option></option>
          <option
            v-for="{ id, name } in feeAccounts"
            :key="id"
            :value="id"
            v-text="name"
          />
        </select>
        <ValidationErrorMessages :errors="errors" :name="/fee\.acconut/" />
      </p>
      <p v-if="journal.feeAccountId">
        <label>{{ $t('form.fee.feeAmount') }}</label>
        <input v-model.number.lazy="journal.feeUseAmount" type="number" />
        <ValidationErrorMessages :errors="errors" :name="/fee\.amount/" />
      </p>
      <p>
        <label>
          {{ $t(`form.amount${journal.feeAccountId ? '_3f' : ''}`) }}
        </label>
        <input v-model.number.lazy="journal.amount" type="number" />
        <ValidationErrorMessages :errors="errors" name="amount" />
      </p>
      <p v-if="journal.feeAccountId">
        <label>{{ $t('form.fee.amount') }}</label>
        <input v-model.number.lazy="journal.feeAmount" type="number" />
        <ValidationErrorMessages :errors="errors" :name="/fee\.amount/" />
      </p>
      <p>
        <label>{{ $t('form.memo') }}</label>
        <textarea v-model="journal.memo" />
        <ValidationErrorMessages :errors="errors" name="memo" />
      </p>
    </form>
    <template #footer>
      <button @click="save">{{ $t('actions.save') }}</button>
    </template>
  </LayoutDefault>
</template>

<script setup lang="ts">
const {
  journal,
  debitAccounts,
  creditAccounts,
  feeAccounts,
  errors,
  saveJournal,
} = await useJournalEdit({
  id: String(useRoute().params.id),
})

async function save() {
  await saveJournal()
  if (!errors.hasErrors()) {
    // TODO:
    useRouter().back()
  }
}
</script>
