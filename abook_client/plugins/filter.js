import Vue from 'vue'
import datetime from '@/modules/utils/datetime'

export default ({ app }) => {
  const comma = (value, length = 3) => {
    if (value == null) {
      return ''
    }
    const reg = new RegExp(`(\\d)(?=(\\d{${length}})+(?!\\d))`, 'g')
    const num = String(value)
    if (num.includes('.')) {
      const xs = num.split('.')
      return xs[0].replace(reg, '$1,') + (xs[1] ? `.${xs[1]}` : '.')
    } else {
      return num.replace(reg, '$1,')
    }
  }

  const percent = (value, length = 1) => {
    if (value == null) {
      return ''
    }
    const n = Number(value) * 100
    const m = Math.pow(10, length)
    return Math.round(n * m) / m
  }

  const dateformat = (value, format) => {
    if (!value) {
      return ''
    }

    if (app.i18n && app.i18n.locale) {
      datetime.locale(app.i18n.locale)
    }
    const m = datetime(value)
    return m.format(format)
  }

  Vue.filter('comma', comma)
  Vue.filter('percent', percent)
  Vue.filter('dateformat', dateformat)
}
