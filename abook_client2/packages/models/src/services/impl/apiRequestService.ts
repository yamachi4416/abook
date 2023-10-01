import { ApiRequestService, ApiValidationError } from './deps'

type FetchParams = {
  path: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  headers?: Record<string, string>
  params?: { [key: string]: any }
  query?: { [key: string]: any }
  signal?: AbortSignal
}

export function apiRequestService({
  fetch,
  state: { getToken, getCurrentAbookId, setCurrentAbookId },
}: {
  fetch: <P, R>(params: FetchParams & { body?: NonNullable<P> }) => Promise<R>
  state: {
    getToken(): Promise<string | null>
    getCurrentAbookId(): string | null
    setCurrentAbookId(id: string | null): void
  }
}): ApiRequestService {
  async function fetchApi<R, P = undefined>({
    body,
    ...options
  }: FetchParams & { body?: P }) {
    options.headers = options.headers ?? {}

    const token = await getToken()
    if (token) {
      options.headers.authorization = `Bearer ${token}`
    }

    const abookId = getCurrentAbookId()
    if (abookId) {
      options.headers['x-abook-id'] = abookId
    }

    try {
      return await fetch<P, R>({ ...options, body: body ?? undefined })
    } catch (e: any) {
      if (e.statusCode === 400) {
        throw new ApiValidationError(e, e.data)
      }
      throw e
    }
  }

  return {
    async $get(params) {
      return await fetchApi({ ...params, method: 'get' })
    },
    async $post(params) {
      return await fetchApi({ ...params, method: 'get' })
    },
    async $put(params) {
      return await fetchApi({ ...params, method: 'put' })
    },
    async $patch(params) {
      return await fetchApi({ ...params, method: 'patch' })
    },
    async $delete(params) {
      return await fetchApi({ ...params, method: 'delete' })
    },
    setCurrentAbookId,
  }
}
