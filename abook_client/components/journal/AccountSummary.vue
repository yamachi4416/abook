<template>
  <Modal class="account-summary-modal" @close="close()">
    <div class="content">
      <div v-for="(f, fd) in summary" :key="`fd-${fd}`">
        <div
          class="content-row"
          :finance="fd"
          @click="$emit('click', { financeDiv: f.financeDiv })"
        >
          <div class="content-row-name">
            {{ $t(`select.financeDiv.${fd}.label`) }}
          </div>
          <div class="content-row-amount">
            {{ f.amount | comma }}
          </div>
        </div>
        <div
          v-for="a in f.items"
          :key="`acc-${a.id}`"
          class="content-row"
          @click="$emit('click', { financeDiv: f.financeDiv, account: a })"
        >
          <div class="content-row-name account-name">
            {{ a.name }}
          </div>
          <div class="content-row-amount">
            {{ a.amount | comma }}
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Vue from 'vue'
import { ClosableMixin } from '@/modules/ui/mixins'
import { JournalModel } from '@/modules/models/JournalModel'

export default Vue.extend({
  mixins: [ClosableMixin],
  inheritAttrs: true,
  props: {
    accounts: {
      type: Array,
      required: false,
      default: () => []
    },
    journals: {
      type: Array,
      required: true
    }
  },

  computed: {
    summary() {
      return JournalModel.summaryOfFinance(this.journals)
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';

.account-summary-modal {
  .content {
    font-size: 0.9rem;
    display: block;
    overflow-y: auto;
    width: 100%;
    max-width: calc(#{$max-layout-width} * 0.6);
    max-height: 100%;
    background: var(--them-foregraund);
    padding: 10px;
    border-radius: 10px;

    &-row {
      display: grid;
      grid-template-rows: auto;
      grid-template-columns: 2fr 1fr;

      & > * {
        padding: 5px;
      }

      .account-name {
        text-indent: 1em;
      }

      &-amount {
        text-align: right;
      }

      &:not(:last-child) {
        border-bottom: 1px solid var(--them-color-border-sub);
      }

      &[finance='1'] > * {
        color: #fff;
        background-color: #99d;
      }

      &[finance='2'] > * {
        color: #fff;
        background-color: #d88;
      }

      &[finance='3'] > * {
        color: #fff;
        background-color: #9d9;
      }

      &[finance='4'] > * {
        color: #fff;
        background-color: #69d;
      }
    }
  }
}
</style>
