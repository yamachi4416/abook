import type { ApiRequestService } from '@abook/models'
import { apiRequestService } from '@abook/models'

export function useApiRequest(): ApiRequestService {
  const currentAbookId = useState<string | null>(() => null)

  const { getToken } = useAuth()
  const { apiBaseUrl } = useRuntimeConfig().public

  return apiRequestService({
    async fetch({ path, ...options }) {
      return await $fetch(`${apiBaseUrl}${path}`, {
        ...options,
        credentials: 'same-origin',
      })
    },
    state: {
      getToken,
      getCurrentAbookId() {
        return currentAbookId.value
      },
      setCurrentAbookId(id) {
        currentAbookId.value = id
      },
    },
  })
}
