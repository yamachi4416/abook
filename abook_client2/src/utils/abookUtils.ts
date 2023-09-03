import { type AbookViewModel } from '~~/types/models'

function toDateValue(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  return { year, month, date: date.getDate() }
}

export function toStartOfMonthDate({
  date,
  abook: { startOfMonthDate, startOfMonthIsPrev },
}: {
  date: Date
  abook: Pick<AbookViewModel, 'startOfMonthDate' | 'startOfMonthIsPrev'>
}) {
  const { year, month } = toDateValue(date)
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
  } = toDateValue(toStartOfMonthDate({ date, abook }))
  return new Date(year, month + 1, days - 1)
}

export function toCurrentMonthDate({
  date,
  abook,
}: {
  date: Date
  abook: Pick<AbookViewModel, 'startOfMonthDate' | 'startOfMonthIsPrev'>
}) {
  const { year, month } = toDateValue(date)
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
