<template>
  <Modal
    class="period-modal"
    @close="close()"
    @keydown="keyRing"
    @focus-into="keyRingInto"
  >
    <div ref="container" class="form">
      <header>
        <h1></h1>
      </header>
      <main>
        <div class="row">
          <div class="col-4 col-sm-12">
            <FormGroup object="period" field="aggMonthType">
              <Selects
                ref="first"
                v-model.number="aggType"
                :empty="null"
                :options="$t('select.aggMonthTypes')"
                :mapper="o => [o.label, o.value]"
              />
            </FormGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-6 col-sm-12">
            <FormGroup object="period" field="aggMonthFrom">
              <input v-model="from" type="month" />
            </FormGroup>
          </div>
          <div class="col-6 col-sm-12">
            <FormGroup object="period" field="aggMonthTo">
              <input v-model="to" type="month" />
            </FormGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-12 btns">
            <button ref="last" class="btn btn--ok" @click.once="ok">OK</button>
          </div>
        </div>
      </main>
    </div>
  </Modal>
</template>

<script>
import Vue from 'vue'
import datetime from '@/modules/utils/datetime'
import { KeyRingMixin, ClosableMixin } from '@/modules/ui/mixins'

export default Vue.extend({
  mixins: [KeyRingMixin, ClosableMixin],
  inheritAttrs: true,
  props: {
    period: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    let from, to
    const iPeriod = {}

    if (this.period.from) {
      from = datetime(this.period.from, 'YYYYMM')
      iPeriod.from = from.format('YYYY-MM')
    }

    if (this.period.to) {
      to = datetime(this.period.to, 'YYYYMM')
      iPeriod.to = to.format('YYYY-MM')
    }

    if (from && to) {
      iPeriod.aggType = to.diff(from, 'month') + 1
    } else {
      iPeriod.aggType = 1
    }

    return {
      iPeriod
    }
  },

  computed: {
    aggType: {
      get() {
        return this.iPeriod.aggType
      },
      set(val) {
        this.iPeriod.aggType = val
        if (this.iPeriod.from) {
          const m = datetime(this.iPeriod.from, 'YYYY-MM')
          const n = m
            .startOf('month')
            .add(val - 1, 'month')
            .format('YYYY-MM')
          this.iPeriod.to = n
        } else if (this.iPeriod.to) {
          const m = datetime(this.iPeriod.to, 'YYYY-MM')
          const n = m
            .startOf('month')
            .subtract(val - 1, 'month')
            .format('YYYY-MM')
          this.iPeriod.from = n
        }
      }
    },

    from: {
      get() {
        return this.iPeriod.from
      },
      set(val) {
        this.iPeriod.from = val
        const a = this.iPeriod.aggType
        const m = datetime(val, 'YYYY-MM')
        const n = m
          .startOf('month')
          .add(a - 1, 'month')
          .format('YYYY-MM')
        this.iPeriod.to = n
      }
    },

    to: {
      get() {
        return this.iPeriod.to
      },
      set(val) {
        this.iPeriod.to = val
        const a = this.iPeriod.aggType
        const m = datetime(val, 'YYYY-MM')
        const n = m
          .startOf('month')
          .subtract(a - 1, 'month')
          .format('YYYY-MM')
        this.iPeriod.from = n
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.$refs.first.focus()
    })
  },

  methods: {
    async ok() {
      const period = {}

      if (this.iPeriod.from) {
        period.from = datetime(this.iPeriod.from, 'YYYY-MM').format('YYYYMM')
      }

      if (this.iPeriod.to) {
        period.to = datetime(this.iPeriod.to, 'YYYY-MM').format('YYYYMM')
      }

      this.$emit('ok', period)
      await this.$nextTick()
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';
@import '~assets/scss/ui/form.scss';
@import '~assets/scss/ui/inputs.scss';

.period-modal {
  align-items: unset;

  .form {
    @include __form;

    width: 100%;
    max-width: calc(#{$max-layout-width} / 2);
    position: relative;

    .btns {
      padding: 15px 5px 0 5px;

      .btn {
        @include __input();
        cursor: pointer;

        &:disabled {
          color: #aaa;
          border-color: #aaa;
          cursor: not-allowed;
        }

        &--ok {
          color: #007bff;
          border-color: #007bff;

          &:not(:disabled) {
            &:active {
              color: #fff;
              background-color: #007bff;
              border-color: #007bff;
            }
          }
        }
      }
    }
  }
}
</style>
