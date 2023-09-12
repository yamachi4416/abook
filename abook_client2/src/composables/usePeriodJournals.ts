import { formatDate } from '@vueuse/core'
import { JournalViewModel } from '~~/libs/models'
import {
  toEndOfMonthDate,
  toStartOfMonthDate,
} from '~~/libs/models/utils/abook'
import {
  parseDate,
  plusDate,
  toCalendarEndDate,
  toCalendarStartDate,
} from '~~/libs/models/utils/date'

type Period = {
  from: string
  to: string
  period: string
}

export function useMonthlyJournals() {
  const period = useState<Period>(() => ({
    from: '',
    to: '',
    period: '',
  }))

  const { current: abook } = storeToRefs(useAbooksStore())

  const calJournals = useState<JournalViewModel[]>(() => [])

  const journals = computed(() => {
    if (accrualDateStart.value && accrualDateEnd.value) {
      const dateStart = formatDate(accrualDateStart.value, 'YYYY-MM-DD')
      const dateEnd = formatDate(accrualDateEnd.value, 'YYYY-MM-DD')
      return calJournals.value.filter(
        ({ accrualDate }) => dateStart <= accrualDate && accrualDate <= dateEnd,
      )
    } else {
      return []
    }
  })

  const prevPeriod = computed<Period>(() => {
    const from = formatDate(
      plusDate(parseDate(period.value.from, 'YYYYMM'), { month: -1 }),
      'YYYYMM',
    )
    const to = formatDate(
      plusDate(parseDate(period.value.to, 'YYYYMM'), { month: -1 }),
      'YYYYMM',
    )
    return {
      from,
      to,
      period: from === to ? from : `${from}-${to}`,
    }
  })

  const nextPeriod = computed<Period>(() => {
    const from = formatDate(
      plusDate(parseDate(period.value.from, 'YYYYMM'), { month: 1 }),
      'YYYYMM',
    )
    const to = formatDate(
      plusDate(parseDate(period.value.to, 'YYYYMM'), { month: 1 }),
      'YYYYMM',
    )
    return {
      from,
      to,
      period: from === to ? from : `${from}-${to}`,
    }
  })

  const accrualDateStart = computed(() => {
    if (abook.value && period.value.from) {
      const date = parseDate(period.value.from, 'YYYYMM')
      return toStartOfMonthDate({ date, abook: abook.value })
    }
  })

  const accrualDateEnd = computed(() => {
    if (abook.value && period.value.to) {
      const date = parseDate(period.value.to, 'YYYYMM')
      return toEndOfMonthDate({ date, abook: abook.value })
    }
  })

  function toPeriod(value: string | string[]): Period {
    const [from, to] = String(value).split('-')
    if (to) {
      return { from, to, period: `${from}-${to}` }
    } else {
      return { from, to: from, period: from }
    }
  }

  async function setPeriod(value: string | string[]) {
    if (!value) {
      clearPeriod()
    } else {
      period.value = toPeriod(value)
      if (accrualDateStart.value && accrualDateEnd.value) {
        const { searchJournals } = useJournalsStore()
        calJournals.value = await searchJournals({
          accrualDateStart: formatDate(
            toCalendarStartDate({ date: accrualDateStart.value }),
            'YYYY-MM-DD',
          ),
          accrualDateEnd: formatDate(
            toCalendarEndDate({ date: accrualDateEnd.value }),
            'YYYY-MM-DD',
          ),
        })
      } else {
        calJournals.value = []
      }
    }
  }

  function clearPeriod() {
    period.value = { from: '', to: '' }
    calJournals.value = []
  }

  return {
    period: computed(() => ({ ...period.value })),
    journals,
    calJournals: computed(() => calJournals.value),
    accrualDateStart,
    accrualDateEnd,
    prevPeriod,
    nextPeriod,
    setPeriod,
    clearPeriod,
  }
}
