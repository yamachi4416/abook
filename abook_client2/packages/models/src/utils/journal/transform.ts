import {
  AccountViewModel,
  FinanceDiv,
  FinanceDivs,
  FinanceSummary,
  JournalDivs,
  JournalViewModel,
  JournalsBalancePeriod,
  JournalsFinanceBalances,
  JournalsTimeline,
  MonthlyJournal,
} from '../deps'
import {
  WeekDay,
  formatDate,
  parseDate,
  plusFormatedDate,
  toCalendarWeeks,
} from '../date'

export function toJournalsTimeline({
  journals,
}: {
  journals: Readonly<JournalViewModel[]>
}) {
  const timelines = new Map<string, JournalsTimeline>()

  for (const journal of journals) {
    const { accrualDate } = journal

    const timeline = timelines.get(accrualDate) ?? {
      date: parseDate(accrualDate, 'YYYY-MM-DD'),
      accrualDate,
      journals: [],
    }

    timeline.journals.push(journal)

    if (!timelines.has(accrualDate)) {
      timelines.set(accrualDate, timeline)
    }
  }

  return [...timelines.values()]
}

export function toJournalsCalendar({
  month,
  monthlyJournals,
  weekStartDay,
}: {
  month: string
  monthlyJournals: Readonly<Map<string, MonthlyJournal>>
  weekStartDay?: WeekDay
}) {
  const thisMonthJournals = monthlyJournals.get(month)

  if (!thisMonthJournals) {
    return {
      weeks: [],
      summary: { income: 0, expense: 0 },
    }
  }

  const prevMonthJournals = monthlyJournals.get(
    plusFormatedDate(month, { month: -1 }, 'YYYYMM'),
  )
  const nextMonthJournals = monthlyJournals.get(
    plusFormatedDate(month, { month: -1 }, 'YYYYMM'),
  )

  const sums = new Map<string, { income: number; expense: number }>()

  const journals = [
    ...(prevMonthJournals?.journals ?? []),
    ...thisMonthJournals.journals,
    ...(nextMonthJournals?.journals ?? []),
  ]

  for (const { accrualDate, journalDiv, amount, fee } of journals) {
    let sum = sums.get(accrualDate)
    if (!sum) {
      sum = { income: 0, expense: 0 }
      sums.set(accrualDate, sum)
    }

    if (journalDiv === JournalDivs.Income) {
      sum.income += amount
    } else if (journalDiv === JournalDivs.Expense) {
      sum.expense += amount
    } else if (journalDiv === JournalDivs.Transfer) {
      sum.expense += fee?.amount ?? 0
    }
  }

  const weeks = toCalendarWeeks({
    beginDate: thisMonthJournals.dateStart,
    endDate: thisMonthJournals.dateEnd,
    weekStartDay,
  }).map((week) =>
    week.map((date) => ({
      ...date,
      sum: sums.get(formatDate(date.date, 'YYYY-MM-DD')) ?? {
        income: 0,
        expense: 0,
      },
    })),
  )

  const summary = weeks
    .flatMap((week) => week)
    .filter(({ between }) => between)
    .map(({ sum }) => sum)
    .reduce((a, b) => ({
      income: a.income + b.income,
      expense: a.expense + b.expense,
    }))

  return {
    weeks,
    summary,
  }
}

export function toSummaryOfFinance({
  journals,
}: {
  journals: Readonly<JournalViewModel[]>
}): Map<FinanceDiv, FinanceSummary> {
  const finances = new Map<FinanceDiv, FinanceSummary>()
  const financeAccounts = new Map<FinanceDiv, FinanceSummary['accounts']>()

  for (const financeDiv of [
    FinanceDivs.Income,
    FinanceDivs.Expense,
    FinanceDivs.Assets,
    FinanceDivs.Liabilities,
  ]) {
    finances.set(financeDiv, { financeDiv, amount: 0, accounts: [] })
    financeAccounts.set(financeDiv, [])
  }

  for (const { creditAccount, debitAccount, amount, fee } of journals) {
    financeAccounts.get(creditAccount.financeDiv)?.push({
      id: creditAccount.id,
      name: creditAccount.name,
      color: creditAccount.color,
      dispOrder: creditAccount.dispOrder,
      amount: amount - (fee?.amount ?? 0),
    })

    financeAccounts.get(debitAccount.financeDiv)?.push({
      id: debitAccount.id,
      name: debitAccount.name,
      color: debitAccount.color,
      dispOrder: debitAccount.dispOrder,
      amount,
    })

    if (fee) {
      financeAccounts.get(fee.account.financeDiv)?.push({
        id: fee.account.id,
        name: fee.account.name,
        color: fee.account.color,
        dispOrder: fee.account.dispOrder,
        amount: fee.amount,
      })
    }
  }

  for (const [financeDiv, allAccounts] of financeAccounts) {
    let financeAmount = 0
    const summaries = new Map<string, (typeof allAccounts)[number]>()

    for (const account of allAccounts) {
      const summary = summaries.get(account.id) ?? { ...account, amount: 0 }
      summaries.set(account.id, {
        ...summary,
        amount: summary.amount + account.amount,
      })
      financeAmount += account.amount
    }

    finances.set(financeDiv, {
      financeDiv,
      amount: financeAmount,
      accounts: [...summaries.values()].toSorted(
        (a, b) => a.dispOrder - b.dispOrder,
      ),
    })
  }

  return finances
}

export function toJournalsBalanceTable({
  accounts,
  periods,
  balances,
}: {
  accounts: AccountViewModel[]
  periods: JournalsBalancePeriod[]
  balances: Map<string, Map<FinanceDiv, JournalsFinanceBalances>>
}) {
  const financeAccountMap = new Map<FinanceDiv, AccountViewModel[]>([
    [FinanceDivs.Income, []],
    [FinanceDivs.Expense, []],
    [FinanceDivs.Assets, []],
    [FinanceDivs.Liabilities, []],
  ])

  for (const account of accounts) {
    financeAccountMap.get(account.financeDiv)?.push(account)
  }

  return [...financeAccountMap.entries()]
    .filter(([, accounts]) => accounts.length > 0)
    .map(([financeDiv, accounts]) => ({
      financeDiv,
      amounts: periods.map(({ month, key }) => ({
        month,
        amount: balances.get(key)?.get(financeDiv)?.amount ?? 0,
      })),
      accounts: accounts
        .toSorted((a, b) => a.dispOrder - b.dispOrder)
        .map((account) => ({
          account,
          amounts: periods.map(({ month, key }) => ({
            month,
            amount:
              balances.get(key)?.get(financeDiv)?.accounts.get(account.id) ?? 0,
          })),
        })),
    }))
}
