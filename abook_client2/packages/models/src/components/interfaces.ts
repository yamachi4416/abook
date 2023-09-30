import type { accountEditor, journalEdtitor } from '../editors'
import type {
  AbookEditModel,
  AbookViewModel,
  AccountEditModel,
  AccountViewModel,
  ApiValidationErrors,
  FinanceDiv,
  JournalBalanceModel,
  JournalEditModel,
  JournalViewModel,
} from '../share'

export interface AbookEditState {
  abook: AbookEditModel | undefined
  errors: ApiValidationErrors | undefined
}

export interface AccountEditState {
  original: AccountEditModel | undefined
  acconut: AccountEditModel | undefined
  editor: ReturnType<typeof accountEditor> | undefined
  errors: ApiValidationErrors | undefined
}

export interface JournalEditState {
  original: JournalEditModel | undefined
  journal: JournalEditModel | undefined
  editor: ReturnType<typeof journalEdtitor> | undefined
  accounts: AccountViewModel[]
  errors: ApiValidationErrors | undefined
}

export interface MonthlyJournalsState {
  month: string
  abook: AbookViewModel
  monthlyJournals: Map<
    string,
    {
      month: string
      dateStart: Date
      dateEnd: Date
      journals: JournalViewModel[]
    }
  >
  loadings: Map<string, {}>
}

export interface JournalsBalancePeriod {
  month: string
  key: string
  fromDate: Date
  fromDateYmd: string
  toDate: Date
  toDateYmd: string
}

export interface JournalsFinanceBalances {
  financeDiv: FinanceDiv
  amount: number
  accounts: Map<string, number>
}

export interface JournalsBalanceState {
  month: string
  months: number
  abook: AbookViewModel
  accounts: AccountViewModel[]
  periods: JournalsBalancePeriod[]
  balances: Map<string, Map<FinanceDiv, JournalsFinanceBalances>>
  loadings: Map<string, {}>
}

export interface JournalsTimeline {
  date: Date
  accrualDate: string
  journals: JournalViewModel[]
}

export interface FinanceSummary {
  financeDiv: FinanceDiv
  amount: number
  accounts: {
    id: string
    name: string
    color: string
    amount: number
    dispOrder: number
  }[]
}
