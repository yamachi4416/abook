import datetime from '@/modules/utils/datetime'

export class AbookModel {
  constructor (entity) {
    this.abookId = null
    this.name = null
    this.memo = null
    this.startOfMonthDate = 1
    this.startOfMonthIsPrev = false

    if (entity) {
      Object.assign(this, entity)
    }
  }

  isRegisted () {
    return !!this.abookId
  }

  clone () {
    const entity = { ...this }
    return new AbookModel(entity)
  }

  dayStartOfMonth (day, format = 'YYYYMMDD') {
    const today = (day ? datetime(day) : datetime()).startOf('day')
    const start = datetime(this.startOfMonth(today.format('YYYYMM')), 'YYYYMMDD')
    const end = datetime(this.endOfMonth(today.format('YYYYMM')), 'YYYYMMDD')
    if (today.isBetween(start, end, 'day', '[]')) {
      return start.format(format)
    } else if (today.isBefore(start)) {
      return this.startOfMonth(today.subtract(1, 'month').format('YYYYMM'), format)
    } else {
      return this.startOfMonth(today.add(1, 'month').format('YYYYMM'), format)
    }
  }

  dayEndOfMonth (day, format = 'YYYYMMDD') {
    const today = (day ? datetime(day) : datetime()).startOf('day')
    const start = datetime(this.startOfMonth(today.format('YYYYMM')), 'YYYYMMDD')
    const end = datetime(this.endOfMonth(today.format('YYYYMM')), 'YYYYMMDD')
    if (today.isBetween(start, end, 'day', '[]')) {
      return end.format(format)
    } else if (today.isBefore(start)) {
      return this.endOfMonth(today.subtract(1, 'month').format('YYYYMM'), format)
    } else {
      return this.endOfMonth(today.add(1, 'month').format('YYYYMM'), format)
    }
  }

  startOfMonth (ym, format = 'YYYYMMDD') {
    let m = datetime(ym, 'YYYYMM').startOf('month')
    if (this.startOfMonthIsPrev) {
      m = m.subtract(1, 'month')
    }
    if (this.startOfMonthDate === 30) {
      m = m.endOf('month')
    } else {
      m = m.date(this.startOfMonthDate)
    }
    return format ? m.format(format) : m
  }

  endOfMonth (ym, format = 'YYYYMMDD') {
    const m = datetime(this.startOfMonth(ym), 'YYYYMMDD')
      .startOf('day')
      .add(1, 'month').subtract(1, 'day')
    return format ? m.format(format) : m
  }

  toMonth (date) {
    const m = datetime(date).startOf('day')

    const start = this.startOfMonth(m.format('YYYYMMDD'), null)
    if (m.isBefore(start)) {
      return m.subtract(1, 'month').format('YYYYMM')
    }

    const end = this.endOfMonth(m.format('YYYYMMDD'), null)
    if (m.isAfter(end)) {
      return m.add(1, 'month').format('YYYYMM')
    }

    return m.format('YYYYMM')
  }

  static wrap (entity) {
    if (entity) {
      return new AbookModel(entity)
    }
    return null
  }
}
