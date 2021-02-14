<template>
  <DefaultLayout>
    <template #title>
      {{ $t('pages.journals.search.input.title') }}
    </template>

    <template #default>
      <FormPanel>
        <ErrorMessages name="search.*" :errors="errors" />
        <div class="row">
          <div class="col-4 col-sm-8">
            <FormGroup
              object="search"
              field="periodType"
              :errors="errors"
            >
              <Selects
                v-model.number="periodType"
                :empty="null"
                :options="$t('select.periodTypes')"
                :mapper="(o) => [o.label, o.value]"
              />
            </FormGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-4 col-sm-8">
            <FormGroup
              object="search"
              field="accrualDateStart"
              :errors="errors"
            >
              <input
                v-model="search.accrualDateStart"
                type="date"
                :disabled="periodType != null"
              >
            </FormGroup>
          </div>
          <div class="col-4 col-sm-8">
            <FormGroup
              object="search"
              field="accrualDateEnd"
              pattern="accrualDateEnd.*"
              :errors="errors"
            >
              <input
                v-model="search.accrualDateEnd"
                type="date"
                :disabled="periodType != null"
              >
            </FormGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-4 col-sm-8">
            <FormGroup
              object="search"
              field="journalDiv"
              label-field="journalDiv"
              :errors="errors"
            >
              <Selects
                v-model.number="search.journalDiv"
                :empty="null"
                :options="$t('select.journalDiv')"
                :mapper="(o) => [o.label, o.value]"
              />
            </FormGroup>
          </div>
          <div class="col-4 col-sm-8">
            <FormGroup
              object="search"
              field="accountId"
              label-field="account"
              :errors="errors"
            >
              <Selects
                v-model="account"
                :options="sAccounts"
                :mapper="(o) => [o.name, o]"
              />
            </FormGroup>
          </div>
          <div class="col-12 col-sm-12">
            <FormGroup object="search" field="memo" :errors="errors">
              <input v-model="search.memo">
            </FormGroup>
          </div>
        </div>
      </FormPanel>
    </template>

    <template #footer>
      <span>
        <button data-icon="search" @click="doSearch()">
          {{ $t('actions.search') }}
        </button>
      </span>
      <span />
      <span />
      <span />
    </template>
  </DefaultLayout>
</template>

<script>
import datetime from '@/modules/utils/datetime'
import { EditableMixin } from '@/modules/ui/mixins'

export default {
  mixins: [EditableMixin],
  scrollToTop: true,
  async asyncData ({ store, params, app, query }) {
    const [accounts, abook] = await Promise.all([
      store.dispatch('accounts/getAll'),
      store.dispatch('abooks/fetchCurrent')
    ])

    const accrualDateStart = query.accrualDateStart ||
      abook.dayStartOfMonth(datetime().startOf('month').subtract(6, 'month'), 'YYYY-MM-DD')
    const accrualDateEnd = query.accrualDateEnd || abook.dayEndOfMonth(null, 'YYYY-MM-DD')

    const search = {
      periodType: query.periodType,
      accountId: query.accountId,
      journalDiv: query.journalDiv ? Number(query.journalDiv) : null,
      financeDiv: query.financeDiv ? Number(query.financeDiv) : null,
      accrualDateStart,
      accrualDateEnd,
      memo: query.memo
    }

    return {
      accounts,
      search,
      show: false
    }
  },

  computed: {
    account: {
      get () {
        return this.sAccounts.find(a => a.id === this.search.accountId)
      },
      set (val) {
        if (val) {
          this.search.accountId = val.id
        } else {
          this.search.accountId = null
        }
      }
    },

    journalDiv: {
      get () {
        return this.search.journalDiv
      },
      set (val) {
        this.search.journalDiv = val
        if (this.search.accountId) {
          const a = this.sAccounts.find(a => a.id === this.search.accountId)
          if (!a) {
            this.search.accountId = null
          }
        }
      }
    },

    periodType: {
      get () {
        return this.search.periodType
      },
      set (val) {
        this.search.periodType = val
        if (val === 'thisWeek') {
          const today = datetime()
          this.search.accrualDateStart = today.startOf('week').format('YYYY-MM-DD')
          this.search.accrualDateEnd = today.endOf('week').format('YYYY-MM-DD')
        } else if (val === 'thisMonth') {
          const abook = this.$store.getters['abooks/current']
          this.search.accrualDateStart = abook.dayStartOfMonth(null, 'YYYY-MM-DD')
          this.search.accrualDateEnd = abook.dayEndOfMonth(null, 'YYYY-MM-DD')
        }
      }
    },

    sAccounts () {
      if (this.search.journalDiv === 1) {
        return this.accounts.filter(a => a.financeDiv !== 2)
      }

      if (this.search.journalDiv === 2) {
        return this.accounts.filter(a => a.financeDiv !== 1)
      }

      return this.accounts
    }
  },

  methods: {
    async doSearch () {
      await this.useLoading(async () => {
        try {
          const query = this.search
          const journals = await this.$store.dispatch('journals/search', query)

          await this.$router.replace({
            path: '/journals/search/input',
            query
          })

          this.$flashattrs.setAttr(this.$route.fullPath, journals)
          await this.$router.push({ path: '/journals/search', query })
        } catch (e) {
          this.setErrors(e)
        }
      }, false)
    }
  }
}
</script>
