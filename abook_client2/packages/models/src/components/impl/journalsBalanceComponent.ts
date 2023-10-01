import {
  AbookEditModel,
  AbookUtils,
  AccountViewModel,
  AccountsService,
  DateUtils,
  FinanceDiv,
  FinanceDivs,
  JournalBalanceModel,
  JournalsBalanceComponent,
  JournalsBalancePeriod,
  JournalsBalanceState,
  JournalsFinanceBalances,
  JournalsService,
} from './deps'

function generatePeriods({
  abook,
  date,
  months,
}: {
  abook: AbookEditModel
  date: Date
  months: number
}): JournalsBalancePeriod[] {
  return AbookUtils.toAbookMonthPeriods({
    abook,
    date,
    months: months * -1,
  }).map(({ month, fromDate, toDate }) => {
    const fromDateYmd = DateUtils.formatDate(fromDate, 'YYYYMMDD')
    const toDateYmd = DateUtils.formatDate(toDate, 'YYYYMMDD')
    return {
      month,
      key: `${fromDateYmd}${toDateYmd}`,
      fromDate,
      fromDateYmd,
      toDate,
      toDateYmd,
    }
  })
}

function generateBalances({
  accounts,
  balances,
}: {
  accounts: AccountViewModel[]
  balances: JournalBalanceModel[]
}): Map<string, Map<FinanceDiv, JournalsFinanceBalances>> {
  type FinanceBalances = JournalsFinanceBalances & { amount: number }

  const accountMap = new Map<string, AccountViewModel>(
    accounts.map((account) => [account.id, account]),
  )

  const newBalances = new Map<string, Map<FinanceDiv, FinanceBalances>>()

  for (const { key, accountId, creditAmount, debitAmount } of balances) {
    const account = accountMap.get(accountId)
    if (!account) {
      continue
    }

    const { id, financeDiv } = account

    const financeMap =
      newBalances.get(key) ?? new Map<FinanceDiv, FinanceBalances>()
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

  return newBalances
}

export function journalsBalanceComponent<State extends JournalsBalanceState>({
  journalsService,
  accountsService,
  state,
}: {
  journalsService: JournalsService
  accountsService: AccountsService
  state: State
}): JournalsBalanceComponent<State> {
  async function searchBalances({ signal }: { signal?: AbortSignal }) {
    const { month, months, abook } = state

    const date = DateUtils.parseDate(month, 'YYYYMM')
    const periods = generatePeriods({ abook, date, months: months + 1 })

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

    for (const [key, balance] of generateBalances({
      accounts,
      balances,
    }).entries()) {
      state.balances.set(key, balance)
    }
  }

  return {
    state,
    searchBalances,
  }
}
