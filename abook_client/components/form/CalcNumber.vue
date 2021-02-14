<template>
  <span
    v-bind="$attrs"
    class="input"
    tabindex="0"
    @click.prevent="open()"
    @keypress.enter.prevent="open()"
    @keypress.space.prevent="open()"
    @keydown="keydown"
  >
    {{ value | comma }}
  </span>
</template>

<script>
import Calculator from '@/components/ui/Calculator'

export default {
  props: {
    value: {
      type: Number,
      default: null
    },
    maxlength: {
      type: Number,
      default: 16
    }
  },

  methods: {
    open () {
      const m = new Calculator({
        parent: this.$parent,
        propsData: {
          maxlength: this.maxlength,
          value: this.value
        }
      })

      m.$on('input', (val) => {
        const v = Math.trunc(val) || 0
        this.$emit('input', v)
        if (this.value !== v) {
          this.$emit('change', v)
        }
      })

      const div = document.createElement('div')
      document.body.appendChild(div)
      m.$mount(div)
    },

    async keydown (event) {
      const c = event.keyCode
      const cc = c + (event.shiftKey ? 1000 : 0) + (event.ctrlKey ? 10000 : 0)

      const val = Number(this.value)
      if (c >= 48 && c <= 57) {
        event.preventDefault()
        const s = (this.value || '') + '' + (c - 48)
        if (s.length <= this.maxlength) {
          this.$emit('input', Number(s))
        }
      } else if (c >= 96 && c <= 105) {
        event.preventDefault()
        const s = (this.value || '') + '' + (c - 96)
        if (s.length <= this.maxlength) {
          this.$emit('input', Number(s))
        }
      } else if (cc === 8) {
        event.preventDefault()
        if (val === 0) {
          this.$emit('input', null)
        } else if (this.value) {
          const s = String(this.value)
          const n = s.substr(0, s.length - 1)
          this.$emit('input', n ? Number(n) : null)
        }
      } else if (cc === 46 || cc === 10008) {
        event.preventDefault()
        if (this.value != null) {
          this.$emit('input', null)
        }
      }

      if (val !== this.value) {
        this.$emit('change', this.value)
      }

      await this.$nextTick()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/ui/inputs.scss";

.input {
  @include __input();

  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
