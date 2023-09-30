import { AbookViewModel, DateUtils, JournalsBalanceState } from '@abook/models'

export interface UseJournalsBalanceState extends JournalsBalanceState {
  loading: boolean
  prevMonth: ReturnType<typeof toMonthLink>
  nextMonth: ReturnType<typeof toMonthLink>
}

function toMonthLink(month: string, plus: number) {
  return {
    to: {
      query: {
        to: DateUtils.plusFormatedDate(month, { month: plus }, 'YYYYMM'),
      },
    },
    replace: true,
  }
}

export function useJournalsBalanceState({
  month,
  months,
  abook,
}: {
  month: MaybeRef<string>
  months: MaybeRef<number>
  abook: MaybeRef<AbookViewModel>
}): UseJournalsBalanceState {
  const loadings = useState<UseJournalsBalanceState['loadings']>(
    () => new Map(),
  )

  return toReactive({
    month: computed(() => unref(month)),
    months: computed(() => unref(months)),
    abook: computed(() => unref(abook)),
    loadings,
    loading: computed(() => !!loadings.value.get(unref(month))),
    periods: useState<UseJournalsBalanceState['periods']>(() => []),
    accounts: useState<UseJournalsBalanceState['accounts']>(() => []),
    balances: useState<UseJournalsBalanceState['balances']>(() => new Map()),
    prevMonth: computed(() => toMonthLink(unref(month), -1)),
    nextMonth: computed(() => toMonthLink(unref(month), 1)),
  })
}
