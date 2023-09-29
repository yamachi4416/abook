import { AbookViewModel, DateUtils, MonthlyJournalsState } from '@abook/models'

export interface UseMonthlyJournalsState extends MonthlyJournalsState {
  journals: ReturnType<MonthlyJournalsState['monthlyJournals']['get']>
  loading: boolean
  prevMonth: ReturnType<typeof toMonthLink>
  nextMonth: ReturnType<typeof toMonthLink>
}

function toMonthLink(month: string, plus: number) {
  return {
    to: {
      params: {
        month: DateUtils.plusFormatedDate(month, { month: plus }, 'YYYYMM'),
      },
    },
    replace: true,
  }
}

export function useMonthlyJournalsState({
  abook,
}: {
  abook: MaybeRef<AbookViewModel>
}): UseMonthlyJournalsState {
  const month = useState<string>()
  const monthlyJournals = useState<UseMonthlyJournalsState['monthlyJournals']>(
    () => new Map(),
  )
  const loadings = useState(() => new Map<string, boolean>())

  return toReactive({
    month,
    abook: ref(abook),
    monthlyJournals,
    loadings,
    journals: computed(() => monthlyJournals.value.get(month.value)),
    loading: computed(() => !!loadings.value.get(month.value)),
    prevMonth: computed(() => toMonthLink(month.value, -1)),
    nextMonth: computed(() => toMonthLink(month.value, 1)),
  })
}
