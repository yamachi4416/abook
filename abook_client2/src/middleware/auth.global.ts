export default defineNuxtRouteMiddleware(async ({ path }) => {
  if (process.server) {
    return
  }

  const isWatched = useState<boolean>(() => false)
  const { isAuthenticated, signIn, signOut } = useAuth()

  if (!isWatched.value) {
    watch(isAuthenticated, (value) => {
      if (value) {
        navigateTo({ path: '/', replace: true })
      } else {
        navigateTo({ path: '/auth/login', replace: true })
      }
    })
  }

  if (path === '/auth/login') {
    return
  }

  if (path === '/auth/signIn') {
    signIn()
    return
  }

  if (path === '/auth/logout') {
    abortNavigation()
    await signOut()
    return navigateTo({ path: '/auth/login', replace: true })
  }

  if (!isAuthenticated) {
    abortNavigation()
    return navigateTo({ path: '/auth/login', replace: true })
  }

  return true
})
