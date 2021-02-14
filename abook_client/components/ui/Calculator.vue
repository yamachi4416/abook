<template>
  <Modal
    class="calculator-modal"
    :styles="{ 'padding-left': '5px', 'padding-right': '5px' }"
    @close="close()"
    @keydown="keyEvent"
  >
    <div class="calculator">
      <div class="calculator-display">
        <div class="calculator-display-progress">
          <div>
            <span v-for="(d, i) in progress" :key="`calc-${i}`">
              {{ d | comma }}
            </span>
          </div>
        </div>
        <div class="calculator-display-in">
          {{ val | comma }}
        </div>
      </div>

      <table class="calculator-keys">
        <tr>
          <td>
            <button
              :class="{ on: filter === 'ceil' }"
              @click="toggleFilter('ceil')"
              @touchend.prevent="$event.target.click()"
              v-text="$t('calc.roundUp')"
            />
          </td>
          <td>
            <button
              :class="{ on: filter === 'floor' }"
              @click="toggleFilter('floor')"
              @touchend.prevent="$event.target.click()"
              v-text="$t('calc.roundDown')"
            />
          </td>
          <td>
            <button
              :class="{ on: filter === 'round' }"
              @click="toggleFilter('round')"
              @touchend.prevent="$event.target.click()"
              v-text="$t('calc.round')"
            />
          </td>
          <td>
            <button
              ref="key_ok"
              @click="ok()"
              @touchend.prevent="$event.target.click()"
              v-text="'OK'"
            />
          </td>
        </tr>

        <tr>
          <td>
            <button
              @click="inP('÷', '×', tax1)"
              @touchend.prevent="$event.target.click()"
              v-text="`-${labelTax1}%`"
            />
          </td>
          <td>
            <button
              @click="inP('×', '÷', tax1)"
              @touchend.prevent="$event.target.click()"
              v-text="`+${labelTax1}%`"
            />
          </td>
          <td>
            <button
              @click="inP('÷', '×', tax2)"
              @touchend.prevent="$event.target.click()"
              v-text="`-${labelTax2}%`"
            />
          </td>
          <td>
            <button
              @click="inP('×', '÷', tax2)"
              @touchend.prevent="$event.target.click()"
              v-text="`+${labelTax2}%`"
            />
          </td>
        </tr>

        <tr>
          <td>
            <button
              ref="key_ce"
              @click="delCe()"
              @touchend.prevent="$event.target.click()"
              v-text="'CE'"
            />
          </td>
          <td>
            <button
              ref="key_ca"
              @click="clear()"
              @touchend.prevent="$event.target.click()"
              v-text="'CA'"
            />
          </td>
          <td>
            <button
              ref="key_del"
              @click="del()"
              @touchend.prevent="$event.target.click()"
              v-text="'DEL'"
            />
          </td>
          <td>
            <button
              ref="key_div"
              @click="inN('÷')"
              @touchend.prevent="$event.target.click()"
              v-text="'÷'"
            />
          </td>
        </tr>

        <tr>
          <td>
            <button
              ref="key_7"
              @click="inN('7')"
              @touchend.prevent="$event.target.click()"
              v-text="'7'"
            />
          </td>
          <td>
            <button
              ref="key_8"
              @click="inN('8')"
              @touchend.prevent="$event.target.click()"
              v-text="'8'"
            />
          </td>
          <td>
            <button
              ref="key_9"
              @click="inN('9')"
              @touchend.prevent="$event.target.click()"
              v-text="'9'"
            />
          </td>
          <td>
            <button
              ref="key_mul"
              @click="inN('×')"
              @touchend.prevent="$event.target.click()"
              v-text="'×'"
            />
          </td>
        </tr>

        <tr>
          <td>
            <button
              ref="key_4"
              @click="inN('4')"
              @touchend.prevent="$event.target.click()"
              v-text="'4'"
            />
          </td>
          <td>
            <button
              ref="key_5"
              @click="inN('5')"
              @touchend.prevent="$event.target.click()"
              v-text="5"
            />
          </td>
          <td>
            <button
              ref="key_6"
              @click="inN('6')"
              @touchend.prevent="$event.target.click()"
              v-text="'6'"
            />
          </td>
          <td>
            <button
              ref="key_minus"
              @click="inN('-')"
              @touchend.prevent="$event.target.click()"
              v-text="'-'"
            />
          </td>
        </tr>

        <tr>
          <td>
            <button
              ref="key_1"
              @click="inN('1')"
              @touchend.prevent="$event.target.click()"
              v-text="'1'"
            />
          </td>
          <td>
            <button
              ref="key_2"
              @click="inN('2')"
              @touchend.prevent="$event.target.click()"
              v-text="'2'"
            />
          </td>
          <td>
            <button
              ref="key_3"
              @click="inN('3')"
              @touchend.prevent="$event.target.click()"
              v-text="'3'"
            />
          </td>
          <td>
            <button
              ref="key_plus"
              @click="inN('+')"
              @touchend.prevent="$event.target.click()"
              v-text="'+'"
            />
          </td>
        </tr>

        <tr>
          <td>
            <button
              ref="key_0"
              @click="inN('0')"
              @touchend.prevent="$event.target.click()"
              v-text="'0'"
            />
          </td>
          <td>
            <button
              ref="key_00"
              @click="inN('00')"
              @touchend.prevent="$event.target.click()"
              v-text="'00'"
            />
          </td>
          <td>
            <button
              ref="key_dot"
              @click="inN('.')"
              @touchend.prevent="$event.target.click()"
              v-text="'.'"
            />
          </td>
          <td>
            <button
              ref="key_eq"
              @click="inN('=')"
              @touchend.prevent="$event.target.click()"
              v-text="'='"
            />
          </td>
        </tr>
      </table>
    </div>
  </Modal>
