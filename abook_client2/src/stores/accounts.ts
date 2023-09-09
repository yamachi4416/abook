import { AccountEditModel, AccountViewModel } from '~~/libs/models'

export const useAccountsStore = defineStore('accounts', () => {
  const api = useApiRequest()

  function newAccount(): AccountEditModel {
    return {
      name: '',
      useFee: false,
      avaliable: true,
      color: '#ffffff',
      usuallyUsedForPayment: false,
      usuallyUsedForReceipt: false,
    }
  }

  async function getAccount(id: string) {
    return await api.$get<AccountViewModel>(`/accounts/${id}`)
  }

  async function getAllAccounts() {
    return await api.$get<AccountViewModel[]>('/accounts/')
  }

  async function createAccount(account: AccountEditModel) {
    return await api.$post<{ id: string }>('/accounts', account)
  }

  async function updateAccount(account: AccountEditModel) {
    return await api.$patch<AccountViewModel>(
      `/accounts/${account.id}`,
      account,
    )
  }

  async function deleteAccount(id: String) {
    return await api.$delete<void>(`/accounts/${id}`)
  }

  async function updateAccountDispOrders(ids: string[]) {
    return await api.$patch<void>('/accounts/dispOrders', ids)
  }

  return {
    newAccount,
    getAccount,
    getAllAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    updateAccountDispOrders,
  }
})
