import { formatDate } from '@vueuse/core'

export function toDatePart(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  return { year, month, date: date.getDate() }
}

const parsers = {
  YYYYMM(value: string) {
    return new Date(
      parseInt(value.substring(0, 4)),
      parseInt(value.substring(4, 6)) - 1,
      1,
    )
  },
}

export type ParseFormats = keyof typeof parsers

export function parseDate(value: string, format: ParseFormats) {
  return parsers[format](value)
}

export { formatDate }
