import {
  GoogleAuthProvider,
  getIdToken,
  signInWithRedirect,
} from 'firebase/auth'

export function useAuth() {
  const auth = useNuxtApp().$auth

  const user = useState(() => auth?.currentUser)
  const isWatched = useState<boolean>(() => false)
  const isReady = useState<boolean>(() => false)
  const isAuthenticated = computed(() => user.value != null)

  if (!isWatched.value) {
    auth.onAuthStateChanged((value) => {
      user.value = value
      isReady.value = true
    })
    isWatched.value = true
  }

  async function waitFor() {
    return await new Promise<void>((resolve) => {
      const unwatch = auth.onAuthStateChanged((value) => {
        unwatch()
        user.value = value
        isReady.value = true
        resolve()
      })
    })
  }

  async function waitForReady() {
    if (!isReady.value) {
      await waitFor()
    }
  }

  async function getToken() {
    if (!user.value) {
      return null
    }
    return await getIdToken(user.value)
  }

  async function signIn() {
    await waitForReady()
    if (!isAuthenticated.value) {
      await signInWithRedirect(auth, new GoogleAuthProvider())
    }
  }

  async function signOut() {
    await auth.signOut()
  }

  return {
    user,
    isReady: readonly(isReady),
    isAuthenticated,
    waitForReady,
    getToken,
    signIn,
    signOut,
  }
}
