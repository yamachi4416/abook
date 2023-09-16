<template>
  <LayoutDefault>
    <template #title>{{ $t('pages.abooks.current.title') }}</template>
    <ValidationErrorMessages :errors="errors" name="*" />
    <form @submit.prevent>
      <p>
        <label>{{ $t('form.name') }}</label>
        <input v-model="abook.name" />
        <ValidationErrorMessages :errors="errors" name="name" />
      </p>
      <p>
        <label>{{ $t('form.startOfMonthIsPrev') }}</label>
        <select v-model="abook.startOfMonthIsPrev">
          <option
            v-for="{ value, label } of $tm('select.startOfMonthIs')"
            :key="value"
            :value="!!value"
            v-text="$rt(label)"
          />
        </select>
        <ValidationErrorMessages :errors="errors" name="startOfMonthIsPrev" />
      </p>
      <p>
        <label>{{ $t('form.startOfMonthDate') }}</label>
        <select v-model="abook.startOfMonthDate">
          <option
            v-for="i of 28"
            :key="i"
            :value="i"
            v-text="$t('label.startOfMonthDate', [i])"
          />
          <option :value="30">{{ $t('label.startOfMonthDateLast') }}</option>
        </select>
        <ValidationErrorMessages :errors="errors" name="startOfMonthDate" />
      </p>
      <p>
        <label>{{ $t('form.memo') }}</label>
        <textarea v-model="abook.memo" />
        <ValidationErrorMessages :errors="errors" name="memo" />
      </p>
    </form>
    <template #footer>
      <button @click="save">{{ $t('actions.save') }}</button>
    </template>
  </LayoutDefault>
</template>

<script setup lang="ts">
const { abook, save, errors } = await useAbookEdit()
</script>
