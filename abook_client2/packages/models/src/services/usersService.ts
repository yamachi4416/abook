import { ApiRequestService, UsersService } from './interfaces'

export function usersService({
  api,
}: {
  api: ApiRequestService
}): UsersService {
  return {
    async syncUser() {
      await api.$put({ path: '/users' })
    },
  }
}
