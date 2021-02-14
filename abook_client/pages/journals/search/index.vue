<template>
  <DefaultLayout>
    <template #title>
      <Selects
        v-model.number="order"
        :empty="null"
        :options="$t('select.orders')"
        :mapper="(o) => [o.label, o.value]"
        :inline="true"
      />
      {{ title }}
    </template>

    <template #default>
      <JournalTimeline
        :items="items"
        @edit="edit"
        @daily="daily"
      />
    </template>

    <template #footer>
      <span>
        <button data-icon="add" @click.once="edit()">
          {{ $t('actions.add') }}
        </button>
      </span>
      <span>
        <button v-show="journals && journals.length" data-icon="assignment" @click="showAccountSummary()">
          {{ $t('actions.summary') }}
        </button>
      </span>
      <span />
      <span />
    </template>
  </DefaultLayout>
</template>

<script>
import { BackableMixin, OptionMixin, SavePosMixin } from '@/modules/ui/mixins'
import AccountSummary from '@/components/journal/AccountSummary'

export default {
  mixins: [
    BackableMixin, SavePosMixin,
    OptionMixin({ order: 'journal.search.order' })
  ],

  async asyncData ({ store, query, app, route }) {
    const journals = app.$flashattrs.getAttr(`/journals/search/input${location.search}`) ||
        await store.dispatch('journals/search', query)

    return {
      journals,
      query
    }
  },

  computed: {
    title () {
      return this.query.title || this.$t('pages.journals.search.index.title.normal')
    },

    items () {
      const [t1, t2] = this.order === 0 ? [1, -1] : [-1, 1]
      return (this.journals || []).sort((a, b) =>
        a.date === b.date ? 0 : a.date > b.date ? t1 : t2
      )
    }
  },

  methods: {
    async edit (id) {
      if (id) {
        await this.$router.push(`/journals/${id}`)
      } else {
        const { journalDiv, accountId } = this.query
        await this.$router.push({
          path: '/journals',
          query: { journalDiv, accountId }
        })
      }
    },

    daily (date) {
      const { accountId, financeDiv, journalDiv, memo } = this.query
      this.$router.push({
        path: `/journals/daily/${date.replace(/-/g, '')}`,
        query: { accountId, financeDiv, journalDiv, memo }
      })
    },

    showAccountSummary () {
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
