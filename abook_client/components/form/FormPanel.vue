<template>
  <div class="contents">
    <component
      :is="tagName"
      :key="_uid"
      class="form"
      v-bind="$attrs"
      @click.self="blur"
    >
      <slot />
    </component>
  </div>
</template>

<script>
export default {
  props: {
    tagName: {
      type: String,
      default: 'div'
    }
  },
  methods: {
    blur () {
      const active = document.activeElement
      if (active) {
        active.blur()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/ui/form.scss";
.contents {
  padding: 15px 5px 10px;
  .form {
    @include __form;
  }
}
</style>
