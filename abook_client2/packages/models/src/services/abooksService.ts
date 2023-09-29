import { AbookEditModel, AbookViewModel } from '../share'
import { AbooksService, ApiRequestService } from './interfaces'

function newAbook(): AbookEditModel {
  return {
    name: '',
    startOfMonthIsPrev: false,
    startOfMonthDate: 1,
  }
}

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
    return await api.$get<AbookViewModel>('/abooks/current')
  }

  async function fetchCurrent() {
    const abook = (await getCurrent()) ?? {}
    state.setCurrent(abook)
    api.setCurrentAbookId(abook.abookId)
    return JSON.parse(JSON.stringify(abook))
  }

  async function saveAbook(abook: AbookEditModel) {
    const action = abook.abookId ? api.$patch : api.$post
    const saved = await action<AbookViewModel>('/abooks', abook)
    state.setCurrent(saved)
    api.setCurrentAbookId(saved.abookId)
  }

  return {
    newAbook,
    fetchCurrent,
    saveAbook,
  }
}
