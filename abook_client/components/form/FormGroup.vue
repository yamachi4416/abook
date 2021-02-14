<template>
  <div class="form-group" :invalid="hasError">
    <label v-text="label" />
    <slot />
    <ErrorMessages v-if="errors" :name="errorName" :errors="errors" />
  </div>
</template>

<script>
export default {
  props: {
    object: {
      type: String,
      required: true
    },
    field: {
      type: String,
      required: true
    },
    pattern: {
      type: String,
      default: null
    },
    labelField: {
      type: String,
      default: null
    },
    errors: {
      type: Object,
      default: null
    }
  },
  computed: {
    label () {
      const field = this.labelField || this.field
      if (this.$te(`${this.object}.${field}`)) {
        return this.$t(`${this.object}.${field}`)
      } else {
        return this.$t(`form.${field}`)
      }
    },
    errorName () {
      if (this.pattern) {
        return new RegExp(`^${this.object}\\.${this.pattern}`)
      }

      return `${this.object}.${this.field}`
    },
    hasError () {
      if (!this.errors) {
        return false
      }

      if (this.pattern) {
        const regexp = new RegExp(`^${this.object}\\.${this.pattern}`)
        return this.errors.hasError(regexp)
      }

      return this.errors.hasError(`${this.object}.${this.field}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/ui/inputs.scss";

.form-group {
  width: 100%;
  padding: 5px;

  label {
    display: block;
    width: 100%;
    color: var(--font-color);
    padding: 0;
    padding-bottom: 5px;
    white-space: nowrap;
  }

  &[invalid] {
    select,
    textarea,
    input,
    .select,
    .input {
      border-color: var(--error-color);
    }
  }

  input {
    @include __input();
  }

  select {
    @include __select();
  }

  textarea {
    @include __textarea();
  }
}
</style>
