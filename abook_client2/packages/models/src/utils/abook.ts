import { AbookViewModel } from './deps'
import { formatDate, plusDate, toDatePart } from './date'

export function toStartOfMonthDate({
  date,
  abook: { startOfMonthDate, startOfMonthIsPrev },
}: {
  date: Date
  abook: Pick<AbookViewModel, 'startOfMonthDate' | 'startOfMonthIsPrev'>
}) {
  if (startOfMonthDate === 30) {
    const p = toDatePart(date)
    const eom = new Date(p.year, p.month + 1, 0)
    if (startOfMonthIsPrev) {
      return p.date === eom.getDate()
        ? new Date(p.year, p.month, 0)
        : new Date(p.year, p.month - 1, 0)
    }
    return p.date === eom.getDate() ? eom : new Date(p.year, p.month, 0)
  } else {
    const base = startOfMonthIsPrev ? plusDate(date, { month: -1 }) : date
    const p = toDatePart(base)
    const start = new Date(p.year, p.month, startOfMonthDate)
    return base < start
      ? new Date(p.year, p.month - 1, startOfMonthDate)
      : start
  }
}

export function toEndOfMonthDate({
  date,
  abook: { startOfMonthDate, startOfMonthIsPrev },
}: {
  date: Date
  abook: Pick<AbookViewModel, 'startOfMonthDate' | 'startOfMonthIsPrev'>
}) {
  if (startOfMonthDate === 30) {
    const p = toDatePart(date)
    const eom = new Date(p.year, p.month + 1, 0)
    if (startOfMonthIsPrev) {
      return p.date === eom.getDate()
        ? new Date(p.year, p.month + 1, -1)
        : new Date(p.year, p.month, -1)
    }
    return p.date === eom.getDate()
      ? new Date(p.year, p.month + 2, -1)
      : new Date(p.year, p.month + 1, -1)
  } else {
    const base = startOfMonthIsPrev ? plusDate(date, { month: -1 }) : date
    const p = toDatePart(base)
    const end = new Date(p.year, p.month, startOfMonthDate - 1)
    return end < base
      ? new Date(p.year, p.month + 1, startOfMonthDate - 1)
      : end
  }
}

export function toCurrentMonthPeriod({
  date,
  abook,
}: {
  date: Date
  abook: Pick<AbookViewModel, 'startOfMonthDate' | 'startOfMonthIsPrev'>
}) {
  return {
    month: formatDate(date, 'YYYYMM'),
    fromDate: toStartOfMonthDate({ date, abook }),
    toDate: toEndOfMonthDate({ date, abook }),
  }
}

export function toAbookMonthPeriods({
  date,
  months,
  abook,
}: {
  date: Date
  months: number
  abook: Pick<AbookViewModel, 'startOfMonthDate' | 'startOfMonthIsPrev'>
}) {
  function* enumerate() {
    const last = Math.abs(months)

    if (last === 0) {
      return
    }

    let period = toCurrentMonthPeriod({ date, abook })
    yield period

    for (let i = 1; i < last; i++) {
      period = toCurrentMonthPeriod({
        date:
          months < 0
            ? plusDate(period.fromDate, { days: -1 })
            : plusDate(period.toDate, { days: 1 }),
        abook,
      })

      yield period
    }
  }

  return [...enumerate()]
}
