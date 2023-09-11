import { AccountViewModel, FinanceDiv, JournalDiv, JournalEditModel } from '..'

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
