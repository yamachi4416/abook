<template>
  <LayoutDefault>
    <template #title>{{ $t('pages.settings.users.title') }}</template>
    <form @submit.prevent>
      <fieldset>
        <legend>{{ $t('pages.settings.users.section-users') }}</legend>
        <img :src="user?.photoURL ?? undefined" />
        <dl>
          <dt>{{ $t('form.displayName') }}</dt>
          <dd>{{ user?.displayName }}</dd>
          <dt>{{ $t('form.email') }}</dt>
          <dd>{{ user?.email }}</dd>
        </dl>
      </fieldset>
      <fieldset>
        <legend>{{ $t('pages.settings.users.section-terminal') }}</legend>
        <dl>
          <dt>{{ $t('form.locale') }}</dt>
          <dd>
            <select v-model="locale">
              <option
                v-for="{ code, name } in locales"
                :key="code"
                :value="code"
                v-text="name"
              />
            </select>
          </dd>
          <dt>{{ $t('form.tax1') }}</dt>
          <dd>
            <select v-model="settings['calc.tax1']">
              <option
                v-for="tax in taxes"
                :key="tax"
                :value="tax"
                v-text="`${tax} %`"
              />
            </select>
          </dd>
          <dt>{{ $t('form.tax2') }}</dt>
          <dd>
            <select v-model="settings['calc.tax2']">
              <option
                v-for="tax in taxes"
                :key="tax"
                :value="tax"
                v-text="`${tax} %`"
              />
            </select>
          </dd>
        </dl>
      </fieldset>
    </form>
  </LayoutDefault>
</template>

<script setup lang="ts">
const { user } = useAuth()
const { settings, flush } = useSettings()
const {
  setLocale,
  setLocaleCookie,
  locale: _locale,
  locales: _locales,
} = useI18n()

const locales = computed(
  () => _locales.value as unknown as { code: string; name: string }[],
)

const locale = computed({
  get() {
    return _locale.value
  },
  set(value: string) {
    setLocale(value)
    setLocaleCookie(value)
  },
})

const taxes = Array.from({ length: 50 }, (_, k) => String(k + 1))

onBeforeRouteLeave(() => {
  flush()
})
</script>
