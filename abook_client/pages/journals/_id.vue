<template>
  <DefaultLayout>
    <template #title>
      {{ $t(`pages.journals.${journal.isRegisted() ? 'edit' : 'new'}.title`) }}
    </template>

    <template #default>
      <div class="contents">
        <FormPanel>
          <JournalEdit
            :editmodel="journal"
            :accounts="accounts"
            :original="original"
            :errors="errors"
          />
        </FormPanel>
      </div>
    </template>

    <template #footer>
      <span>
        <button data-icon="save" @click="save()">
          {{ $t('actions.save') }}
        </button>
      </span>
      <span>
        <button
          v-if="journal.isRegisted()"
          data-icon="content_copy"
          @click.once="copy"
        >
          {{ $t('actions.copy') }}
        </button>
      </span>
      <span>
        <button
          v-if="journal.isRegisted()"
          data-icon="delete_outline"
          @click="remove()"
        >
          {{ $t('actions.remove') }}
        </button>
      </span>
      <span></span>
    </template>
  </DefaultLayout>
</template>

<script>
import { mapActions } from 'vuex'
import { EditableMixin, BackableMixin } from '@/modules/ui/mixins'

export default {
  mixins: [EditableMixin, BackableMixin],

  scrollToTop: true,

  async asyncData({ store, params, app, query }) {
    const copy = app.$flashattrs.getAttr('journals.copy')
    const [accounts, journal] = await Promise.all([
      store.dispatch('accounts/getAll'),
      copy ? Promise.resolve(copy) : store.dispatch('journals/get', params.id),
      store.dispatch('abooks/fetchCurrent')
    ])

    if (!journal.isRegisted()) {
      const { accrualDate, journalDiv, accountId } = query
      if (accrualDate) {
        journal.accrualDate = accrualDate
      }

      if (journalDiv && !isNaN(journalDiv)) {
        journal.journalDiv = Number(journalDiv)
      }

      if (accountId) {
        const acc = accounts.find(a => a.id === accountId)
        if (acc) {
          if (acc.financeDiv === 1) {
            journal.journalDiv = acc.financeDiv
            journal.creditAccount = acc
          } else if (acc.financeDiv === 2) {
            journal.journalDiv = acc.financeDiv
            journal.debitAccount = acc
          } else {
            journal.creditAccount = acc
            journal.debitAccount = acc
          }
        }
      }
    }

    if (journal.journalDiv === 3) {
      journal.fee = journal.fee || {}
    }

    return {
      accounts,
      journal,
      original: journal.clone(),
      isCopy: !!copy
    }
  },

  methods: {
    ...mapActions({
      getAccounts: 'accounts/getAll',
      create: 'journals/create',
      update: 'journals/update',
      delete: 'journals/delete'
    }),

    async save() {
      await this.useLoading(this._save, false)
    },

    async _save() {
      try {
        if (this.journal.isRegisted()) {
          await this.update(this.journal)
        } else {
          await this.create(this.journal)
        }

        if (
          !this.original.isRegisted() ||
          this.original.accrualDate !== this.journal.accrualDate
        ) {
          const abook = this.$store.getters['abooks/current']
          const from = abook.toMonth(this.journal.accrualDate)
          const params = { from }

          const clear = this.$router.beforeEach((to, from, next) => {
            clear()
            if (to.fullPath.startsWith('/journals/timeline/')) {
              this.$router.replace(Object.assign({}, to, { params }))
            } else if (to.fullPath === '/menu') {
              next(`/journals/timeline/${params.from}`)
            } else {
              next()
            }
          })
        }

        await this.back(this.isCopy ? -2 : -1)
      } catch (e) {
        this.setErrors(e)
        this.accounts = await this.getAccounts()
      }
    },

    async remove() {
      const ok = await this.confirmRemove()
      if (!ok) {
        return
      }

      await this.useLoading(async () => {
        await this.delete(this.journal.id)
        this.back()
      }, false)
    },

    async copy() {
      await this.useLoading(() => {
        this.$flashattrs.setAttr(
          'journals.copy',
          Object.assign(this.original, { id: null })
        )
        this.$router.push('/journals/0')
      })
    }
  }
}
</script>
