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
  month,
  abook,
}: {
  month: MaybeRef<string>
  abook: MaybeRef<AbookViewModel>
}): UseMonthlyJournalsState {
  const monthlyJournals = useState<UseMonthlyJournalsState['monthlyJournals']>(
    () => new Map(),
  )
  const loadings = useState<UseMonthlyJournalsState['loadings']>(
    () => new Map(),
  )

  return toReactive({
    month: computed(() => unref(month)),
    abook: computed(() => unref(abook)),
    monthlyJournals,
    journals: computed(() => monthlyJournals.value.get(unref(month))),
    loadings,
    loading: computed(() => !!loadings.value.get(unref(month))),
    prevMonth: computed(() => toMonthLink(unref(month), -1)),
    nextMonth: computed(() => toMonthLink(unref(month), 1)),
  })
}
