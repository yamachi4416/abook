<template>
  <DefaultLayout>
    <template #title>
      {{ date | dateformat('YYYY/MM/DD (ddd)') }}
    </template>

    <template #default>
      <div v-if="journals && journals.length !== 0" class="contents">
        <div class="items">
          <JournalListItem
            v-for="item in journals"
            :key="item.id"
            :item="item"
            @click="edit"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <span>
        <button data-icon="skip_previous" @click.once="prev()">
          {{ $t('actions.prev_day') }}
        </button>
      </span>
      <span></span>
      <span>
        <button data-icon="add" @click.once="edit()">
          {{ $t('actions.add') }}
        </button>
      </span>
      <span>
        <button data-icon="skip_next" @click.once="next()">
          {{ $t('actions.next_day') }}
        </button>
      </span>
    </template>
  </DefaultLayout>
</template>

<script>
import datetime from '@/modules/utils/datetime'
import { BackableMixin, SavePosMixin } from '@/modules/ui/mixins'
export default {
  mixins: [BackableMixin, SavePosMixin],

  async asyncData({ store, params, query }) {
    const date = datetime(params.date, 'YYYYMMDD').format('YYYY-MM-DD')
    const journals = await store.dispatch('journals/searchByDate', {
      date,
      query
    })
    return {
      journals,
      date,
      query
    }
  },

  methods: {
    prev() {
      this.$flashattrs.setAttr('transType', 'prev')
      const date = datetime(`${this.date}`, 'YYYYMMDD')
        .subtract(1, 'days')
        .format('YYYYMMDD')
      this.$router.replace({ params: { date }, query: this.query })
    },

    next() {
      this.$flashattrs.setAttr('transType', 'next')
      const date = datetime(`${this.date}`, 'YYYYMMDD')
        .add(1, 'days')
        .format('YYYYMMDD')
      this.$router.replace({ params: { date }, query: this.query })
    },

    async edit(item) {
      if (item) {
        await this.$router.push(`/journals/${item.id}`)
      } else {
        await this.$router.push({
          path: '/journals',
          query: {
            accrualDate: this.date,
            journalDiv: this.query.journalDiv,
            accountId: this.query.accountId
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.contents {
  padding: 15px 5px 10px;

  .items {
    border: 1px solid var(--them-color-border);
    background: var(--them-foreground);
    padding: 10px 5px;
    border-radius: 20px;
  }
}
</style>
