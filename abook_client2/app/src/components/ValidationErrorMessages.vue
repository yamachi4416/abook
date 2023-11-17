<template>
  <ul v-if="has">
    <li v-for="(error, i) in errors" :key="i" v-text="error" />
  </ul>
</template>

<script setup lang="ts" generic="O, T extends ValidationErrors<O>">
import type { ValidationErrors } from '@abook/models'

type Errors = Pick<T, 'hasErrors' | 'getErrors'>
type Names = Parameters<Errors['getErrors']>[0]

const props = defineProps<{
  errors: Errors
  name: Names
}>()

const has = computed(() => props.errors.hasErrors(props.name))
const errors = computed(() => props.errors.getErrors(props.name))
</script>
