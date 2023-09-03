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

export function useTopMenuItem({ hasAbook, currentMonth }: TopMenuItemInput) {
  const menuItems = computed<Record<string, MenuItem>>(() => ({
    journals_daily: {
      hide: !unref(hasAbook),
      items: [
        {
          name: 'timeline',
          icon: 'query_builder',
          to: `/journals/timeline/${unref(currentMonth)}`,
        },
        {
          name: 'calendar',
          icon: 'calendar_today',
          to: `/journals/calendar/${unref(currentMonth)}`,
        },
        {
          name: 'new',
          icon: 'note_add',
          to: '/journals',
        },
      ],
    },
    journals_analytics: {
      hide: !unref(hasAbook),
      items: [
        {
          name: 'search',
          icon: 'search',
          to: '/journals/search/input',
        },
        {
          name: 'piechart',
          icon: 'pie_chart',
          to: `/journals/piechart/${unref(currentMonth)}`,
        },
        {
          name: 'balance',
          icon: 'assignment',
          to: '/journals/balance',
        },
      ],
    },
    settings: {
      items: [
        {
          hide: !unref(hasAbook),
          name: 'accounts',
          icon: 'eco',
          to: '/accounts/list',
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
  }))

  return {
    menuItems,
  }
}
