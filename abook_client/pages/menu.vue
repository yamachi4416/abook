<template>
  <DefaultLayout :hide-footer="true">
    <template slot="title">
      {{ title }}
    </template>

    <template #default>
      <nav class="cards">
        <template v-for="(group, category) in links">
          <dl
            v-if="!group.useAbook || abook.isRegisted()"
            :key="category"
            class="card"
          >
            <dt class="card-title">
              <span>{{ $t(`pages.menu.items.${category}.title`) }}</span>
            </dt>
            <dd class="card-content">
              <ul class="menu">
                <template v-for="(link, i) in group.items">
                  <li
                    v-if="!link.useAbook || abook.isRegisted()"
                    :key="i"
                    tabindex="0"
                    class="menu-item"
                    @click.prevent.once="go(link)"
                    @keypress.enter.prevent.once="go(link)"
                  >
                    <span :data-icon="link.icon" class="menu-item-icon"></span>
                    <span class="menu-item-name">
                      {{
                        $t(
                          `pages.menu.items.${
                            link.category || category
                          }.items.${link.name}`
                        )
                      }}
                    </span>
                  </li>
                </template>
              </ul>
            </dd>
          </dl>
        </template>
      </nav>
    </template>
  </DefaultLayout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  scrollToTop: true,

  async asyncData({ store }) {
    const abook =
      store.getters['abooks/current'] ||
      (await store.dispatch('abooks/fetchCurrent'))

    const yyyymm = abook.toMonth()

    return {
      links: {
        journals_daily: {
          useAbook: true,
          items: [
            {
              name: 'timeline',
              icon: 'query_builder',
              to: `/journals/timeline/${yyyymm}`
            },
            {
              name: 'calendar',
              icon: 'calendar_today',
              to: `/journals/calendar/${yyyymm}`
            },
            {
              name: 'new',
              icon: 'note_add',
              to: '/journals'
            }
          ]
        },
        journals_analytics: {
          useAbook: true,
          items: [
            {
              name: 'search',
              icon: 'search',
              to: '/journals/search/input'
            },
            {
              name: 'piechart',
              icon: 'pie_chart',
              to: `/journals/piechart/${yyyymm}`
            },
            {
              name: 'balance',
              icon: 'assignment',
              to: '/journals/balance'
            }
          ]
        },
        settings: {
          items: [
            {
              useAbook: true,
              name: 'accounts',
              icon: 'eco',
              to: '/accounts/list'
            },
            {
              name: 'abooks',
              icon: 'build_circle',
              to: '/abooks/current'
            },
            {
              name: 'users',
              icon: 'account_circle',
              to: '/settings/users'
            }
          ]
        },
        others: {
          items: [
            {
              name: 'logout',
              icon: 'transit_enterexit',
              to: '/logout'
            }
          ]
        }
      }
    }
  },

  computed: {
    ...mapGetters({
      abook: 'abooks/current'
    }),

    title() {
      return this.$t(`pages.menu.title${this.abook.name ? '1' : '2'}`, {
        abook: this.abook.name,
        dev: process.env.dev ? this.$t('label.dev') : ''
      })
    }
  },

  mounted() {
    this.$savedpos.clear()
  },

  methods: {
    go(link) {
      this.$router.push(link.to)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/ui/cards.scss';

.cards {
  @include __cards;
}

.menu {
  width: 100%;
  padding: 8px 0;

  &-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 10px 20px;

    &-icon {
      &::before {
        margin-right: 10px;
      }
    }

    &:focus {
      outline: none;
      @include __media_pc {
        background: var(--focus-background);
      }
      @include __media_tablet {
        background: var(--focus-background);
      }
    }

    &:active {
      background: var(--focus-background);
    }
  }
}
</style>
