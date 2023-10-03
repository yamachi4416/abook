import type {
  AbookEditModel,
  AbookViewModel,
  AccountEditModel,
  AccountModelEditor,
  AccountViewModel,
  ApiValidationErrors,
  FinanceDiv,
  JournalEditModel,
  JournalModelEditor,
  JournalsBalancePeriod,
  JournalsFinanceBalances,
  MonthlyJournal,
  ValidationErrors,
} from '../models'

export interface AbookViewState {
  today: Date
  abook: AbookViewModel
}

export interface AbookViewComponent<State extends AbookViewState> {
  state: State
  views: {
    readonly isRegisted: boolean
    readonly startOfMonthDate: Date
    readonly endOfMonthDate: Date
  }
}

export interface AbookEditState {
  abook: AbookEditModel | undefined
  errors: ApiValidationErrors | undefined
}

export interface AbookEditComponent<State extends AbookEditState> {
  state: State
  errors: ValidationErrors<AbookEditModel>
  readAbook(): Promise<void>
  saveAbook(): Promise<void>
}

export interface AccountEditState {
  original: AccountEditModel | undefined
  acconut: AccountEditModel | undefined
  editor: AccountModelEditor | undefined
  errors: ApiValidationErrors | undefined
}

export interface AccountEditComponent<State extends AccountEditState> {
  state: State
  errors: ValidationErrors<AccountEditModel>
  readAccount(args: { id?: string; signal?: AbortSignal }): Promise<void>
  saveAccount(): Promise<{ id: string } | undefined>
}

export interface JournalEditState {
  original: JournalEditModel | undefined
  journal: JournalEditModel | undefined
  editor: JournalModelEditor | undefined
  accounts: AccountViewModel[]
  errors: ApiValidationErrors | undefined
}

export interface JournalEditComponent<State extends JournalEditState> {
  state: State
  errors: ValidationErrors<JournalEditModel>
  options: {
    readonly debitAccounts: AccountViewModel[]
    readonly feeAccounts: AccountViewModel[]
    readonly creditAccounts: AccountViewModel[]
  }
  readJournal(args: { id?: string; signal?: AbortSignal }): Promise<void>
  saveJournal(): Promise<{ id: string } | undefined>
}

export interface MonthlyJournalsState {
  month: string
  abook: AbookViewModel
  monthlyJournals: Map<string, MonthlyJournal>
  loadings: Map<string, {}>
}

export interface MonthlyJournalsComponent<State extends MonthlyJournalsState> {
  state: State
  searchJournals(args: { month: string; signal?: AbortSignal }): Promise<void>
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

export interface JournalsBalanceComponent<State extends JournalsBalanceState> {
  state: State
  searchBalances(args: { signal?: AbortSignal }): Promise<void>
}
