import {
  AccountViewModel,
  FinanceDivs,
  JournalDiv,
  JournalDivs,
  JournalEditModel,
  JournalModelEditor,
} from '../deps'
import { getAllCreditAccounts, getAllDebitAccounts } from '../journal'

function isValidJournalDiv(value?: any): value is JournalDiv | undefined {
  return (
    value === undefined ||
    value === JournalDivs.Income ||
    value === JournalDivs.Expense ||
    value === JournalDivs.Transfer
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

  if (debitAccount?.financeDiv === FinanceDivs.Expense) {
    journal.journalDiv = JournalDivs.Expense
  } else if (journal.creditAccount && !journal.journalDiv) {
    const creditAccount = accounts.find(
      ({ id }) => id === journal.creditAccount?.id,
    )
    if (creditAccount?.financeDiv === FinanceDivs.Income) {
      journal.journalDiv = JournalDivs.Income
    } else {
      journal.journalDiv = JournalDivs.Transfer
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

  if (creditAccount?.financeDiv === FinanceDivs.Income) {
    journal.journalDiv = JournalDivs.Income
  } else if (journal.debitAccount && !journal.journalDiv) {
    const debitAccount = accounts.find(
      ({ id }) => id === journal.debitAccount?.id,
    )
    if (debitAccount?.financeDiv === FinanceDivs.Expense) {
      journal.journalDiv = JournalDivs.Expense
    } else {
      journal.journalDiv = JournalDivs.Transfer
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
    const debitAccounts = getAllDebitAccounts({
      journal,
      accounts,
    })
    if (!debitAccounts.some(({ id }) => id === debitAccount.id)) {
      journal.debitAccount = undefined
    }
  }

  if (journal.creditAccount) {
    const creditAccount = journal.creditAccount
    const creditAccounts = getAllCreditAccounts({
      journal,
      accounts,
    })
    if (!creditAccounts.some(({ id }) => id === creditAccount.id)) {
      journal.creditAccount = undefined
    }
  }

  if (journal.journalDiv === JournalDivs.Income) {
    if (!journal.debitAccount) {
      journal.debitAccount = accounts.find(
        ({ usuallyUsedForReceipt }) => usuallyUsedForReceipt,
      )
    }
  }

  if (journal.journalDiv === JournalDivs.Expense) {
    if (!journal.creditAccount) {
      journal.creditAccount = accounts.find(
        ({ usuallyUsedForPayment }) => usuallyUsedForPayment,
      )
    }
  }

  if (journal.journalDiv === JournalDivs.Transfer) {
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
  journal: JournalEditModel
  accounts: AccountViewModel[]
}): JournalModelEditor {
  return {
    get id() {
      return journal.id
    },

    get accrualDate() {
      return journal.accrualDate
    },
    set accrualDate(value) {
      if (journal.accrualDate === value) {
        return
      }
      journal.accrualDate = value
    },

    get journalDiv() {
      return journal.journalDiv
    },
    set journalDiv(value) {
      if (journal.journalDiv === value) {
        return
      }
      if (!isValidJournalDiv(value)) {
        return
      }
      journal.journalDiv = value
      onChangeJournalDiv({ journal, accounts })
    },

    get debitAccountId() {
      return journal.debitAccount?.id
    },
    set debitAccountId(id) {
      if (journal.debitAccount?.id === id) {
        return
      }
      journal.debitAccount = id ? { id } : undefined
      onChangeDebitAccount({ journal, accounts })
    },

    get creditAccountId() {
      return journal.creditAccount?.id
    },
    set creditAccountId(id) {
      if (journal.creditAccount?.id === id) {
        return
      }
      journal.creditAccount = id ? { id } : undefined
      onChangeCreditAccount({ journal, accounts })
    },

    get memo() {
      return journal.memo
    },
    set memo(value) {
      journal.memo = value
    },

    get amount() {
      return journal.amount
    },
    set amount(value) {
      if (isValidAmount(value)) {
        journal.amount = value
      } else {
        journal.amount = undefined
      }
    },

    get useFee() {
      return !!journal.fee
    },

    get feeAccountId() {
      return journal.fee?.account?.id
    },
    set feeAccountId(id) {
      if (journal.fee?.account?.id === id) {
        return
      }
      if (!journal.fee) {
        journal.fee = {}
      }
      journal.fee.account = id ? { id } : undefined
      onChangeFeeAccount({ journal })
    },

    get feeUseAmount() {
      const amount = journal.amount ?? 0
      const fee = journal.fee?.amount ?? 0
      return amount - fee || undefined
    },
    set feeUseAmount(value) {
      if (isValidAmount(value)) {
        const fee = journal.fee?.amount ?? 0
        journal.amount = (value ?? 0) + fee || undefined
      }
    },

    get feeAmount() {
      return journal.fee?.amount
    },
    set feeAmount(value) {
      if (!journal.fee) {
        return
      }
      if (isValidAmount(value)) {
        journal.fee.amount = value
      }
    },
  }
}
