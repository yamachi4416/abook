import { ApiRequestService, UsersService } from '..'

export function usersService({
  api,
}: {
  api: ApiRequestService
}): UsersService {
  async function syncUser() {
    return await api.$put<void>('/users')
  }

  return {
    syncUser,
  }
}
