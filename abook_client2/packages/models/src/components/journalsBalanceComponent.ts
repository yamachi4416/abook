import { AccountsService, JournalsService } from '../services'
import { AccountViewModel, FinanceDiv, FinanceDivs } from '../share'
import { toCurrentMonthPeriod } from '../utils/abook'
import { formatDate, parseDate, plusDate } from '../utils/date'
import { JournalsBalanceState, JournalsFinanceBalances } from './interfaces'

export function journalsBalanceComponent<State extends JournalsBalanceState>({
  journalsService,
  accountsService,
  state,
}: {
  journalsService: JournalsService
  accountsService: AccountsService
  state: State
}) {
  async function searchBalances({ signal }: { signal?: AbortSignal }) {
    const { month, months, abook } = state

    const date = parseDate(month, 'YYYYMM')
    const periods = [...Array(months + 1).keys()]
      .map((i) => plusDate(date, { month: -1 * i }))
      .map((date) => {
        const { month, fromDate, toDate } = toCurrentMonthPeriod({
          date,
          abook,
        })
        const fromDateYmd = formatDate(fromDate, 'YYYYMMDD')
        const toDateYmd = formatDate(toDate, 'YYYYMMDD')
        return {
          month,
          key: `${fromDateYmd}${toDateYmd}`,
          fromDate,
          fromDateYmd,
          toDate,
          toDateYmd,
        }
      })

    state.periods = periods.slice(0, months)

    const handle = {} as const
    state.loadings.set(month, handle)

    const [accounts, balances] = await Promise.all([
      accountsService.getAllAccounts({ signal }),
      journalsService.searchBalances({
        accrualDateStart: periods[periods.length - 1].fromDate,
        accrualDateEnd: periods[0].toDate,
        periods: periods
          .slice(0, periods.length - 1)
          .map(({ fromDateYmd }) => fromDateYmd),
        signal,
      }),
    ]).finally(() => {
      if (state.loadings.get(month) === handle) {
        state.loadings.delete(month)
      }
    })

    state.accounts = accounts

    const accountMap = new Map<string, AccountViewModel>(
      accounts.map((account) => [account.id, account]),
    )

    const newBalances = new Map<
      string,
      Map<FinanceDiv, JournalsFinanceBalances>
    >()

    for (const { key, accountId, creditAmount, debitAmount } of balances) {
      const account = accountMap.get(accountId)
      if (!account) {
        continue
      }

      const { id, financeDiv } = account

      const financeMap =
        newBalances.get(key) ?? new Map<FinanceDiv, JournalsFinanceBalances>()
      newBalances.set(key, financeMap)

      const finances = financeMap.get(financeDiv) ?? {
        financeDiv: account.financeDiv,
        amount: 0,
        accounts: new Map<string, number>(),
      }
      financeMap.set(financeDiv, finances)

      const amount =
        FinanceDivs.Income === financeDiv ||
        FinanceDivs.Liabilities === financeDiv
          ? creditAmount - debitAmount
          : debitAmount - creditAmount

      finances.amount += amount
      finances.accounts.set(id, amount)
    }

    for (const [key, newBalance] of newBalances.entries()) {
      state.balances.set(key, newBalance)
    }
  }

  return {
    state,
    searchBalances,
  }
}
