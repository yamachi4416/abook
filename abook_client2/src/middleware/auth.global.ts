export default defineNuxtRouteMiddleware(async ({ path }) => {
  const isWatched = useState<boolean>(() => false)
  const { isAuthenticated, signIn, signOut } = useAuth()

  if (process.client && !isWatched.value) {
    watch(isAuthenticated, (value) => {
      if (value) {
        navigateTo({ path: '/', replace: true })
      } else {
        navigateTo({ path: '/auth/login', replace: true })
      }
    })
  }

  if (path === '/auth/login') {
    return true
  }

  if (path === '/auth/signIn') {
    signIn()
    return true
  }

  if (path === '/auth/logout') {
    abortNavigation()
    await signOut()
    return navigateTo({ path: '/auth/login', replace: true })
  }

  if (!isAuthenticated.value) {
    abortNavigation()
    return navigateTo({ path: '/auth/login', replace: true })
  }

  return true
})
