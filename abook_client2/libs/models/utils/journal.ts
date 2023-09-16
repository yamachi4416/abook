import {
  AccountViewModel,
  FinanceDiv,
  JournalDiv,
  JournalEditModel,
  JournalViewModel,
} from '..'

type AccountSummary = AccountViewModel & {
  debitAmount: number
  creditAmount: number
  amount: number
  journals: JournalViewModel[]
}

type FinanceSummary = {
  financeDiv: FinanceDiv
  debitAmount: number
  creditAmount: number
  amount: number
  accounts: AccountSummary[]
}

export function getAllDebitAccounts({
  journal,
  accounts,
}: {
  journal: JournalEditModel
  accounts: AccountViewModel[]
}) {
  if (journal.journalDiv === JournalDiv.Income) {
    return accounts.filter(
      ({ financeDiv }) =>
        FinanceDiv.Assets === financeDiv ||
        FinanceDiv.Liabilities === financeDiv,
    )
  }

  if (journal.journalDiv === JournalDiv.Expense) {
    return accounts.filter(
      ({ financeDiv }) => FinanceDiv.Expense === financeDiv,
    )
  }

  if (journal.journalDiv === JournalDiv.Transfer) {
    const credit = journal.creditAccount
    if (credit) {
      return accounts.filter(
        ({ id, financeDiv }) =>
          (FinanceDiv.Assets === financeDiv ||
            FinanceDiv.Liabilities === financeDiv) &&
          id !== credit.id,
      )
    }

    return accounts.filter(
      ({ financeDiv }) =>
        FinanceDiv.Assets === financeDiv ||
        FinanceDiv.Liabilities === financeDiv,
    )
  }

  return accounts.filter(
    ({ financeDiv }) =>
      FinanceDiv.Expense === financeDiv ||
      FinanceDiv.Assets === financeDiv ||
      FinanceDiv.Liabilities === financeDiv,
  )
}

export function getAllCreditAccounts({
  journal,
  accounts,
}: {
  journal: JournalEditModel
  accounts: AccountViewModel[]
}) {
  if (journal.journalDiv === JournalDiv.Income) {
    return accounts.filter(({ financeDiv }) => FinanceDiv.Income === financeDiv)
  }

  if (journal.journalDiv === JournalDiv.Expense) {
    return accounts.filter(
      ({ financeDiv }) =>
        FinanceDiv.Assets === financeDiv ||
        FinanceDiv.Liabilities === financeDiv,
    )
  }

  if (journal.journalDiv === JournalDiv.Transfer) {
    const debit = journal.debitAccount
    if (debit) {
      return accounts.filter(
        ({ id, financeDiv }) =>
          (FinanceDiv.Assets === financeDiv ||
            FinanceDiv.Liabilities === financeDiv) &&
          id !== debit.id,
      )
    }
    return accounts.filter(
      ({ financeDiv }) =>
        FinanceDiv.Assets === financeDiv ||
        FinanceDiv.Liabilities === financeDiv,
    )
  }

  return accounts.filter(
    ({ financeDiv }) =>
      FinanceDiv.Income === financeDiv ||
      FinanceDiv.Assets === financeDiv ||
      FinanceDiv.Liabilities === financeDiv,
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
    .filter(({ financeDiv }) => financeDiv === FinanceDiv.Expense)
    .filter(
      ({ id, avaliable, useFee }) => (avaliable && useFee) || id === a1?.id,
    )
}

function summaryOfAccount({
  journals,
  accounts,
}: {
  journals: JournalViewModel[]
  accounts: AccountViewModel[]
}) {
  const idMap = new Map<string, AccountSummary>()

  function mergeAccountSummary({
    account,
    debitAmount,
    creditAmount,
    journal,
  }: {
    account: AccountViewModel
    debitAmount?: number
    creditAmount?: number
    journal?: JournalViewModel
  }) {
    const value = idMap.get(account.id) ?? {
      ...account,
      debitAmount: 0,
      creditAmount: 0,
      amount: 0,
      journals: [],
    }

    if (!idMap.has(account.id)) {
      idMap.set(account.id, value)
    }

    value.debitAmount += debitAmount ?? 0
    value.creditAmount += creditAmount ?? 0

    if (
      value.financeDiv === FinanceDiv.Income ||
      value.financeDiv === FinanceDiv.Liabilities
    ) {
      value.amount = value.creditAmount - value.debitAmount
    } else {
      value.amount = value.debitAmount - value.creditAmount
    }

    if (journal) {
      value.journals.push(journal)
    }
  }

  for (const account of accounts) {
    mergeAccountSummary({ account })
  }

  for (const journal of journals) {
    mergeAccountSummary({
      journal,
      account: journal.creditAccount,
      creditAmount: journal.amount - (journal.fee?.amount ?? 0),
    })

    mergeAccountSummary({
      journal,
      account: journal.debitAccount,
      debitAmount: journal.amount,
    })

    if (journal.fee) {
      mergeAccountSummary({
        journal,
        account: journal.fee.account,
        debitAmount: journal.fee.amount,
      })
    }
  }

  return idMap
}

export function toSummaryOfAccount({
  journals,
  accounts,
}: {
  journals: JournalViewModel[]
  accounts: AccountViewModel[]
}) {
  return [...summaryOfAccount({ journals, accounts }).values()].toSorted(
    (a, b) => {
      if (a.financeDiv === b.financeDiv) {
        return a.dispOrder - b.dispOrder
      }
      return a.financeDiv - b.financeDiv
    },
  )
}

function summaryOfFinance({
  journals,
  accounts,
}: {
  journals: JournalViewModel[]
  accounts: AccountViewModel[]
}) {
  const financeMap = new Map<FinanceDiv, FinanceSummary>()

  for (const account of summaryOfAccount({ journals, accounts }).values()) {
    const value: FinanceSummary = financeMap.get(account.financeDiv) ?? {
      financeDiv: account.financeDiv,
      creditAmount: 0,
      debitAmount: 0,
      amount: 0,
      accounts: [],
    }

    if (!financeMap.get(account.financeDiv)) {
      financeMap.set(account.financeDiv, value)
    }

    value.creditAmount += account.creditAmount
    value.debitAmount += account.debitAmount
    value.amount += account.amount
    value.accounts.push(account)
  }

  return financeMap
}

export function toSummaryOfFinance({
  journals,
  accounts,
}: {
  journals: JournalViewModel[]
  accounts: AccountViewModel[]
}) {
  const values = [...summaryOfFinance({ journals, accounts }).values()]

  for (const account of values) {
    account.accounts = account.accounts.toSorted(
      (a, b) => a.dispOrder - b.dispOrder,
    )
  }

  return values.toSorted((a, b) => a.financeDiv - b.financeDiv)
}
