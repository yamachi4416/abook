import { ApiValidationError } from '../share'
import { ApiRequestService } from './interfaces'

type FetchParams<P> = {
  path: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  headers?: Record<string, string>
  params?: { [key: string]: any }
  query?: { [key: string]: any }
}

export function apiRequestService({
  fetch,
  state: { getToken, getCurrentAbookId, setCurrentAbookId },
}: {
  fetch: <P, R>(
    params: FetchParams<P> & { body?: NonNullable<P> },
  ) => Promise<R>
  state: {
    getToken(): Promise<string | null>
    getCurrentAbookId(): string | null
    setCurrentAbookId(id: string | null): void
  }
}): ApiRequestService {
  async function fetchApi<R, P = undefined>({
    body,
    ...options
  }: FetchParams<P> & {
    body?: P
  }) {
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

  async function $get<R>(path: string, query?: any) {
    return await fetchApi<R>({ path, method: 'get', query })
  }

  async function $post<R, P = {}>(path: string, body?: P) {
    return await fetchApi<R, P>({ path, method: 'post', body })
  }

  async function $put<R, P = {}>(path: string, body?: P) {
    return await fetchApi<R, P>({ path, method: 'put', body })
  }

  async function $patch<R, P = {}>(path: string, body?: P) {
    return await fetchApi<R, P>({ path, method: 'patch', body })
  }

  async function $delete<R>(path: string) {
    return await fetchApi<R, {}>({ path, method: 'delete' })
  }

  return {
    $get,
    $post,
    $put,
    $patch,
    $delete,
    setCurrentAbookId,
  }
}
