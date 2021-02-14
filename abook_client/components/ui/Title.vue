<template>
  <div class="title">
    <div class="btn">
      <button
        v-if="!['/', '/menu', '/login'].includes($route.path)"
        data-icon="arrow_back"
        @click.once="back()"
      />
    </div>
    <h1 class="content">
      <slot name="default" />
    </h1>
    <div class="btn" />
  </div>
</template>

<script>
import { BackableMixin } from '@/modules/ui/mixins'

export default {
  mixins: [BackableMixin],
  props: {
    prev: {
      type: Boolean,
      required: false,
      default: false
    },
    next: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.title {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;

  .content {
    flex-grow: 1;
    overflow: hidden;
    line-height: $header-height;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .btn {
    height: $header-height;
    width: calc(#{$header-height} * 1.2);
    min-width: calc(#{$header-height} * 1.2);
  }
}

@media print {
  .title {
    .btn {
      display: none;
    }
  }
}
</style>
