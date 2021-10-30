import { initializeApp } from '@firebase/app'
import { getAuth, signInWithRedirect, GoogleAuthProvider } from '@firebase/auth'

export default ({ $config }, inject) => {
  const app = initializeApp($config.firebaseConfig)

  const auth = getAuth(app)

  class Auth {
    constructor() {
      this.handlers = {}
    }

    watch(name, handler) {
      if (this.handlers[name]) {
        this.handlers[name].reject()
      }

      this.handlers[name] = handler

      if (!this.watcher) {
        this.watcher = auth.onAuthStateChanged(user => {
          Object.keys(this.handlers).forEach(k =>
            this.handlers[k].resolve(user)
          )
          this.handlers = {}
        })
      }
    }

    watchOnce(f) {
      const unSubscribe = auth.onAuthStateChanged(user => {
        unSubscribe()
        f(user)
      })
    }

    async signInWithRedirect() {
      return await signInWithRedirect(auth, new GoogleAuthProvider())
    }

    async signOut() {
      return await auth.signOut()
    }

    get currentUser() {
      return auth.currentUser
    }

    get languageCode() {
      return auth.languageCode
    }

    set languageCode(val) {
      auth.languageCode = val
    }
  }

  inject('auth', new Auth())
}
