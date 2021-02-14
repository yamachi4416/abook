<template>
  <span
    ref="select"
    class="select"
    tabindex="0"
    :class="{ inline }"
    @click.prevent="click()"
    @keypress.enter.prevent="click()"
    @keydown.up.prevent="step(-1)"
    @keydown.down.prevent="step(1)"
    @keydown.delete.prevent="clear()"
    v-text="disp"
  />
</template>

<script>
import SelectModal from './SelectModal'

export default {
  inheritAttrs: true,
  props: {
    inline: {
      type: Boolean,
      default: false
    },
    empty: {
      type: Array,
      default: () => ['', null]
    },
    options: {
      type: Array,
      required: true,
      default: () => []
    },
    mapper: {
      type: Function,
      default: (v, k) => [v, k]
    },
    value: {
      type: [Object, String, Number, Boolean, Date],
      default: null
    },
    matcher: {
      type: Function,
      default: (a, b) => a === b
    }
  },

  computed: {
    opts () {
      const r = this.options.map(this.mapper)
      if (this.empty) {
        return [this.empty, ...r]
      }

      return r
    },

    disp () {
      const x = this.find(this.options, this.value)
      return x ? x[0] : this.emptyLabel
    },

    emptyLabel () {
      return this.empty ? this.empty[0] : this.empty
    },

    emptyValue () {
      return this.empty ? this.empty[1] : this.empty
    }
  },

  watch: {
    options (newVal) {
      if (!this.find(newVal, this.value)) {
        this.$emit('input', this.emptyValue)
      }
    },

    value (newVal) {
      if (!this.find(this.options, newVal)) {
        this.$emit('input', this.emptyValue)
      }
    }
  },

  mounted () {
    this._modal = null
  },

  methods: {
    find (opts, val) {
      return (opts || []).map(this.mapper)
        .find(p => this.isMatch(p[1], val))
    },

    async open () {
      if (this.$attrs.disabled || this.$attrs.readonly) {
        this.$el.blur()
        return
      }

      if (this._modal) {
        await this._modal.close()
      }

      const m = new SelectModal({
        parent: this.$parent,
        propsData: {
          options: this.opts,
          value: this.value,
          matcher: this.isMatch
        }
      })

      m.$on('close', () => {
        this._modal = null
      })

      m.$on('change', async (val) => {
        this.$emit('input', val)
        this.$emit('change', val)
        await this.$nextTick()
      })

      const div = document.createElement('div')
      document.body.appendChild(div)
      m.$mount(div)

      this._modal = m
    },

    isMatch (a, b) {
      if (a === b) {
        return true
      }

      if (a && b) {
        return this.matcher(a, b)
      }

      return false
    },

    async step (i) {
      let idx = this.opts.findIndex(p => this.isMatch(p[1], this.value))
      if (idx !== -1) {
        idx += i
        if (idx >= 0 && idx < this.opts.length) {
          const val = this.opts[idx][1]
          this.$emit('input', val)
          this.$emit('change', val)
          await this.$nextTick()
        }
      }
    },

    async clear () {
      const val = this.emptyValue
      this.$emit('input', val)
      this.$emit('change', val)
      await this.$nextTick()
    },

    focus () {
      this.$refs.select.focus()
    },

    blur () {
      this.$refs.select.blur()
    },

    async click () {
      if (this._modal) {
        await this._modal.close()
      } else {
        await this.open()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/ui/inputs.scss";

.select {
  @include __input();

  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &[disabled] {
    &:focus,
    &:active {
      box-shadow: none;
      border-color: var(--border-color);
    }
  }

  &:empty {
    &::before {
      content: "";
      display: inline-block;
      height: 1em;
      width: 1em;
    }
  }

  &.inline {
    display: inline;
    font-weight: inherit;
    background: transparent;

    &,
    &:focus,
    &:active {
      border: none;
      outline: none;
      box-shadow: none;
    }

    &:focus,
    &:active {
      background-color: var(--focus-background);
    }
  }
}
</style>
