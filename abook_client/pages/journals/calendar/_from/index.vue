<template>
  <DefaultLayout
    :header-border="false"
  >
    <template #title>
      {{ title }}
    </template>

    <template #default>
      <div class="wrapper">
        <div class="calendar">
          <div class="calendar-header">
            <div class="calendar-header-row">
              <div
                v-for="(d, i) in weeks[0]"
                :key="`w-h-${i}`"
                class="calendar-header-row-cell"
                :class="{
                  [`weekday-${d.weekday}`]: true
                }"
              >
                <span class="date">{{ d.date | dateformat('ddd') }}</span>
              </div>
            </div>
          </div>

          <div class="calendar-body">
            <div v-for="(week, i) in weeks" :key="`w-d-${i}`" class="calendar-body-row">
              <div
                v-for="d in week"
                :key="d.date"
                class="calendar-body-row-cell"
                :class="{
                  'this-month': d.between,
                  'today': d.date === today,
                  [`weekday-${d.weekday}`]: true,
                }"
                @click="list(d.date, summary[d.date])"
              >
                <span class="calendar-body-row-cell-content">
                  <span class="date">{{ d.date | dateformat(d.day === '1' ? 'M/D' : 'D') }}</span>
                  <span class="content">
                    <span class="content-item">
                      <span v-if="summary[d.date] && summary[d.date]['1']" class="badge amount" badge="1">
                        {{ summary[d.date]['1'] | comma }}
                      </span>
                    </span>
                    <span class="content-item">
                      <span v-if="summary[d.date] && summary[d.date]['2']" class="badge amount" badge="2">
                        {{ summary[d.date]['2'] | comma }}
                      </span>
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div class="summary-panel">
            <div class="summary">
              <div class="summary-item">
                <span class="badge" badge="1">{{ $t('select.journalDiv.1.label') }}</span>
                {{ income | comma }}
              </div>
              <div class="summary-item">
                <span class="badge" badge="2">{{ $t('select.journalDiv.2.label') }}</span>
                {{ expenditure | comma }}
              </div>
              <div class="summary-item">
                <span class="badge" badge="3">{{ $t('label.balance') }}</span>
                {{ income - expenditure | comma }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <span>
        <button data-icon="skip_previous" @click.once="prev()">
          {{ $t('actions.prev_month') }}
        </button>
      </span>
      <span />
      <span>
        <button v-show="journals && journals.length" data-icon="assignment" @click="showAccountSummary()">
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
import AccountSummary from '@/components/journal/AccountSummary'

const calandarDays = (start, end) => {
  const days = Array.from({ length: end.diff(start, 'days') + 1 })
    .map((_, i) => ([true, datetime(start).add(i, 'days')]))

  while (days[0][1].weekday() !== 0) {
    days.unshift([false, datetime(days[0][1]).subtract(1, 'days')])
  }

  while (days[days.length - 1][1].weekday() !== 6) {
    days.push([false, datetime(days[days.length - 1][1]).add(1, 'days')])
  }

  const mDays = days.map(([f, d]) => ({
    date: d.format('YYYY-MM-DD'),
    month: d.format('MM'),
    day: d.format('D'),
    weekday: d.weekday(),
    between: f
  }))

  return {
    start,
    weeks: mDays.reduce((p, d) => {
      if (d.weekday === 0) {
        p.push([])
      }
      p[p.length - 1].push(d)
      return p
    }, []),
    days: mDays
  }
}

const getData = async (store, params) => {
  const { from } = params

  const abook = await store.dispatch('abooks/fetchCurrent')

  const { weeks, days } = calandarDays(
    datetime(abook.startOfMonth(from, 'YYYY-MM-DD')),
    datetime(abook.endOfMonth(from, 'YYYY-MM-DD'))
  )

  const today = datetime().format('YYYY-MM-DD')
  const journals = await store.dispatch('journals/search', {
    accrualDateStart: datetime(days[0].date).format('YYYY-MM-DD'),
    accrualDateEnd: datetime(days[days.length - 1].date).format('YYYY-MM-DD')
  })

  return {
    today,
    from,
    days,
    weeks,
    journals
  }
}

export default {
  async asyncData ({ store, params }) {
    return await getData(store, params)
  },

  computed: {
    title () {
      return this.$t('pages.journals.calendar.title', {
        year: this.from.substr(0, 4),
        month: this.from.substr(4, 2)
      })
    },

    income () {
      return this.days.filter(d => d.between && this.summary[d.date])
        .reduce((p, d) => p + (this.summary[d.date]['1'] || 0), 0)
    },

    expenditure () {
      return this.days.filter(d => d.between && this.summary[d.date])
        .reduce((p, d) => p + (this.summary[d.date]['2'] || 0), 0)
    },

    summary () {
      return this.journals
        .reduce((p, m) => {
          const items = m.items

          p[m.date] = {
            1: items.reduce((s, d) => s + (d.journalDiv === 1 ? d.amount : 0), 0),
            2: items.reduce((s, d) => s + (d.journalDiv === 2 ? d.amount : 0), 0) +
              items.reduce((s, d) => s + (d.journalDiv === 3 ? d.fee ? d.fee.amount : 0 : 0), 0)
          }
          return p
        }, {})
    }
  },

  methods: {
    prev () {
      this.$flashattrs.setAttr('transType', 'prev')
      const from = datetime(`${this.from}`, 'YYYYMM').subtract(1, 'month').format('YYYYMM')
      this.$router.replace({ params: { from } })
    },

    next () {
      this.$flashattrs.setAttr('transType', 'next')
      const from = datetime(`${this.from}`, 'YYYYMM').add(1, 'month').format('YYYYMM')
      this.$router.replace({ params: { from } })
    },

    list (date) {
      const param = datetime(date).format('YYYYMMDD')
      this.$router.push({
        path: `/journals/daily/${param}`
      })
    },

    showAccountSummary () {
      const days = this.days
        .filter(d => d.between)
        .reduce((p, d) => {
          p[d.date] = true
          return p
        }, {})

      const m = new AccountSummary({
        parent: this.$parent,
        propsData: {
          journals: this.journals.filter(m => days[m.date])
        }
      })

      const div = document.createElement('div')
      document.body.appendChild(div)
      m.$mount(div)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.summary-panel {
  .summary {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    padding: 2px;
    border: 1px solid var(--them-color-border-sub);
    border-bottom: 0;

    & > * {
      justify-self: center;
      align-self: center;
    }
  }
}

.calendar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  font-size: 0.9em;

  &-header {
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    background: var(--them-foregraund);
    border-bottom: 1px solid var(--them-color-border-sub);
    z-index: 10;

    &-row {
      display: flex;
      flex-direction: row;

      &-cell {
        flex: 1 1 0%;
        text-align: center;
      }
    }
  }

  &-body {
    flex: 1 1 0%;
    display: flex;
    flex-direction: column;
    position: relative;
    background: var(--them-foregraund);

    &-row {
      display: flex;
      flex-direction: row;
      flex: 1 1 0%;
      border-top: 0;
      border-bottom: 1px solid var(--them-color-border-sub);

      &:last-child {
        border-bottom: 0;
      }

      &-cell {
        cursor: pointer;
        flex: 1 1 0%;
        border-left: 1px solid var(--them-color-border-sub);
        overflow: hidden;

        &:last-child {
          border-right: 1px solid var(--them-color-border-sub);
        }

        &.today {
          background: rgba(0, 123, 255, 0.05);
        }

        &:not(.this-month) {
          background: var(--them-color-border-sub);
          opacity: 0.8;
        }

        &-content {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;

          .date {
            text-align: center;
          }

          .content {
            flex: 1 1 0%;
            display: flex;
            flex-direction: column;
            min-height: 3.3rem;

            &-item {
              display: block;
              font-size: 0.8rem;
              height: 1.1rem;
              width: 100%;
              padding-left: 1px;

              .badge {
                width: 100%;
                text-overflow: unset;
                position: absolute;
                width: calc(100% / 7 - 3px);
                padding: 0;
                border-radius: 2px;
              }
            }
          }
        }
      }
    }
  }
}

.weekday-0 {
  .date {
    color: red;
  }
}

.weekday-6 {
  .date {
    color: blue;
  }
}
</style>
