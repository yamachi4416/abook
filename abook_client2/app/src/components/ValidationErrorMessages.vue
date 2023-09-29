<template>
  <ul v-if="has">
    <li v-for="(error, i) in errors" :key="i" v-text="error" />
  </ul>
</template>

<script setup lang="ts" generic="T">
import { ApiValidationErrorService } from '@abook/models'

type Errors = Pick<ApiValidationErrorService<T>, 'hasErrors' | 'getErrors'>

const props = defineProps<{
  errors: Errors
  name: Parameters<Errors['getErrors']>[0]
}>()

const has = computed(() => props.errors.hasErrors(props.name))
const errors = computed(() => props.errors.getErrors(props.name))
</script>