</template>

<script>
import Vue from 'vue'
import { Calculator } from '@/modules/math'
import { ClosableMixin } from '@/modules/ui/mixins'

export default Vue.extend({
  mixins: [ClosableMixin],
  props: {
    value: {
      type: Number,
      required: false,
      default: null
    },

    maxlength: {
      type: Number,
      required: false,
      default: 13
    }
  },

  data () {
    const calc = new Calculator(this.maxlength)
    if (this.value != null) {
      calc.inN(String(this.value))
    }

    let tax1 = Number(this.$appoptions.getOpt('calc.tax1'))
    if (!(tax1 > 0 && tax1 <= 50)) {
      tax1 = 1.08
      this.$appoptions.setOpt('calc.tax1', '8')
    } else {
      tax1 = tax1 / 100 + 1
    }

    let tax2 = Number(this.$appoptions.getOpt('calc.tax2'))
    if (!(tax2 > 0 && tax2 <= 50)) {
      tax2 = 1.1
      this.$appoptions.setOpt('calc.tax2', '10')
    } else {
      tax2 = tax2 / 100 + 1
    }

    return {
      calc,
      filter: null,
      tax1: String(tax1),
      labelTax1: this.$appoptions.getOpt('calc.tax1'),
      tax2: String(tax2),
      labelTax2: this.$appoptions.getOpt('calc.tax2')
    }
  },

  computed: {
    progress () {
      return this.calc.data
    },

    val () {
      return this.calc.val
    }
  },

  methods: {
    clear () {
      this.calc.clear()
    },

    delCe () {
      this.calc.delCe()
    },

    del () {
      this.calc.del()
    },

    inN (n) {
      Array.from(n).forEach(s => this.calc.inN(s))
    },

    inP (o, p, d) {
      this.calc.inP(o, p, d)
    },

    async ok () {
      let val = this.calc.val
      if (Math.abs(val) === Infinity || isNaN(val)) {
        val = null
      }
      await this.$emit('input', val)
      this.close()
    },

    toggleFilter (filter) {
      this.filter = this.filter === filter ? null : filter
      this.calc.setFilter(this.filter)
    },

    keyEvent (e) {
      const c = e.keyCode
      const cc = c + (e.shiftKey ? 1000 : 0) + (e.ctrlKey ? 10000 : 0)
      const keys = {
        8: 'del',
        10008: 'ce',
        11008: 'ca',
        13: 'ok',
        46: 'ca',
        106: 'mul',
        107: 'plus',
        109: 'minus',
        111: 'div',
        1186: 'mul',
        1187: 'plus',
        189: 'minus',
        1189: 'eq',
        190: 'dot',
        191: 'div'
      }

      let k = null
      if (c === 9) {
        e.preventDefault()
      } else if (c >= 48 && c <= 57) {
        k = c - 48
        if (k === 0 && e.shiftKey) {
          k = '00'
        }
      } else if (c >= 96 && c <= 105) {
        k = c - 96
        if (k === 0 && e.shiftKey) {
          k = '00'
        }
      } else {
        k = keys[cc]
      }

      if (k != null) {
        e.preventDefault()
        this.$refs[`key_${k}`].click()
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.calculator-modal {
  .calculator {
    z-index: 55;
    height: calc(100% * 0.9);
    width: 100%;
    max-width: 380px;
    max-height: 550px;

    border: 1px solid #aaa;
    background: #eee;
    padding: 15px 10px;
    border-radius: 8px;

    &-display {
      border: 1px solid #aaa;
      background: #fff;
      text-align: right;
      margin: 2px;
      padding: 3px;
      height: 60px;

      &-in {
        height: 50%;
        font-size: 1.4em;
        font-weight: bold;
      }

      &-progress {
        position: relative;
        height: 50%;
        font-size: 1.6em;
        overflow: hidden;

        & > * {
          display: flex;
          align-items: center;
          align-content: center;
          position: absolute;
          height: 100%;
          white-space: nowrap;
          right: 0;

          & > * {
            padding: 0 2px;
          }
        }
      }
    }

    &-keys {
      table-layout: fixed;
      border-collapse: separate;
      border-spacing: 2px;
      width: 100%;
      height: calc(100% - 70px);

      tr {
        font-weight: bold;

        td {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -webkit-tap-highlight-color: transparent;
          text-align: center;
          vertical-align: middle;
          width: 25%;
          height: calc(100% / 7);

          button {
            background: #fff;
            height: 100%;
            width: 100%;
            border-radius: 2px;
            border: 1px solid #aaa;
            overflow: hidden;

            &:focus {
              outline: none;
            }

            &:active {
              background: transparent;
            }

            &.on {
              background: #ffa;
            }

            .small {
              font-size: .7em;
            }
          }
        }
      }
    }
  }
}
</style>
