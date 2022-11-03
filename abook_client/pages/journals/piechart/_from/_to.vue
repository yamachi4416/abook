<template>
  <DefaultLayout>
    <template #title>
      {{ title }}
      <Selects
        v-model.number="financeDiv"
        :empty="null"
        :options="$t('select.financeInOutDiv')"
        :mapper="o => [o.label, o.value]"
        :inline="true"
      />
    </template>

    <template #default>
      <PieChart
        v-show="show"
        :dataset="dataset"
        :filter="filter"
        @change="change"
        @click="clickItem"
      />
    </template>

    <template #footer>
      <span>
        <button data-icon="skip_previous" @click.once="prev()">
          {{ $t('actions.prev_month') }}
        </button>
      </span>
      <span>
        <button
          :data-icon="filter ? 'done' : 'filter_list'"
          @click="toggleFilter"
        >
          {{ $t(`actions.${filter ? 'done' : 'filter'}`) }}
        </button>
      </span>
      <span>
        <button data-icon="search" @click="condition()">
          {{ $t('actions.condition_period') }}
        </button>
      </span>
      <span>
        <button data-icon="skip_next" @click.once="next()">
          {{ $t('actions.next_month') }}
        </button>
      </span>
    </template>
  </DefaultLayout>
</template>

<script>
import datetime from '@/modules/utils/datetime'
import PeriodFormModal from '@/components/journal/PeriodFormModal'
import JournalTimelineModal from '@/components/journal/JournalTimelineModal'
import { JournalModel } from '@/modules/models/JournalModel'
import { OptionMixin } from '@/modules/ui/mixins'

export default {
  mixins: [OptionMixin({ disabledItems: 'journal.piechat.disabledItems' })],
  async asyncData({ store, params, query }) {
    const period = {
      from: params.from,
      to: params.to || params.from
    }

    const abook = await store.dispatch('abooks/fetchCurrent')

    const journals = await store.dispatch('journals/search', {
      accrualDateStart: abook.startOfMonth(period.from, 'YYYY-MM-DD'),
      accrualDateEnd: abook.endOfMonth(period.to, 'YYYY-MM-DD')
    })

    return {
      period,
      journals,
      financeDiv: Number(query.financeDiv || 2)
    }
  },

  data() {
    return {
      filter: false,
      show: true
    }
  },

  computed: {
    summary() {
      return JournalModel.summaryOfFinance(this.journals)
    },

    dataset() {
      if (!this.summary[this.financeDiv]) {
        return []
      }
      return this.summary[this.financeDiv].items
        .filter(x => x.amount > 0)
        .map(x => ({ id: x.id, name: x.name, val: x.amount, color: x.color }))
        .map(x => Object.assign(x, { disabled: this.disabledItems[x.id] }))
    },

    title() {
      const { from, to } = this.period
      if (from === to) {
        return this.$t('pages.journals.piechart.title1', {
          year: from.substr(0, 4),
          month: from.substr(4, 2)
        })
      } else {
        return this.$t('pages.journals.piechart.title2', {
          year1: from.substr(0, 4),
          month1: from.substr(4, 2),
          year2: to.substr(0, 4),
          month2: to.substr(4, 2)
        })
      }
    }
  },

  methods: {
    prev() {
      const from = datetime(this.period.from, 'YYYYMM')
        .subtract(1, 'month')
        .format('YYYYMM')
      const to = datetime(this.period.to, 'YYYYMM')
        .subtract(1, 'month')
        .format('YYYYMM')

      this.$flashattrs.setAttr('transType', 'prev')
      this.$router.replace({
        path: `/journals/piechart/${from}${from === to ? '' : '/' + to}`,
        query: { financeDiv: this.financeDiv }
      })
    },

    next() {
      const from = datetime(this.period.from, 'YYYYMM')
        .add(1, 'month')
        .format('YYYYMM')
      const to = datetime(this.period.to, 'YYYYMM')
        .add(1, 'month')
        .format('YYYYMM')

      this.$flashattrs.setAttr('transType', 'next')
      this.$router.replace({
        path: `/journals/piechart/${from}${from === to ? '' : '/' + to}`,
        query: { financeDiv: this.financeDiv }
      })
    },

    toggleFilter() {
      this.filter = !this.filter
    },

    change(chart) {
      if (chart == null) {
        this.filter = false
      } else if (!chart.disabled) {
        if (chart.id in this.disabledItems) {
          delete this.disabledItems[chart.id]
        }
      } else if (!(chart.id in this.disabledItems)) {
        this.disabledItems[chart.id] = true
      }
    },

    clickItem(c) {
      const filters = [j => j.journalDiv === this.financeDiv]
      const filterItem = j => filters.every(f => f(j))

      if (c) {
        filters.push(j => j.isUseAccountId(c.id))
      } else {
        const disabledAccIds = Object.keys(this.disabledItems)
        filters.push(
          j => !disabledAccIds.some(accId => j.isUseAccountId(accId))
        )
      }

      const m = new JournalTimelineModal({
        parent: this.$parent,
        propsData: {
          items: this.journals
            .map(d => {
              return {
                date: d.date,
                items: d.items.filter(filterItem)
              }
            })
            .filter(d => d.items.length)
        }
      })

      const div = document.createElement('div')
      document.body.appendChild(div)
      m.$mount(div)
    },

    condition() {
      const m = new PeriodFormModal({
        parent: this.$parent,
        propsData: {
          period: this.period
        }
      })

      m.$on('ok', async ({ from, to }) => {
        await m.close()
        if (this.period.from === from && this.period.to === to) {
          return
        }
        this.show = false
        await this.$nextTick()
        this.$router.replace({
          params: { from, to: from === to ? null : to },
          query: { financeDiv: this.financeDiv }
        })
      })

      const div = document.createElement('div')
      document.body.appendChild(div)
      m.$mount(div)
    }
  }
}
</script>
