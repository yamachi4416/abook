<template>
  <DefaultLayout :smooth-scroll="false" :header-border="false">
    <template #title>
      {{ $t('pages.journals.balance.title') }}
    </template>

    <template #default>
      <table class="table">
        <thead>
          <tr>
            <th><span></span></th>
            <th v-for="{ ym, key } in yms" :key="`h-${key}`">
              <span class="header-ym" @click="timeline(ym)">
                {{ ym | dateformat('YYYY/MM') }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody v-for="(accounts, fd) in finances" :key="`r-${fd}`">
          <tr :finance="fd">
            <td class="finance-name">
              <span>{{ $t(`select.financeDiv.${fd}.label`) }}</span>
            </td>
            <td v-for="{ ym, from, to, key } in yms" :key="`r-${fd}-${key}`">
              <span
                class="finance-amount"
                @click.once="
                  search({
                    financeDiv: fd,
                    from: from,
                    to: to,
                    title: $t('pages.journals.search.index.title.monthly', [
                      `${ym.substr(0, 4)}/${ym.substr(4, 2)}`,
                      $t(`select.financeDiv.${fd}.label`)
                    ])
                  })
                "
              >
                {{ (financeSums[`${fd}-${key}`] || 0) | comma }}
              </span>
            </td>
          </tr>
          <tr v-for="a in accounts" :key="`a-${a.id}`">
            <td>
              <span
                class="balance-name"
                @click.once="
                  search({
                    accountId: a.id,
                    title: $t('pages.journals.search.index.title.period', [
                      `${from.substr(0, 4)}/${from.substr(4, 2)}`,
                      `${to.substr(0, 4)}/${to.substr(4, 2)}`,
                      a.name
                    ])
                  })
                "
              >
                {{ a.name }}
              </span>
            </td>
            <td v-for="{ ym, from, to, key } in yms" :key="`a-${ym}-${a.id}`">
              <span
                class="balance-amount"
                @click.once="
                  search({
                    accountId: a.id,
                    from: from,
                    to: to,
                    title: $t('pages.journals.search.index.title.monthly', [
                      `${ym.substr(0, 4)}/${ym.substr(4, 2)}`,
                      a.name
                    ])
                  })
                "
              >
                {{ (items[`${fd}-${key}-${a.id}`] || 0) | comma }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <template #footer>
      <span>
        <button data-icon="skip_previous" @click="prev()">
          {{ $t('actions.next_month') }}
        </button>
      </span>
      <span></span>
      <span></span>
      <span>
        <button data-icon="skip_next" @click="next()">
          {{ $t('actions.prev_month') }}
        </button>
      </span>
    </template>
  </DefaultLayout>
</template>

<script>
import datetime from '@/modules/utils/datetime'
import { SavePosMixin } from '@/modules/ui/mixins'

const fetchData = async (store, to) => {
  const abook = store.getters['abooks/current']

  const yms = [...Array(6).keys()]
    .map(n => datetime(to).subtract(n, 'months'))
    .map(date => ({
      ym: date.format('YYYYMM'),
      from: abook.startOfMonth(date, 'YYYY-MM-DD'),
      to: abook.endOfMonth(date, 'YYYY-MM-DD')
    }))
    .map(d => ({
      ...d,
      key:
        datetime(d.from).format('YYYYMMDD') + datetime(d.to).format('YYYYMMDD')
    }))

  const from = datetime(to).subtract(5, 'months').format('YYYYMM')
  const [accounts, balance] = await Promise.all([
    store.dispatch('accounts/getAll'),
    store.dispatch('journals/getBalance', {
      from: datetime(yms[yms.length - 1].from).format('YYYYMMDD'),
      to: datetime(yms[0].to).format('YYYYMMDD'),
      periods: yms
        .slice(0, yms.length - 1)
        .map(d => datetime(d.from).format('YYYYMMDD'))
    })
  ])

  const accMap = accounts.reduce((p, a) => ({ ...p, [a.id]: a }), {})

  return {
    to,
    from,
    accounts: accMap,
    balance: balance.map(d => {
      const acc = accMap[d.accountId]
      return {
        ...d,
        financeDiv: acc.financeDiv,
        amount: [1, 4].includes(acc.financeDiv)
          ? d.creditAmount - d.debitAmount
          : d.debitAmount - d.creditAmount
      }
    }),
    yms
  }
}

export default {
  mixins: [SavePosMixin],

  async asyncData({ store, query }) {
    const abook = await store.dispatch('abooks/fetchCurrent')
    const to = query.to || abook.toMonth()
    return await fetchData(store, to)
  },

  computed: {
    items() {
      const a = this.balance.reduce((p, d) => {
        p[`${d.financeDiv}-${d.key}-${d.accountId}`] = d.amount
        return p
      }, {})

      return a
    },

    finances() {
      return Object.values(this.accounts).reduce((p, a) => {
        const key = a.financeDiv
        p[key] = p[key] || {}
        if (!p[key][a.id]) {
          p[key][a.id] = { id: a.id, name: a.name }
        }
        return p
      }, {})
    },

    financeSums() {
      return this.balance.reduce((p, d) => {
        const key = `${d.financeDiv}-${d.key}`
        p[key] = p[key] || 0
        p[key] += d.amount
        return p
      }, {})
    }
  },

  methods: {
    async prev() {
      const to = datetime(this.to).add(1, 'months').format('YYYYMM')
      Object.assign(this.$data, await fetchData(this.$store, to))
      this.$router.replace({ query: { to } })
    },

    async next() {
      const to = datetime(this.to).subtract(1, 'months').format('YYYYMM')
      Object.assign(this.$data, await fetchData(this.$store, to))
      this.$router.replace({ query: { to } })
    },

    timeline(ym) {
      this.$router.push(`/journals/timeline/${ym}`)
    },

    search({ accountId, financeDiv, from, to, title }) {
      const yms = this.yms
      this.$router.push({
        path: '/journals/search',
        query: {
          accrualDateStart:
            from || datetime(yms[yms.length - 1].from).format('YYYY-MM-DD'),
          accrualDateEnd: to || datetime(yms[0].to).format('YYYY-MM-DD'),
          title,
          accountId,
          financeDiv
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';
@import '~assets/scss/ui/table.scss';

.table {
  @include __table;

  table-layout: fixed;

  tr {
    td,
    th {
      padding: 5px;
      font-weight: normal;
      white-space: nowrap;

      width: 80px;
      text-align: right;

      background: var(--them-color-background);
      color: var(--them-color-font);

      &:first-child {
        text-align: left;
        position: sticky;
        width: 150px;
        left: 0;
      }

      .balance-name {
        padding-left: 1em;
        padding-right: 0;
        overflow-x: hidden;
        text-overflow: ellipsis;
      }

      .header-ym,
      .balance-name,
      .balance-amount,
      .finance-amount {
        width: 100%;
        display: block;
        cursor: pointer;

        &:hover {
          opacity: 0.7;
        }
      }
    }

    @each $idx, $color in $idxed-colors {
      &[finance='#{$idx}'] > td {
        color: var(--them-color-background);
        background-color: $color;
      }
    }
  }
}
</style>
