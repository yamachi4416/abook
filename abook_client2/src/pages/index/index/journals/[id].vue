<template>
  <LayoutDefault>
    <ValidationErrorMessages :errors="errors" name="*" />
    <ul>
      <li>
        <label>{{ $t('form.accrualDate') }}</label>
        <input v-model="journal.accrualDate" type="date" />
        <ValidationErrorMessages :errors="errors" name="accrualDate" />
      </li>
      <li>
        <label>{{ $t('form.journalDiv') }}</label>
        <select v-model="journal.journalDiv">
          <option
            v-for="{ value, label } of $tm('select.journalDiv')"
            :key="value ?? 0"
            :value="value ?? undefined"
            v-text="$rt(label)"
          />
        </select>
        <ValidationErrorMessages :errors="errors" name="journalDiv" />
      </li>
      <li>
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
      </li>
      <li>
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
      </li>
      <li v-if="journal.useFee && feeAccounts.length">
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
      </li>
      <li v-if="journal.feeAccountId">
        <label>{{ $t('form.fee.feeAmount') }}</label>
        <input v-model.number.lazy="journal.feeUseAmount" type="number" />
        <ValidationErrorMessages :errors="errors" :name="/fee\.amount/" />
      </li>
      <li>
        <label>
          {{ $t(`form.amount${journal.feeAccountId ? '_3f' : ''}`) }}
        </label>
        <input v-model.number.lazy="journal.amount" type="number" />
        <ValidationErrorMessages :errors="errors" name="amount" />
      </li>
      <li v-if="journal.feeAccountId">
        <label>{{ $t('form.fee.amount') }}</label>
        <input v-model.number.lazy="journal.feeAmount" type="number" />
        <ValidationErrorMessages :errors="errors" :name="/fee\.amount/" />
      </li>
    </ul>
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
