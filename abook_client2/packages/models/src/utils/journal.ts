import {
  AccountViewModel,
  FinanceDiv,
  FinanceDivs,
  FinanceSummary,
  JournalDivs,
  JournalEditModel,
  JournalViewModel,
  JournalsBalancePeriod,
  JournalsFinanceBalances,
  JournalsTimeline,
  MonthlyJournalsState,
} from '..'
import { formatDate, parseDate, plusFormatedDate, toCalendar } from './date'

export function getAllDebitAccounts({
  journal,
  accounts,
}: {
  journal: JournalEditModel
  accounts: AccountViewModel[]
}) {
  if (journal.journalDiv === JournalDivs.Income) {
    return accounts.filter(
      ({ financeDiv }) =>
        FinanceDivs.Assets === financeDiv ||
        FinanceDivs.Liabilities === financeDiv,
    )
  }

  if (journal.journalDiv === JournalDivs.Expense) {
    return accounts.filter(
      ({ financeDiv }) => FinanceDivs.Expense === financeDiv,
    )
  }

  if (journal.journalDiv === JournalDivs.Transfer) {
    const credit = journal.creditAccount
    if (credit) {
      return accounts.filter(
        ({ id, financeDiv }) =>
          (FinanceDivs.Assets === financeDiv ||
            FinanceDivs.Liabilities === financeDiv) &&
          id !== credit.id,
      )
    }

    return accounts.filter(
      ({ financeDiv }) =>
        FinanceDivs.Assets === financeDiv ||
        FinanceDivs.Liabilities === financeDiv,
    )
  }

  return accounts.filter(
    ({ financeDiv }) =>
      FinanceDivs.Expense === financeDiv ||
      FinanceDivs.Assets === financeDiv ||
      FinanceDivs.Liabilities === financeDiv,
  )
}

export function getAllCreditAccounts({
  journal,
  accounts,
}: {
  journal: JournalEditModel
  accounts: AccountViewModel[]
}) {
  if (journal.journalDiv === JournalDivs.Income) {
    return accounts.filter(
      ({ financeDiv }) => FinanceDivs.Income === financeDiv,
    )
  }

  if (journal.journalDiv === JournalDivs.Expense) {
    return accounts.filter(
      ({ financeDiv }) =>
        FinanceDivs.Assets === financeDiv ||
        FinanceDivs.Liabilities === financeDiv,
    )
  }

  if (journal.journalDiv === JournalDivs.Transfer) {
    const debit = journal.debitAccount
    if (debit) {
      return accounts.filter(
        ({ id, financeDiv }) =>
          (FinanceDivs.Assets === financeDiv ||
            FinanceDivs.Liabilities === financeDiv) &&
          id !== debit.id,
      )
    }
    return accounts.filter(
      ({ financeDiv }) =>
        FinanceDivs.Assets === financeDiv ||
        FinanceDivs.Liabilities === financeDiv,
    )
  }

  return accounts.filter(
    ({ financeDiv }) =>
      FinanceDivs.Income === financeDiv ||
      FinanceDivs.Assets === financeDiv ||
      FinanceDivs.Liabilities === financeDiv,
  )
}

export function getDebitAccounts({
  original,
  journal,
  accounts,
}: {
  original: JournalEditModel
  journal: JournalEditModel
  accounts: AccountViewModel[]
}) {
  const a1 = original.debitAccount
  const a2 = journal.debitAccount
  return getAllDebitAccounts({ journal, accounts }).filter(
    ({ id, avaliable }) => avaliable || id === a1?.id || id === a2?.id,
  )
}

export function getCreditAccounts({
  original,
  journal,
  accounts,
}: {
  original: JournalEditModel
  journal: JournalEditModel
  accounts: AccountViewModel[]
}) {
  const a1 = original.creditAccount
  const a2 = journal.creditAccount
  return getAllCreditAccounts({ journal, accounts }).filter(
    ({ id, avaliable }) => avaliable || id === a1?.id || id === a2?.id,
  )
}

export function getFeeAccounts({
  original,
  accounts,
}: {
  original: JournalEditModel
  accounts: AccountViewModel[]
}) {
  const a1 = original.fee?.account
  return accounts
    .filter(({ financeDiv }) => financeDiv === FinanceDivs.Expense)
    .filter(
      ({ id, avaliable, useFee }) => (avaliable && useFee) || id === a1?.id,
    )
}

export function toJournalsTimeline({
  journals,
}: {
  journals: JournalViewModel[]
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
  monthlyJournals: MonthlyJournalsState['monthlyJournals']
  weekStartDay?: number | undefined
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

  const sums = new Map<
    string,
    {
      income: number
      expense: number
    }
  >()

  const journals = [
    ...(prevMonthJournals?.journals ?? []),
    ...thisMonthJournals.journals,
    ...(nextMonthJournals?.journals ?? []),
  ]

  for (const { accrualDate, journalDiv, amount, fee } of journals) {
    const sum = sums.get(accrualDate) ?? {
      income: 0,
      expense: 0,
    }

    if (journalDiv === JournalDivs.Income) {
      sum.income += amount
    } else if (journalDiv === JournalDivs.Expense) {
      sum.expense += amount
    } else if (journalDiv === JournalDivs.Transfer) {
      sum.expense += fee?.amount ?? 0
    }

    if (!sums.has(accrualDate)) {
      sums.set(accrualDate, sum)
    }
  }

  const weeks = toCalendar({
    beginDate: thisMonthJournals.dateStart,
    endDate: thisMonthJournals.dateEnd,
    weekStartDay,
  }).map((week) =>
    week.map((date) => ({
      ...date,
      sum: sums.get(formatDate(date.date, 'YYYY-MM-DD')),
    })),
  )

  const summary = weeks
    .flatMap((week) => week)
    .filter(({ between }) => between)
    .reduce(
      ({ income, expense }, { sum }) => ({
        income: income + (sum?.income ?? 0),
        expense: expense + (sum?.expense ?? 0),
      }),
      {
        income: 0,
        expense: 0,
      },
    )

  return {
    weeks,
    summary,
  }
}

export function toSummaryOfFinance({
  journals,
}: {
  journals: JournalViewModel[]
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
    const summaries = new Map<string, (typeof allAccounts)[number]>()

    for (const account of allAccounts) {
      const summary = summaries.get(account.id) ?? { ...account, amount: 0 }
      summary.amount += account.amount
      summaries.set(account.id, summary)
    }

    finances.set(financeDiv, {
      financeDiv,
      amount: [...summaries.values()].reduce((a, { amount }) => a + amount, 0),
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
  const accountMap = new Map<string, AccountViewModel>()
  const financeAccountMap = new Map<FinanceDiv, AccountViewModel[]>([
    [FinanceDivs.Income, []],
    [FinanceDivs.Expense, []],
    [FinanceDivs.Assets, []],
    [FinanceDivs.Liabilities, []],
  ])

  for (const account of accounts) {
    accountMap.set(account.id, account)
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
