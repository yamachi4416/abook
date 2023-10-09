export const FinanceDivs = {
  Income: 1,
  Expense: 2,
  Assets: 3,
  Liabilities: 4,
} as const

export type FinanceDiv = (typeof FinanceDivs)[keyof typeof FinanceDivs]

export const JournalDivs = {
  Income: 1,
  Expense: 2,
  Transfer: 3,
} as const

export type JournalDiv = (typeof JournalDivs)[keyof typeof JournalDivs]

export interface AbookViewModel {
  readonly abookId: string
  readonly name: string
  readonly memo: string
  readonly startOfMonthDate: number
  readonly startOfMonthIsPrev: boolean
}

export interface AbookEditModel {
  abookId?: string
  name: string
  memo?: string
  startOfMonthDate: number
  startOfMonthIsPrev: boolean
}

export interface AccountViewModel {
  readonly id: string
  readonly name: string
  readonly financeDiv: FinanceDiv
  readonly useFee: boolean
  readonly avaliable: boolean
  readonly color: string
  readonly usuallyUsedForPayment: boolean
  readonly usuallyUsedForReceipt: boolean
  readonly dispOrder: number
}

export interface AccountEditModel {
  id?: string
  name: string
  financeDiv?: FinanceDiv
  useFee: boolean
  avaliable: boolean
  color: string
  usuallyUsedForPayment: boolean
  usuallyUsedForReceipt: boolean
}

export interface AccountModelEditor {
  readonly id: string | undefined
  name: string
  financeDiv: FinanceDiv | undefined
  useFee: boolean
  avaliable: boolean
  color: string
  usuallyUsedForPayment: boolean
  usuallyUsedForReceipt: boolean
  readonly isEnableUseFee: boolean
  readonly isEnableUsuallyUsedForPayment: boolean
}

export interface FeeViewModel {
  readonly account: AccountViewModel
  readonly amount: number
}

export interface JounalEditAccountModel {
  id: string
}

export interface FeeEditModel {
  account?: JounalEditAccountModel
  amount?: number
}

export interface JournalViewModel {
  readonly id: string
  readonly accrualDate: string
  readonly journalDiv: JournalDiv
  readonly amount: number
  readonly memo?: string
  readonly debitAccount: AccountViewModel
  readonly creditAccount: AccountViewModel
  readonly fee?: FeeViewModel
}

export interface JournalEditModel {
  id?: string
  accrualDate?: string
  journalDiv?: JournalDiv
  amount?: number
  memo?: string
  debitAccount?: JounalEditAccountModel
  creditAccount?: JounalEditAccountModel
  fee?: FeeEditModel
}

export interface JournalModelEditor {
  readonly id: string | undefined
  accrualDate: string | undefined
  journalDiv: JournalDiv | undefined
  debitAccountId: string | undefined
  creditAccountId: string | undefined
  memo: string | undefined
  amount: number | undefined
  readonly useFee: boolean
  feeAccountId: string | undefined
  feeUseAmount: number | undefined
  feeAmount: number | undefined
}

export interface JournalSearchModel {
  accountId?: string
  journalDiv?: JournalDiv
  financeDiv?: FinanceDiv
  memo?: string
  accrualDateStart?: string
  accrualDateEnd?: string
}

export interface JournalBalanceModel {
  readonly key: string
  readonly accountId: string
  readonly debitAmount: number
  readonly creditAmount: number
}

export interface JournalsTimeline {
  readonly date: Date
  readonly accrualDate: string
  readonly journals: JournalViewModel[]
}

export interface FinanceSummary {
  readonly financeDiv: FinanceDiv
  readonly amount: number
  readonly accounts: Readonly<{
    id: string
    name: string
    color: string
    amount: number
    dispOrder: number
  }>[]
}

export interface MonthlyJournal {
  readonly month: string
  readonly dateStart: Date
  readonly dateEnd: Date
  readonly journals: JournalViewModel[]
}

export interface JournalsBalancePeriod {
  readonly month: string
  readonly key: string
  readonly fromDate: Date
  readonly fromDateYmd: string
  readonly toDate: Date
  readonly toDateYmd: string
}

export interface JournalsFinanceBalances {
  readonly financeDiv: FinanceDiv
  readonly amount: number
  readonly accounts: Map<string, number>
}

export interface ApiValidationErrors {
  readonly [key: string]: Readonly<{
    key?: string
    error: string
  }>[]
}

export interface ValidationErrors<T> {
  clearErrors(): void
  hasErrors(key?: RegExp | keyof T | '*'): boolean
  getErrors(key: RegExp | keyof T | '*'): string[]
  setErrors(err: ApiValidationErrors): void
}

export class ApiValidationError extends Error {
  public readonly errors

  constructor(err: Error, errors: ApiValidationErrors) {
    super(err.message)

    this.name = 'ApiValidationError'

    if (err?.cause && !this.cause) {
      this.cause = err.cause
    }

    this.errors = errors
  }
}
