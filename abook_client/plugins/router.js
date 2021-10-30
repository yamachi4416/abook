import { mapMutations, mapGetters } from 'vuex'

export default ({ app, store }) => {
  const ui = {
    $store: store,
    ...mapMutations({
      setTransition: 'ui/setTransition',
      _stopLoading: 'ui/stopLoading'
    }),

    ...mapGetters({
      currentModal: 'ui/currentModal'
    }),

    stopLoading() {
      this._stopLoading(2)
    }
  }

  app.router.beforeEach((to, from, next) => {
    const modal = ui.currentModal()

    if (modal) {
      modal.close()
      return next(false)
    }

    if (from.path === '/' || to.path.startsWith('/login')) {
      ui.setTransition('fade')
      next()
      return
    }

    ui.setTransition(app.$flashattrs.getAttr('transType') || 'page')
    next()
  })

  app.router.afterEach((to, from) => {
    ui.stopLoading()
  })
}
