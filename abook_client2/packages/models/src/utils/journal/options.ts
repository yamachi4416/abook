import {
  AccountViewModel,
  FinanceDivs,
  JournalDivs,
  JournalEditModel,
} from '../deps'

export function getAllDebitAccounts({
  journal,
  accounts,
}: {
  journal: Readonly<JournalEditModel>
  accounts: Readonly<AccountViewModel[]>
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
  accounts: Readonly<AccountViewModel[]>
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
  original: Readonly<JournalEditModel>
  journal: Readonly<JournalEditModel>
  accounts: Readonly<AccountViewModel[]>
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
  original: Readonly<JournalEditModel>
  journal: Readonly<JournalEditModel>
  accounts: Readonly<AccountViewModel[]>
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
  original: Readonly<JournalEditModel>
  accounts: Readonly<AccountViewModel[]>
}) {
  const a1 = original.fee?.account
  return accounts
    .filter(({ financeDiv }) => financeDiv === FinanceDivs.Expense)
    .filter(
      ({ id, avaliable, useFee }) => (avaliable && useFee) || id === a1?.id,
    )
}
