import {
  AbookEditModel,
  AbookViewModel,
  AccountEditModel,
  AccountViewModel,
  ApiValidationErrors,
  JournalEditModel,
  JournalSearchModel,
  JournalViewModel,
} from '../share'

export interface ApiRequestService {
  $get<R>(path: string, query?: any): Promise<R>
  $post<R, P = {}>(path: string, body?: P): Promise<R>
  $put<R, P = {}>(path: string, body?: P): Promise<R>
  $patch<R, P = {}>(path: string, body?: P): Promise<R>
  $delete<R>(path: string): Promise<R>
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
  saveAbook(abook: AbookEditModel): Promise<void>
}

export interface AccountsService {
  newAccount(): AccountEditModel
  getAccount(id: string): Promise<AccountViewModel>
  getAllAccounts(): Promise<AccountViewModel[]>
  createAccount(account: AccountEditModel): Promise<{ id: string }>
  updateAccount(account: AccountEditModel): Promise<AccountViewModel>
  deleteAccount(id: String): Promise<void>
  updateAccountDispOrders(ids: string[]): Promise<void>
}

export interface JournalsService {
  newJournal(params?: JournalEditModel | undefined): JournalEditModel
  getJournal(id: string): Promise<JournalViewModel>
  createJournal(journal: JournalEditModel): Promise<{ id: string }>
  updateJournal(journal: JournalEditModel): Promise<JournalViewModel>
  deleteJournal(id: string): Promise<void>
  searchJournals(query: JournalSearchModel): Promise<JournalViewModel[]>
}

export interface UsersService {
  syncUser(): Promise<void>
}
