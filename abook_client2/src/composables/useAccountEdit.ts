import { AccountEditModel } from '~~/libs/models'
import { accountEditor } from '~~/libs/models/editors/acconut'

export async function useAccountEdit({ id }: { id: string }) {
  const { getAccount, newAccount, createAccount, updateAccount } =
    useAccountsStore()

  const original = id === 'new' ? newAccount() : await getAccount(id)

  const { hasErrors, getErrors, clearErrors, setErrors } =
    useApiValidationError<AccountEditModel>('account')

  const { cloned: account } = useCloned<AccountEditModel>(original)

  const editor = accountEditor({ account })

  async function saveAccount() {
    clearErrors()
    try {
      if (account.value.id) {
        return await updateAccount(account.value)
      } else {
        return await createAccount(account.value)
      }
    } catch (e: unknown) {
      if (e instanceof ApiValidationError) {
        setErrors(e.errors)
      } else {
        throw e
      }
    }
  }

  return {
    account: reactive(editor),
    saveAccount,
    errors: {
      hasErrors,
      getErrors,
    },
  }
}
