import { AbookViewModel } from './deps'
import { formatDate, plusDate, toDatePart } from './date'

export function toStartOfMonthDate({
  date,
  abook: { startOfMonthDate, startOfMonthIsPrev },
}: {
  date: Date
  abook: Pick<AbookViewModel, 'startOfMonthDate' | 'startOfMonthIsPrev'>
}) {
  const { year, month } = toDatePart(date)
  if (startOfMonthIsPrev) {
    if (startOfMonthDate === 30) {
      return new Date(year, month, 0)
    } else {
      return new Date(year, month - 1, startOfMonthDate)
    }
  } else if (startOfMonthDate === 30) {
    return new Date(year, month + 1, 0)
  } else {
    return new Date(year, month, startOfMonthDate)
  }
}

export function toEndOfMonthDate({
  date,
  abook,
}: {
  date: Date
  abook: Pick<AbookViewModel, 'startOfMonthDate' | 'startOfMonthIsPrev'>
}) {
  const {
    year,
    month,
    date: days,
  } = toDatePart(toStartOfMonthDate({ date, abook }))
  return new Date(year, month + 1, days - 1)
}

export function toCurrentMonthDate({
  date,
  abook,
}: {
  date: Date
  abook: Pick<AbookViewModel, 'startOfMonthDate' | 'startOfMonthIsPrev'>
}) {
  const { year, month } = toDatePart(date)
  const startDate = toStartOfMonthDate({ date, abook })
  const endDate = toEndOfMonthDate({ date, abook })

  if (date < startDate) {
    return new Date(year, month - 1, 1)
  }

  if (date > endDate) {
    return new Date(year, month + 1, 1)
  }

  return new Date(year, month, 1)
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
