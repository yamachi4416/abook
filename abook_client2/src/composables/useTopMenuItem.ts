import { formatDate, parseDate, plusDate } from '~~/libs/models/utils/date'

type MenuItem = {
  hide?: boolean
  name?: string
  icon?: string
  to?: string
  category?: string
  items?: MenuItem[]
}

type TopMenuItemInput = {
  hasAbook: MaybeRef<boolean>
  currentMonth: MaybeRef<string>
}

export function useTopMenuItem(params: TopMenuItemInput) {
  const menuItems = computed<Record<string, MenuItem>>(() => {
    const hasAbook = unref(params.hasAbook)
    const currentMonth = unref(params.currentMonth)
    const currentMonthDate = parseDate(currentMonth, 'YYYYMM')
    const halfYearPeriodEndMonth = formatDate(
      plusDate(currentMonthDate, { month: 5 }),
      'YYYYMM',
    )
    const halfYearPeriod = `${currentMonth}-${halfYearPeriodEndMonth}`
    return {
      journals_daily: {
        hide: !hasAbook,
        items: [
          {
            name: 'timeline',
            icon: 'query_builder',
            to: `/journals/search/${currentMonth}/timeline`,
          },
          {
            name: 'calendar',
            icon: 'calendar_today',
            to: `/journals/search/${currentMonth}/calendar`,
          },
          {
            name: 'new',
            icon: 'note_add',
            to: '/journals/new',
          },
        ],
      },
      journals_analytics: {
        hide: !hasAbook,
        items: [
          {
            name: 'search',
            icon: 'search',
            to: '/journals/search/input',
          },
          {
            name: 'piechart',
            icon: 'pie_chart',
            to: `/journals/search/${currentMonth}/piechart`,
          },
          {
            name: 'balance',
            icon: 'assignment',
            to: `/journals/search/${halfYearPeriod}/balance`,
          },
        ],
      },
      settings: {
        items: [
          {
            hide: !hasAbook,
            name: 'accounts',
            icon: 'eco',
            to: '/accounts',
          },
          {
            name: 'abooks',
            icon: 'build_circle',
            to: '/abooks/current',
          },
          {
            name: 'users',
            icon: 'account_circle',
            to: '/settings/users',
          },
        ],
      },
      others: {
        items: [
          {
            name: 'logout',
            icon: 'transit_enterexit',
            to: '/auth/logout',
          },
        ],
      },
    }
  })

  return {
    menuItems,
  }
}
