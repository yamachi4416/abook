import {
  AbookUtils,
  DateUtils,
  JournalsService,
  MonthlyJournalsComponent,
  MonthlyJournalsState,
} from './deps'

export function journalsMonthlyComponent<State extends MonthlyJournalsState>({
  journalsService,
  state,
}: {
  journalsService: JournalsService
  state: State
}): MonthlyJournalsComponent<State> {
  async function searchJournals({
    month,
    signal,
  }: {
    month: string
    signal?: AbortSignal
  }) {
    const { abook, loadings, monthlyJournals } = state

    const date = DateUtils.parseDate(month, 'YYYYMM')
    const dateStart = AbookUtils.toStartOfMonthDate({ date, abook })
    const dateEnd = AbookUtils.toEndOfMonthDate({ date, abook })

    const handle = {} as const
    loadings.set(month, handle)

    const journals = await journalsService
      .searchJournals({
        query: {
          accrualDateStart: DateUtils.formatDate(dateStart, 'YYYY-MM-DD'),
          accrualDateEnd: DateUtils.formatDate(dateEnd, 'YYYY-MM-DD'),
        },
        signal,
      })
      .finally(() => {
        if (loadings.get(month) === handle) {
          loadings.delete(month)
        }
      })

    monthlyJournals.set(month, {
      month,
      dateStart,
      dateEnd,
      journals,
    })
  }

  return {
    state,
    searchJournals,
  }
}
