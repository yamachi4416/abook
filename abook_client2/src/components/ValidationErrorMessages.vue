<template>
  <ul v-if="has">
    <li v-for="(error, i) in errors" :key="i" v-text="error" />
  </ul>
</template>

<script setup lang="ts" generic="T">
type Errors = Pick<
  ReturnType<typeof useApiValidationError<T>>,
  'hasErrors' | 'getErrors'
>

const props = defineProps<{
  name: Parameters<Errors['hasErrors']>[0]
  errors: Errors
}>()

const has = computed(() => props.errors.hasErrors(props.name))
const errors = computed(() => props.errors.getErrors(props.name))
</script>
