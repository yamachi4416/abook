<template>
  <Modal
    class="select-modal"
    @close="close()"
    @keydown="moveOnKey"
  >
    <div class="modal-options">
      <ul>
        <li v-for="(o, i) in options" :key="i">
          <label
            ref="items"
            :class="{ selected: matcher(o[1], val) }"
            @click="change(o[1])"
          >
            <div>
              <span class="name" v-text="o[0]" />
              <input type="radio" :name="_uid" :checked="matcher(o[1], val)">
            </div>
          </label>
        </li>
      </ul>
    </div>
  </Modal>
</template>

<script>
import Vue from 'vue'
import { ClosableMixin } from '@/modules/ui/mixins'

export default Vue.extend({
  mixins: [ClosableMixin],
  inheritAttrs: true,
  props: {
    options: {
      type: Array,
      required: true,
      default: () => []
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

  data () {
    return {
      val: this.value
    }
  },

  mounted () {
    this.$nextTick(() => {
      const idx = this.options.findIndex(p => this.matcher(p[1], this.val))
      if (idx >= 0 && idx < this.options.length) {
        this.$refs.items[idx].scrollIntoView({
          block: 'end',
          inline: 'nearest'
        })
      }
    })
  },

  methods: {
    async change (val) {
      this.val = val
      if (!this.matcher(this.value, this.val)) {
        this.$emit('change', this.val)
      }
      await this.close()
    },

    moveOnKey (event) {
      const keyCode = event.keyCode
      if (keyCode === 9 || keyCode === 38 || keyCode === 40) {
        event.preventDefault()
        let idx = this.options.findIndex(p => this.matcher(p[1], this.val))
        if (idx === -1) {
          idx = 0
        } else if ((keyCode === 9 && event.shiftKey) || keyCode === 38) {
          idx -= 1
        } else if (keyCode === 9 || keyCode === 40) {
          idx += 1
        }

        if (idx >= 0 && idx < this.options.length) {
          this.val = Array.from(this.options)[idx][1]
          this.$refs.items[idx].scrollIntoView({
            block: 'end',
            inline: 'nearest'
          })
        }
      } else if (keyCode === 13) {
        event.preventDefault()
        this.change(this.val)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.select-modal {
  .modal-content {
    align-items: center;
  }

  .modal-options {
    display: block;
    overflow-y: auto;
    width: 100%;
    max-width: calc(#{$max-layout-width} * 0.6);
    max-height: 100%;
    background: var(--them-foregraund);
    border-radius: 5px;
    margin: auto;

    ul {
      display: table;
      width: 100%;

      & > * {
        display: table-row;

        & > * {
          display: table-cell;
          border-bottom: 1px solid var(--them-color-border-sub);

          &.selected {
            background: var(--focus-background);
          }

          & > * {
            padding: 10px 15px;
            display: flex;
            align-items: center;

            .name {
              font-size: 1em;
              line-height: 1.7;
              flex-grow: 1;

              &:empty {
                height: calc(1rem * 1.7);
              }
            }

            input {
              width: 1.2em;
              min-width: 1.2em;
              height: 1.2em;
              min-height: 1.2em;
              appearance: none;
              border: 2px solid var(--input-border-color);
              border-radius: 100%;
              position: relative;
              outline: none;

              &:checked {
                border-color: var(--enable-border-color);

                &::after {
                  content: "";
                  display: inline-block;
                  position: absolute;
                  top: 15%;
                  left: 15%;
                  width: 70%;
                  height: 70%;
                  border-radius: 100%;
                  background: var(--enable-border-color);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
