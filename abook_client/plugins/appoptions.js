class AppOptions {
  constructor(app) {
    const defaultOptions = {
      'journal.timeline.order': 0,
      'journal.search.order': 0,
      'journal.piechat.disabledItems': {},
      'calc.tax1': '8',
      'calc.tax2': '10'
    }

    const options = Object.assign(
      {},
      defaultOptions,
      JSON.parse(localStorage.getItem('appoptions') || '{}')
    )

    Object.keys(options).forEach(k => {
      if (k in defaultOptions) {
        if (typeof options[k] !== typeof defaultOptions[k]) {
          options[k] = defaultOptions[k]
        }
      } else {
        delete options[k]
      }
    })

    this._options = options
    this._defaults = defaultOptions
    this._app = app
  }

  getOpt(key) {
    if (key in this._options) {
      return this._options[key]
    }
    return this._defaults[key]
  }

  setOpt(key, val) {
    this._options[key] = val
  }

  flush() {
    localStorage.setItem('appoptions', JSON.stringify(this._options))
  }
}

export default ({ app }, inject) => {
  inject('appoptions', new AppOptions(app))
}
