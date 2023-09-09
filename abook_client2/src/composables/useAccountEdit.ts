import { AccountEditModel, FinanceDiv } from '~~/libs/models'

export async function useAccountEdit({ id }: { id: string }) {
  const { getAccount, newAccount, createAccount, updateAccount } =
    useAccountsStore()

  const { hasErrors, getErrors, clearErrors, setErrors } =
    useApiValidationError<AccountEditModel>('account')

  const account = ref(id === 'new' ? newAccount() : await getAccount(id))

  const isEnableUseFee = computed(
    () => account.value.financeDiv === FinanceDiv.Expense,
  )

  const isEnableUsuallyUsedForPayment = computed(
    () =>
      account.value.financeDiv === FinanceDiv.Assets ||
      account.value.financeDiv === FinanceDiv.Liabilities,
  )

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
    account,
    isEnableUseFee,
    isEnableUsuallyUsedForPayment,
    saveAccount,
    errors: {
      hasErrors,
      getErrors,
    },
  }
}
