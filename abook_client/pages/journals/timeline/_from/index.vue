<template>
  <DefaultLayout>
    <template #title>
      <Selects
        v-model.number="order"
        class="select-orders"
        :empty="null"
        :options="$t('select.orders')"
        :mapper="o => [o.label, o.value]"
        :inline="true"
      />
      {{ title }}
    </template>

    <template #default>
      <div>
        <JournalTimeline :items="items" @edit="edit" @daily="daily" />
      </div>
    </template>

    <template #footer>
      <span>
        <button data-icon="skip_previous" @click.once="prev()">
          {{ $t('actions.prev_month') }}
        </button>
      </span>
      <span>
        <button data-icon="add" @click.once="add()">
          {{ $t('actions.add') }}
        </button>
      </span>
      <span>
        <button
          v-if="journals && journals.length"
          data-icon="assignment"
          @click="showAccountSummary()"
        >
          {{ $t('actions.summary') }}
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
import { OptionMixin, SavePosMixin } from '@/modules/ui/mixins'
import AccountSummary from '@/components/journal/AccountSummary'

export default {
  mixins: [SavePosMixin, OptionMixin({ order: 'journal.timeline.order' })],

  async asyncData({ store, params, query, app }) {
    const abook = await store.dispatch('abooks/fetchCurrent')

    const search = {
      accrualDateStart: abook.startOfMonth(params.from, 'YYYY-MM-DD'),
      accrualDateEnd: abook.endOfMonth(params.from, 'YYYY-MM-DD')
    }

    const journals = await store.dispatch('journals/search', search)

    return {
      from: params.from,
      journals
    }
  },

  computed: {
    items() {
      const [t1, t2] = this.order === 0 ? [1, -1] : [-1, 1]
      return (this.journals || []).sort((a, b) =>
        a.date === b.date ? 0 : a.date > b.date ? t1 : t2
      )
    },

    title() {
      return this.$t('pages.journals.timeline.title', {
        year: this.from.substr(0, 4),
        month: this.from.substr(4, 2)
      })
    }
  },

  methods: {
    async edit(id) {
      await this.$router.push(`/journals/${id}`)
    },

    add() {
      this.$router.push('/journals')
    },

    prev() {
      const from = datetime(this.from, 'YYYYMM')
        .subtract(1, 'month')
        .format('YYYYMM')
      this.$flashattrs.setAttr('transType', 'prev')
      this.$router.replace({ params: { from } })
    },

    next() {
      const from = datetime(this.from, 'YYYYMM')
        .add(1, 'month')
        .format('YYYYMM')
      this.$flashattrs.setAttr('transType', 'next')
      this.$router.replace({ params: { from } })
    },

    daily(date) {
      this.$router.push(`/journals/daily/${date.replace(/-/g, '')}`)
    },

    showAccountSummary() {
      const m = new AccountSummary({
        parent: this.$parent,
        propsData: {
          journals: this.journals
        }
      })

      const div = document.createElement('div')
      document.body.appendChild(div)
      m.$mount(div)
    }
  }
}
</script>
