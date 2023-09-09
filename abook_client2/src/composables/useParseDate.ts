import { ParseFormats, parseDate } from '~~/libs/models/utils/date'

export function useParseDate(value: MaybeRef<string>, format: ParseFormats) {
  return computed(() => {
    const val = unref(value)
    if (val) {
      return parseDate(val, format)
    }
  })
}
