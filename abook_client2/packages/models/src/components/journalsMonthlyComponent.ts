import { JournalsService } from '../services'
import { toEndOfMonthDate, toStartOfMonthDate } from '../utils/abook'
import { formatDate, parseDate } from '../utils/date'
import { MonthlyJournalsState } from './interfaces'

export function journalsMonthlyComponent<State extends MonthlyJournalsState>({
  journalsService,
  state,
}: {
  journalsService: JournalsService
  state: State
}) {
  async function searchJournals({
    month,
    signal,
  }: {
    month: string
    signal?: AbortSignal
  }) {
    const date = parseDate(month, 'YYYYMM')
    const dateStart = toStartOfMonthDate({ date, abook: state.abook })
    const dateEnd = toEndOfMonthDate({ date, abook: state.abook })

    const accrualDateStart = formatDate(dateStart, 'YYYY-MM-DD')
    const accrualDateEnd = formatDate(dateEnd, 'YYYY-MM-DD')

    const handle = {} as const
    state.loadings.set(month, handle)

    const journals = await journalsService
      .searchJournals({
        query: {
          accrualDateStart,
          accrualDateEnd,
        },
        signal,
      })
      .finally(() => {
        if (state.loadings.get(month) === handle) {
          state.loadings.delete(month)
        }
      })

    state.monthlyJournals.set(month, {
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
