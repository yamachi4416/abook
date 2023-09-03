import {
  GoogleAuthProvider,
  getIdToken,
  getRedirectResult,
  signInWithRedirect,
} from 'firebase/auth'

export function useAuth() {
  const auth = useNuxtApp().$auth

  const user = useState(() => auth?.currentUser)
  const isWatched = useState<boolean>(() => false)
  const isAuthenticated = computed(() => user.value != null)

  if (process.client && !isWatched.value) {
    auth.onAuthStateChanged((value) => {
      user.value = value
    })
    isWatched.value = true
  }

  async function getToken() {
    if (!user.value) {
      return null
    }
    return await getIdToken(user.value)
  }

  async function signIn() {
    if (process.client) {
      const result = await getRedirectResult(auth)
      if (result) {
        user.value = result.user
      } else {
        await signInWithRedirect(auth, new GoogleAuthProvider())
      }
    }
  }

  async function signOut() {
    if (process.client) {
      await auth.signOut()
    }
  }

  return {
    user,
    isAuthenticated,
    getToken,
    signIn,
    signOut,
  }
}
