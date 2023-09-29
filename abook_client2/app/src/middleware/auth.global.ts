export default defineNuxtRouteMiddleware(async ({ path }) => {
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
    return true
  }

  if (path === '/auth/signIn') {
    await signIn()
    return true
  }

  if (path === '/auth/logout') {
    await signOut()
    return navigateTo({ path: '/auth/login', replace: true })
  }

  await useAuth().waitForReady()

  if (!isAuthenticated.value) {
    return navigateTo({ path: '/auth/login', replace: true })
  }

  return true
})
