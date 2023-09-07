<template>
  <LayoutDefault>
    <template #title>{{ $t('pages.abooks.current.title') }}</template>
    <ul>
      <li>
        <label>{{ $t('form.name') }}</label>
        <input v-model="abook.name" />
      </li>
      <li>
        <label>{{ $t('form.startOfMonthIsPrev') }}</label>
        <select v-model="abook.startOfMonthIsPrev">
          <option
            v-for="{ value, label } of $tm('select.startOfMonthIs')"
            :key="value"
            :value="!!value"
            v-text="$rt(label)"
          />
        </select>
      </li>
      <li>
        <label>{{ $t('form.startOfMonthDate') }}</label>
        <select v-model="abook.startOfMonthDate">
          <option
            v-for="{ value, label } of startOfMonthDateOptions"
            :key="value"
            :value="value"
            v-text="label"
          />
        </select>
      </li>
      <li>
        <label>{{ $t('form.memo') }}</label>
        <textarea v-model="abook.memo" />
      </li>
    </ul>
    <template #footer>
      <button @click="save">{{ $t('actions.save') }}</button>
    </template>
  </LayoutDefault>
</template>

<script setup lang="ts">
import { Models } from '#imports'

const { fetchCurrent, newAbook, saveAbook } = useAbooksStore()

const original = (await fetchCurrent()) || newAbook()
const { cloned: abook } = useCloned<Models.AbookEditModel>(original)

const startOfMonthDateOptions = computed(() => {
  const { t } = useI18n()
  return Array.from(Array(28))
    .map((_, i) => ({
      label: t('label.startOfMonthDate', [i + 1]),
      value: i + 1,
    }))
    .concat([{ label: t('label.startOfMonthDateLast'), value: 30 }])
})

async function save() {
  try {
    await saveAbook(abook.value)
    useRouter().back()
  } catch (e) {
    // TODO: Error Handling
    console.log(e)
  }
}
</script>
