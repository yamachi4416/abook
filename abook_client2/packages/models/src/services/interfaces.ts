import {
  AbookEditModel,
  AbookViewModel,
  AccountEditModel,
  AccountViewModel,
  ApiValidationErrors,
  JournalBalanceModel,
  JournalEditModel,
  JournalSearchModel,
  JournalViewModel,
} from '../share'

export interface ApiRequestService {
  $get<R>(params: {
    path: string
    query?: any
    signal?: AbortSignal
  }): Promise<R>
  $post<R, P = {}>(params: { path: string; body?: P }): Promise<R>
  $put<R, P = {}>(params: { path: string; body?: P }): Promise<R>
  $patch<R, P = {}>(params: { path: string; body?: P }): Promise<R>
  $delete<R>(params: { path: string }): Promise<R>
  setCurrentAbookId(id: string): void
}

export interface ApiValidationErrorService<T> {
  clearErrors(): void
  hasErrors(key?: RegExp | keyof T | '*'): boolean
  getErrors(key: RegExp | keyof T | '*'): string[]
  setErrors(err: ApiValidationErrors): void
}

export interface AbooksService {
  newAbook(): AbookEditModel
  fetchCurrent(): Promise<AbookViewModel>
  saveAbook(args: { abook: AbookEditModel }): Promise<void>
}

export interface AccountsService {
  newAccount(): AccountEditModel
  getAccount(args: {
    id: string
    signal?: AbortSignal
  }): Promise<AccountViewModel>
  getAllAccounts(args?: { signal?: AbortSignal }): Promise<AccountViewModel[]>
  createAccount(args: { account: AccountEditModel }): Promise<{ id: string }>
  updateAccount(args: { account: AccountEditModel }): Promise<AccountViewModel>
  deleteAccount(args: { id: String }): Promise<void>
  updateAccountDispOrders(args: { ids: string[] }): Promise<void>
}

export interface JournalsService {
  newJournal(params?: JournalEditModel | undefined): JournalEditModel
  getJournal(args: {
    id: string
    signal?: AbortSignal
  }): Promise<JournalViewModel>
  createJournal(args: { journal: JournalEditModel }): Promise<{ id: string }>
  updateJournal(args: { journal: JournalEditModel }): Promise<JournalViewModel>
  deleteJournal(args: { id: string }): Promise<void>
  searchJournals(args: {
    query: JournalSearchModel
    signal?: AbortSignal
  }): Promise<JournalViewModel[]>
  searchBalances(args: {
    accrualDateStart: Date
    accrualDateEnd: Date
    periods: string[]
    signal?: AbortSignal
  }): Promise<JournalBalanceModel[]>
}

export interface UsersService {
  syncUser(): Promise<void>
}
