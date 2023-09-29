import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin({
  setup() {
    const {
      public: { firebaseConfig },
    } = useRuntimeConfig()

    const firebaseApp = initializeApp(firebaseConfig)
    const firebaseAuth = getAuth(firebaseApp)

    return {
      provide: {
        auth: firebaseAuth,
      },
    }
  },
})
