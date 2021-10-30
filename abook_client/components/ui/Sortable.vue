<template>
  <compnent :is="tagName" v-bind="$attrs">
    <slot name="default"></slot>
  </compnent>
</template>

<script>
import Sortable from 'sortablejs'

export default {
  inheritAttrs: true,
  props: {
    tagName: {
      type: String,
      default: 'dev'
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    handle: {
      type: String,
      required: false,
      default: null
    },
    items: {
      type: Array,
      required: false,
      default: null
    },
    groupKeys: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  watch: {
    disabled: {
      handler(val, oldVal) {
        this.start()
      }
    }
  },
  mounted() {
    this.start()
  },
  beforeDestroy() {
    this.end()
  },
  methods: {
    start() {
      if (this.disabled) {
        this.end()
        return
      }
      this.end()

      function index(el) {
        if (!el || !el.parentElement) {
          return -1
        }

        return [...el.parentElement.children].indexOf(el)
      }

      this._sortable = new Sortable(this.$el, {
        delay: 0,
        animation: 150,
        handle: this.handle,
        forceFallback: true,
        dragClass: 'drag-class',

        setData: dataTransfer => {
          dataTransfer.setData('text', '')
          dataTransfer.setDragImage(document.createElement('p'), 0, 0)
        },

        onStart: async evt => {
          this.$emit('dragstart', evt)
          await this.$nextTick()
        },

        onMove: (evt, originalEvent) => {
          if (this.items) {
            const items = Array.from(this.items)
            const [oldIndex, newIndex] = [
              index(evt.dragged),
              index(evt.related)
            ]
            const a1 = items[oldIndex]
            const a2 = items[newIndex]
            if (a1 && a2) {
              return !this.groupKeys.some(k => a1[k] !== a2[k])
            }
          }
        },

        onUpdate: async evt => {
          this.$emit('dragend', evt)
          await this.$nextTick()
        }
      })
    },

    end() {
      if (this._sortable) {
        this._sortable.destroy()
        this._sortable = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.drag-class {
  display: none !important;
}
</style>
