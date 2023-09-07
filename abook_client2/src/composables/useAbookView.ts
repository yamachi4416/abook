import { Models } from "#imports"

export function useAbookView({
  date,
  abook,
}: {
  date: MaybeRef<Date>
  abook: MaybeRef<Models.AbookViewModel | null>
}) {
  const current = computed(() => unref(abook))

  const isRegisted = computed(() => !!current.value?.abookId)

  const startOfMonthDate = computed(() => {
    const abook = current.value
    if (abook) {
      return toStartOfMonthDate({
        date: unref(date),
        abook,
      })
    }
  })

  const endOfMonthDate = computed(() => {
    const abook = current.value
    if (abook) {
      return toEndOfMonthDate({
        date: unref(date),
        abook,
      })
    }
  })

  const currentMonthDate = computed(() => {
    const abook = current.value
    if (abook) {
      return toCurrentMonthDate({
        date: unref(date),
        abook,
      })
    }
  })

  const startOfMonth = useDateFormat(startOfMonthDate, 'YYYYMM')
  const endOfMonth = useDateFormat(endOfMonthDate, 'YYYYMM')
  const currentMonth = useDateFormat(currentMonthDate, 'YYYYMM')

  return {
    isRegisted,
    startOfMonth,
    endOfMonth,
    currentMonth,
  }
}
