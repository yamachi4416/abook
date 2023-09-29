import { AbookViewModel } from '../share'
import { AbooksService, ApiRequestService } from './interfaces'

export function abooksService({
  api,
  state,
}: {
  api: ApiRequestService
  state: {
    setCurrent(abook: AbookViewModel): void
  }
}): AbooksService {
  async function getCurrent() {
    return await api.$get<AbookViewModel>({ path: '/abooks/current' })
  }

  return {
    newAbook() {
      return {
        name: '',
        startOfMonthIsPrev: false,
        startOfMonthDate: 1,
      }
    },
    async fetchCurrent() {
      const abook = (await getCurrent()) ?? {}
      state.setCurrent(abook)
      api.setCurrentAbookId(abook.abookId)
      return JSON.parse(JSON.stringify(abook))
    },
    async saveAbook({ abook }) {
      const action = abook.abookId ? api.$patch : api.$post
      const saved = await action<AbookViewModel>({
        path: '/abooks',
        body: abook,
      })
      state.setCurrent(saved)
      api.setCurrentAbookId(saved.abookId)
    },
  }
}
