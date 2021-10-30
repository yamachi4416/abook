<template>
  <span v-if="hasError">
    <span v-for="(e, i) in items" :key="i" class="error-message">
      {{ e.error }}
    </span>
  </span>
</template>

<script>
import { Errors } from '@/modules/errors'

export default {
  props: {
    errors: {
      type: Errors,
      required: true
    },
    name: {
      type: [String, RegExp],
      required: true
    }
  },

  computed: {
    hasError() {
      return this.errors.hasError(this.name)
    },

    items() {
      return this.errors.getErrors(this.name)
    }
  }
}
</script>

<style lang="scss" scoped>
.error-message {
  color: var(--error-color);
  font-size: 0.8rem;
  display: block;
  padding-left: 0.3rem;
}
</style>
