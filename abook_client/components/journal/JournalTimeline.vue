<template>
  <article class="timeline">
    <section v-for="t in items" :key="t.date" class="timeline-item">
      <h1
        class="timeline-item-title"
      >
        <span
          class="timeline-item-title-content"
          @click.prevent="$emit('daily', t.date)"
        >{{ t.date | dateformat('YYYY/MM/DD (ddd)') }}</span>
      </h1>
      <ul class="timeline-item-detail">
        <JournalListItem
          v-for="x in t.items"
          :key="x.id"
          :tag-name="'li'"
          :item="x"
          @click="edit"
        />
      </ul>
    </section>
  </article>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  methods: {
    async edit (item) {
      this.$emit('edit', item.id)
      await this.$nextTick()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "~assets/scss/ui/timeline.scss";

.timeline {
  @include __timeline;

  position: relative;

  &-item {
    &-title {
      &-content {
        cursor: pointer;
        padding: 3px 20px;
        font-size: 0.9em;
        color: var(--font-color);
        background: var(--them-foregraund);
        opacity: 0.8;
        border-radius: 20px;
      }
    }

    &-detail {
      border: 1px solid var(--them-color-border);
      background: var(--them-foregraund);
      padding: 10px 5px;
      border-radius: 20px;
    }

    page-break-inside: avoid;
  }
}
</style>
