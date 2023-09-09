import { FetchError } from 'ofetch'
import { ApiValidationErrors } from '~~/libs/models'

type FetchOptions = Parameters<typeof $fetch>[1]

export class ApiValidationError extends Error {
  public readonly errors

  constructor(err: FetchError, errors: ApiValidationErrors) {
    super(err.message)

    this.name = 'ApiValidationError'

    if (err?.cause && !this.cause) {
      this.cause = err.cause
    }

    this.errors = errors
  }
}

export function useApiRequest() {
  const currentAbookId = useState<string | null>(() => null)

  const { getToken } = useAuth()
  const { apiBaseUrl } = useRuntimeConfig().public

  async function fetchApi<R, P = null>(
    path: string,
    method: string,
    body?: P,
    opts?: FetchOptions,
  ) {
    const headers: Record<string, string> = {}

    const token = await getToken()
    if (token) {
      headers.authorization = `Bearer ${token}`
    }

    if (currentAbookId.value) {
      headers['x-abook-id'] = currentAbookId.value
    }

    const fetch = $fetch.create({
      method,
      headers,
      credentials: 'same-origin',
      body: body ?? undefined,
    })

    try {
      return await fetch<R>(`${apiBaseUrl}${path}`, opts)
    } catch (e: unknown) {
      if (e instanceof FetchError) {
        if (e.statusCode === 400) {
          throw new ApiValidationError(e, e.data)
        }
      }
      throw e
    }
  }

  async function $get<R>(path: string, query?: any) {
    return await fetchApi<R>(path, 'get', null, {
      query,
    })
  }

  async function $post<R, P = {}>(path: string, body?: P) {
    return await fetchApi<R, P>(path, 'post', body)
  }

  async function $put<R, P = {}>(path: string, body?: P) {
    return await fetchApi<R, P>(path, 'put', body)
  }

  async function $patch<R, P = {}>(path: string, body?: P) {
    return await fetchApi<R, P>(path, 'patch', body)
  }

  async function $delete<R, P = {}>(path: string) {
    return await fetchApi<R, P>(path, 'delete')
  }

  return {
    $get,
    $post,
    $put,
    $patch,
    $delete,
    currentAbookId,
  }
}
