<template>
  <LayoutDefault>
    <template #title>{{ $t('pages.abooks.current.title') }}</template>
    <dl>
      <dt>{{ $t('form.name') }}</dt>
      <dd>
        <input v-model="abook.name" />
      </dd>
      <dt>{{ $t('form.startOfMonthIsPrev') }}</dt>
      <dd>
        <select v-model="abook.startOfMonthIsPrev">
          <option
            v-for="{ value, label } of $tm('select.startOfMonthIs')"
            :key="value"
            :value="!!value"
            v-text="$rt(label)"
          />
        </select>
      </dd>
      <dt>{{ $t('form.startOfMonthDate') }}</dt>
      <dd>
        <select v-model="abook.startOfMonthDate">
          <option
            v-for="{ value, label } of startOfMonthDateOptions"
            :key="value"
            :value="value"
            v-text="label"
          />
        </select>
      </dd>
      <dt>{{ $t('form.memo') }}</dt>
      <dd>
        <textarea v-model="abook.memo" />
      </dd>
    </dl>
    <template #footer>
      <button @click="save">{{ $t('actions.save') }}</button>
    </template>
  </LayoutDefault>
</template>

<script setup lang="ts">
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
