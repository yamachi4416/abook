import { formatDate } from '@vueuse/core'

export function toDatePart(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  return { year, month, date: date.getDate() }
}

const parsers = {
  YYYYMM(value: string) {
    return parsers.YYYYMMDD(value)
  },
  YYYYMMDD(value: string) {
    return new Date(
      parseInt(value.substring(0, 4)),
      parseInt(value.substring(4, 6)) - 1,
      parseInt(value.substring(6, 8) || '1'),
    )
  },
  'YYYY-MM-DD'(value: string) {
    return new Date(
      parseInt(value.substring(0, 4)),
      parseInt(value.substring(5, 7)) - 1,
      parseInt(value.substring(8, 10)),
    )
  },
}

export type ParseFormats = keyof typeof parsers

export function parseDate(value: string, format: ParseFormats) {
  return parsers[format](value)
}

export function plusDate(
  date: Date,
  plus: { year?: number; month?: number; days?: number },
) {
  return new Date(
    date.getFullYear() + (plus.year ?? 0),
    date.getMonth() + (plus.month ?? 0),
    date.getDate() + (plus.days ?? 0),
  )
}

export function diffOfMonths({ from, to }: { from: Date; to: Date }) {
  const fromMonths = from.getFullYear() * 12 + from.getMonth()
  const toMonths = to.getFullYear() * 12 + to.getMonth()
  return toMonths - fromMonths
}

export function toCalendarStartDate({
  date,
  weekStartDay,
}: {
  date: Date
  weekStartDay?: number
}) {
  const n = date.getDay() - (weekStartDay ?? 0)
  const d = 7
  const diff = n - d * Math.trunc(n / d)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - diff)
}

export function toCalendarEndDate({
  date,
  weekStartDay,
}: {
  date: Date
  weekStartDay?: number
}) {
  const n = date.getDay() - (weekStartDay ?? 0)
  const d = 7
  const diff = n - d * Math.trunc(n / d)
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + (6 - diff),
  )
}

export function toCalendar({
  beginDate,
  endDate,
  weekStartDay,
}: {
  beginDate: Date
  endDate: Date
  weekStartDay?: number
}) {
  function* generateWeeks() {
    const start = toCalendarStartDate({ date: beginDate, weekStartDay })
    const end = toCalendarEndDate({ date: endDate, weekStartDay })

    let cur = start
    while (cur <= end) {
      const week = []
      for (let i = 0; i < 7; i++) {
        week.push({
          date: cur,
          day: cur.getDate(),
          weekDay: cur.getDay(),
          between: !(cur < beginDate || endDate < cur),
        })
        cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1)
      }
      yield week
    }
  }

  return [...generateWeeks()]
}

export { formatDate }
