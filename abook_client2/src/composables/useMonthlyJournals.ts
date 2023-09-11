import { formatDate } from '@vueuse/core'
import { JournalViewModel } from '~~/libs/models'
import {
  toEndOfMonthDate,
  toStartOfMonthDate,
} from '~~/libs/models/utils/abook'

export function useMonthlyJournals() {
  const monthly = ref('')
  const { current: abook } = storeToRefs(useAbooksStore())
  const journals = useState<JournalViewModel[]>(() => [])

  const fromDate = useParseDate(monthly, 'YYYYMM')
  const fromDatePrev = computed(() => {
    if (fromDate.value) {
      return new Date(
        fromDate.value.getFullYear(),
        fromDate.value.getMonth() - 1,
        1,
      )
    }
  })
  const fromDateNext = computed(() => {
    if (fromDate.value) {
      return new Date(
        fromDate.value.getFullYear(),
        fromDate.value.getMonth() + 1,
        1,
      )
    }
  })

  const prevMonthly = useDateFormat(fromDatePrev, 'YYYYMM')
  const nextMonthly = useDateFormat(fromDateNext, 'YYYYMM')

  const accrualDateStart = computed(() => {
    const date = fromDate.value
    if (abook.value && date) {
      return toStartOfMonthDate({ date, abook: abook.value })
    }
  })

  const accrualDateEnd = computed(() => {
    const date = fromDate.value
    if (abook.value && date) {
      return toEndOfMonthDate({ date, abook: abook.value })
    }
  })

  async function setMonthly(monthlyValue: string) {
    if (!monthlyValue) {
      clearMonthly()
    } else {
      monthly.value = monthlyValue
      if (accrualDateStart.value && accrualDateEnd.value) {
        const { searchJournals } = useJournalsStore()
        journals.value = await searchJournals({
          accrualDateStart: formatDate(accrualDateStart.value, 'YYYY-MM-DD'),
          accrualDateEnd: formatDate(accrualDateEnd.value, 'YYYY-MM-DD'),
        })
      } else {
        journals.value = []
      }
    }
  }

  function clearMonthly() {
    monthly.value = ''
    journals.value = []
  }

  return {
    monthly: computed(() => monthly.value),
    journals: computed(() => journals.value),
    accrualDateStart,
    accrualDateEnd,
    prevMonthly,
    nextMonthly,
    setMonthly,
    clearMonthly,
  }
}
