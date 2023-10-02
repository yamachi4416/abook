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

const formats = {
  YYYYMM(value: Date) {
    const { year, month } = toDatePart(value)
    const mm = String(month + 1).padStart(2, '0')
    return `${year}${mm}`
  },
  YYYYMMDD(value: Date) {
    const { year, month, date } = toDatePart(value)
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(date).padStart(2, '0')
    return `${year}${mm}${dd}`
  },
  'YYYY-MM-DD'(value: Date) {
    const { year, month, date } = toDatePart(value)
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(date).padStart(2, '0')
    return `${year}-${mm}-${dd}`
  },
}

export type ParseFormats = keyof typeof parsers
export type FormatFormats = keyof typeof formats

const WeekDays = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
} as const

export type WeekDay = keyof typeof WeekDays

export function parseDate(value: string, format: ParseFormats) {
  return parsers[format](value)
}

export function formatDate(value: Date, format: FormatFormats) {
  return formats[format](value)
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

export function plusFormatedDate(
  date: string,
  plus: { year?: number; month?: number; days?: number },
  format: ParseFormats,
) {
  return formatDate(plusDate(parseDate(date, format), plus), format)
}

export function toWeekStartDate({
  date,
  weekStartDay,
}: {
  date: Date
  weekStartDay?: WeekDay
}) {
  const d = WeekDays[weekStartDay ?? 'Sun'] - date.getDay()
  return plusDate(date, { days: d > 0 ? d - 7 : d })
}

export function toWeekEndDate({
  date,
  weekStartDay,
}: {
  date: Date
  weekStartDay?: WeekDay
}) {
  const d = WeekDays[weekStartDay ?? 'Sun'] - date.getDay()
  return plusDate(date, { days: d > 0 ? d - 1 : d + 6 })
}

export function toCalendarWeeks({
  beginDate,
  endDate,
  weekStartDay,
}: {
  beginDate: Date
  endDate: Date
  weekStartDay?: WeekDay
}) {
  type Week = {
    date: Date
    between: boolean
  }

  function* generateWeeks() {
    const start = toWeekStartDate({ date: beginDate, weekStartDay })
    const end = toWeekEndDate({ date: endDate, weekStartDay })

    let cur = start
    while (cur <= end) {
      const week: Week[] = []

      for (let i = 0; i < 7; i++) {
        week.push({
          date: cur,
          between: !(cur < beginDate || endDate < cur),
        })
        cur = plusDate(cur, { days: 1 })
      }

      yield week
    }
  }

  return [...generateWeeks()]
}
