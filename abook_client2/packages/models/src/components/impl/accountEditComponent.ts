import {
  AccountEditComponent,
  AccountEditModel,
  AccountEditState,
  AccountsService,
  ApiValidationError,
  EditorUtils,
  ValidateUtils,
} from './deps'

export function accountEditComponent<State extends AccountEditState>({
  accountsService,
  state,
}: {
  accountsService: AccountsService
  state: State
}): AccountEditComponent<State> {
  const errors = ValidateUtils.validateErrors<AccountEditModel>({
    state,
    obj: 'account',
  })

  return {
    state,
    errors,
    async readAccount({ id, signal }) {
      const account = id
        ? await accountsService.getAccount({ id, signal })
        : accountsService.newAccount()
      state.original = account
      state.acconut = JSON.parse(JSON.stringify(account))
      if (state.acconut) {
        state.editor = EditorUtils.accountEditor({ account: state.acconut })
      }
    },
    async saveAccount() {
      errors.clearErrors()
      try {
        const account = state.acconut!
        if (account.id) {
          return await accountsService.updateAccount({ account })
        } else {
          return await accountsService.createAccount({ account })
        }
      } catch (e: unknown) {
        if (e instanceof ApiValidationError) {
          errors.setErrors(e.errors)
        } else {
          throw e
        }
      }
    },
  }
}
