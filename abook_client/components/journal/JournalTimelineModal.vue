<template>
  <Modal
    class="journal-timeline-modal"
    :styles="{ 'padding-left': '5px', 'padding-right': '5px' }"
    @close="close()"
  >
    <div class="content">
      <JournalTimeline :items="items" />
    </div>
  </Modal>
</template>

<script>
import Vue from 'vue'
import { ClosableMixin } from '@/modules/ui/mixins'

export default Vue.extend({
  mixins: [ClosableMixin],
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';

.journal-timeline-modal {
  .content {
    width: 100%;
    max-width: calc(#{$max-layout-width} * 0.85);
    max-height: 100%;
    background: var(--them-foreground);
    overflow-y: auto;
    padding: 10px;
    border-radius: 10px;
  }
}
</style>
