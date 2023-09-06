declare namespace Models {
  interface AbookViewModel {
    readonly abookId: string
    readonly name: string
    readonly memo: string
    readonly startOfMonthDate: number
    readonly startOfMonthIsPrev: boolean
  }

  interface AbookEditModel {
    abookId?: string
    name: string
    memo?: string
    startOfMonthDate: number
    startOfMonthIsPrev: boolean
  }

  enum FinanceDiv {
    Income = 1,
    Expense = 2,
    Assets = 3,
    Liabilities = 4,
  }

  interface AccountViewModel {
    readonly id: string
    readonly name: string
    readonly financeDiv?: FinanceDiv
    readonly useFee: boolean
    readonly avaliable: boolean
    readonly color: string
    readonly usuallyUsedForPayment: boolean
    readonly usuallyUsedForReceipt: boolean
    readonly dispOrder: number
  }

  interface AccountEditModel {
    id?: string
    name: string
    financeDiv?: FinanceDiv
    useFee: boolean
    avaliable: boolean
    color: string
    usuallyUsedForPayment: boolean
    usuallyUsedForReceipt: boolean
  }

  interface FeeViewModel {
    readonly account: AccountViewModel
    readonly amount?: number
  }

  interface FeeEditModel {
    account?: JounalEditAccountModel
    amount?: number
  }

  enum JournalDiv {
    Income = 1,
    Expense = 2,
    Transfer = 3,
  }

  interface JounalEditAccountModel {
    id: string
  }

  interface JournalViewModel {
    readonly id: string
    readonly accrualDate: string
    readonly journalDiv: JournalDiv
    readonly amount: number
    readonly memo?: string
    readonly debitAccount: AccountViewModel
    readonly creditAccount: AccountViewModel
    readonly fee?: FeeViewModel
  }

  interface JournalEditModel {
    accrualDate?: string
    journalDiv?: JournalDiv
    amount?: number
    memo?: string
    debitAccount?: JounalEditAccountModel
    creditAccount?: JounalEditAccountModel
    fee?: FeeEditModel
  }

  interface JournalSearchModel {
    accountId?: string
    journalDiv?: JournalDiv
    financeDiv?: FinanceDiv
    memo?: string
    accrualDateStart?: string
    accrualDateEnd?: string
  }
}
