import { AccountsService, ApiRequestService } from './interfaces'

export function accountsService({
  api,
}: {
  api: ApiRequestService
}): AccountsService {
  return {
    newAccount() {
      return {
        name: '',
        useFee: false,
        avaliable: true,
        color: '#ffffff',
        usuallyUsedForPayment: false,
        usuallyUsedForReceipt: false,
      }
    },
    async getAccount({ id, signal }) {
      return await api.$get({ path: `/accounts/${id}`, signal })
    },
    async getAllAccounts(args) {
      return await api.$get({ path: '/accounts/', signal: args?.signal })
    },
    async createAccount({ account }) {
      return await api.$post({ path: '/accounts', body: account })
    },
    async updateAccount({ account }) {
      return await api.$patch({
        path: `/accounts/${account.id}`,
        body: account,
      })
    },
    async deleteAccount({ id }) {
      await api.$delete({ path: `/accounts/${id}` })
    },
    async updateAccountDispOrders({ ids }) {
      await api.$patch({ path: '/accounts/dispOrders', body: ids })
    },
  }
}
