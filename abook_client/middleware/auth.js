import { mapMutations, mapActions } from 'vuex'

class Navi {
  constructor({ route, store, redirect, app }) {
    Object.assign(this, {
      ...mapMutations({
        _startLoading: 'ui/startLoading',
        _stopLoading: 'ui/stopLoading'
      }),
      ...mapActions({
        syncUser: 'users/syncUser',
        getUser: 'users/getUser',
        watchUser: 'users/watchUser',
        signIn: 'users/signIn',
        signOut: 'users/signOut',
        fetchAbook: 'abooks/fetchCurrent'
      }),
      $store: store,
      route,
      redirect,
      app
    })
  }

  startLoading() {
    this._startLoading(3)
  }

  stopLoading() {
    this._stopLoading(3)
  }

  redirectToLogin() {
    if (this.route.path !== '/login') {
      this.redirect('/login')
    }
    this.stopLoading()
  }

  redirectToMenu() {
    if (this.route.path !== '/menu') {
      this.redirect('/menu')
    }
    this.stopLoading()
  }

  async redirectToMenuSync() {
    await Promise.all([this.syncUser(), this.fetchAbook()])
    this.redirectToMenu()
  }
}

export default async ({ route, store, $flashattrs, redirect, error, app }) => {
  const navi = new Navi({ route, store, redirect, app })

  if (route.path === '/') {
    navi.startLoading()
    navi
      .getUser()
      .then(async user => {
        const isLogin = $flashattrs.getAttr('login')
        if (user) {
          await navi.redirectToMenuSync()
        } else if (isLogin) {
          await navi.signIn()
        } else {
          navi.redirectToLogin()
        }
      })
      .catch(e => error(e))
  } else {
    const user = await navi.getUser()

    if (route.path === '/login') {
      if (user) {
        navi.redirectToMenu()
      }
    } else if (route.path === '/logout') {
      await navi.signOut()
      navi.redirectToLogin()
    } else if (!user) {
      navi.redirectToLogin()
    }
  }

  navi
    .watchUser({ name: 'router' })
    .then(user => {
      if (!user) {
        navi.redirectToLogin()
      } else if (route.path === '/login') {
        navi.redirectToMenu()
      }
    })
    .catch(() => {})
}
