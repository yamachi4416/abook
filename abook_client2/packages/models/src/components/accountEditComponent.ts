import { accountEditor } from '../editors'
import { AccountsService, apiValidationErrorService } from '../services'
import { AccountEditModel, ApiValidationError } from '../share'
import { AccountEditState } from './interfaces'

export function accountEditComponent<State extends AccountEditState>({
  accountsService,
  state,
}: {
  accountsService: AccountsService
  state: State
}) {
  const errors = apiValidationErrorService<AccountEditModel>({
    state,
    obj: 'account',
  })

  async function readAccount(id?: string) {
    const account = id
      ? await accountsService.getAccount(id)
      : accountsService.newAccount()
    state.original = account
    state.acconut = JSON.parse(JSON.stringify(account))
    if (state.acconut) {
      state.editor = accountEditor({ account: state.acconut })
    }
  }

  async function saveAccount() {
    errors.clearErrors()
    try {
      const account = state.acconut!
      if (account.id) {
        return await accountsService.updateAccount(account)
      } else {
        return await accountsService.createAccount(account)
      }
    } catch (e: unknown) {
      if (e instanceof ApiValidationError) {
        errors.setErrors(e.errors)
      } else {
        throw e
      }
    }
  }

  return {
    state,
    errors,
    readAccount,
    saveAccount,
  }
}
