export default ({ $axios, store, app }) => {
  $axios.interceptors.request.use(async (config) => {
    const token = await store.dispatch('users/getToken')
    if (token) {
      config.headers.authorization = `Bearer ${token}`
    }

    const abook = store.getters['abooks/current']
    if (abook && abook.abookId) {
      config.headers['x-abook-id'] = abook.abookId
    }

    if (app.i18n && app.i18n.locale) {
      config.headers.common['Accept-Language'] = app.i18n.locale
    }

    return config
  })
}
