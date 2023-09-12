import { AccountViewModel, FinanceDiv, JournalDiv, JournalEditModel } from '..'
import { getAllCreditAccounts, getAllDebitAccounts } from '../utils/journal'

function isValidJournalDiv(value?: any): value is JournalDiv | undefined {
  return (
    value === undefined ||
    value === JournalDiv.Income ||
    value === JournalDiv.Expense ||
    value === JournalDiv.Transfer
  )
}

function isValidAmount(value?: any): value is number | undefined {
  if (typeof value === 'number') {
    return value === 0 || !!value
  }
  return value === undefined
}

function onChangeDebitAccount({
  journal,
  accounts,
}: {
  journal: JournalEditModel
  accounts: AccountViewModel[]
}) {
  if (!journal.debitAccount) {
    return
  }

  const debitAccount = accounts.find(
    ({ id }) => id === journal.debitAccount?.id,
  )

  if (debitAccount?.financeDiv === FinanceDiv.Expense) {
    journal.journalDiv = JournalDiv.Expense
  } else if (journal.creditAccount && !journal.journalDiv) {
    const creditAccount = accounts.find(
      ({ id }) => id === journal.creditAccount?.id,
    )
    if (creditAccount?.financeDiv === FinanceDiv.Income) {
      journal.journalDiv = JournalDiv.Income
    } else {
      journal.journalDiv = JournalDiv.Transfer
    }
  }
}

function onChangeCreditAccount({
  journal,
  accounts,
}: {
  journal: JournalEditModel
  accounts: AccountViewModel[]
}) {
  if (!journal.creditAccount) {
    return
  }

  const creditAccount = accounts.find(
    ({ id }) => id === journal.creditAccount?.id,
  )

  if (creditAccount?.financeDiv === FinanceDiv.Income) {
    journal.journalDiv = JournalDiv.Income
  } else if (journal.debitAccount && !journal.journalDiv) {
    const debitAccount = accounts.find(
      ({ id }) => id === journal.debitAccount?.id,
    )
    if (debitAccount?.financeDiv === FinanceDiv.Expense) {
      journal.journalDiv = JournalDiv.Expense
    } else {
      journal.journalDiv = JournalDiv.Transfer
    }
  }
}

function onChangeJournalDiv({
  journal,
  accounts,
}: {
  journal: JournalEditModel
  accounts: AccountViewModel[]
}) {
  if (journal.debitAccount) {
    const debitAccount = journal.debitAccount
    const debitAccounts = getAllDebitAccounts({ journal, accounts })
    if (!debitAccounts.some(({ id }) => id === debitAccount.id)) {
      journal.debitAccount = undefined
    }
  }

  if (journal.creditAccount) {
    const creditAccount = journal.creditAccount
    const creditAccounts = getAllCreditAccounts({ journal, accounts })
    if (!creditAccounts.some(({ id }) => id === creditAccount.id)) {
      journal.creditAccount = undefined
    }
  }

  if (journal.journalDiv === JournalDiv.Income) {
    if (!journal.debitAccount) {
      journal.debitAccount = accounts.find(
        ({ usuallyUsedForReceipt }) => usuallyUsedForReceipt,
      )
    }
  }

  if (journal.journalDiv === JournalDiv.Expense) {
    if (!journal.creditAccount) {
      journal.creditAccount = accounts.find(
        ({ usuallyUsedForPayment }) => usuallyUsedForPayment,
      )
    }
  }

  if (journal.journalDiv === JournalDiv.Transfer) {
    journal.fee = {}
  } else {
    journal.fee = undefined
  }
}

function onChangeFeeAccount({ journal }: { journal: JournalEditModel }) {
  if (journal.fee?.account) {
    journal.fee.amount = journal.amount
  } else {
    journal.fee = {}
  }
}

export function journalEdtitor({
  journal,
  accounts,
}: {
  journal: { value: JournalEditModel }
  accounts: AccountViewModel[]
}) {
  return {
    get accrualDate() {
      return journal.value.accrualDate
    },
    set accrualDate(value) {
      if (journal.value.accrualDate === value) {
        return
      }
      journal.value.accrualDate = value
    },

    get journalDiv() {
      return journal.value.journalDiv
    },
    set journalDiv(value) {
      if (journal.value.journalDiv === value) {
        return
      }
      if (!isValidJournalDiv(value)) {
        return
      }
      journal.value.journalDiv = value
      onChangeJournalDiv({
        journal: journal.value,
        accounts,
      })
    },

    get debitAccountId() {
      return journal.value.debitAccount?.id
    },
    set debitAccountId(id) {
      if (journal.value.debitAccount?.id === id) {
        return
      }
      journal.value.debitAccount = id ? { id } : undefined
      onChangeDebitAccount({
        journal: journal.value,
        accounts,
      })
    },

    get creditAccountId() {
      return journal.value.creditAccount?.id
    },
    set creditAccountId(id) {
      if (journal.value.creditAccount?.id === id) {
        return
      }
      journal.value.creditAccount = id ? { id } : undefined
      onChangeCreditAccount({
        journal: journal.value,
        accounts,
      })
    },

    get memo() {
      return journal.value.memo
    },
    set memo(value) {
      journal.value.memo = value
    },

    get amount() {
      return journal.value.amount
    },
    set amount(value) {
      if (isValidAmount(value)) {
        journal.value.amount = value
      } else {
        journal.value.amount = undefined
      }
    },

    get useFee() {
      return !!journal.value.fee
    },

    get feeAccountId() {
      return journal.value.fee?.account?.id
    },
    set feeAccountId(id) {
      if (journal.value.fee?.account?.id === id) {
        return
      }
      if (!journal.value.fee) {
        journal.value.fee = {}
      }
      journal.value.fee.account = id ? { id } : undefined
      onChangeFeeAccount({
        journal: journal.value,
      })
    },

    get feeUseAmount() {
      const amount = journal.value.amount ?? 0
      const fee = journal.value.fee?.amount ?? 0
      return amount - fee || undefined
    },
    set feeUseAmount(value) {
      if (isValidAmount(value)) {
        const fee = journal.value.fee?.amount ?? 0
        journal.value.amount = (value ?? 0) + fee || undefined
      }
    },

    get feeAmount() {
      return journal.value.fee?.amount
    },
    set feeAmount(value) {
      if (!journal.value.fee) {
        return
      }
      if (isValidAmount(value)) {
        journal.value.fee.amount = value
      }
    },
  }
}
