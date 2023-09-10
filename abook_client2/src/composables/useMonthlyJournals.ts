import { formatDate } from '@vueuse/core'
import { JournalViewModel } from '~~/libs/models'
import {
  toEndOfMonthDate,
  toStartOfMonthDate,
} from '~~/libs/models/utils/abook'

export function useMonthlyJournals() {
  const monthly = ref('')
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
    const abook = useAbooksStore().current
    const date = fromDate.value
    if (abook && date) {
      return toStartOfMonthDate({ date, abook })
    }
  })

  const accrualDateEnd = computed(() => {
    const abook = useAbooksStore().current
    const date = fromDate.value
    if (abook && date) {
      return toEndOfMonthDate({ date, abook })
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
