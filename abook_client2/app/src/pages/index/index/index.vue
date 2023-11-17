<template>
  <div>
    <NuxtLayout>
      <template #title>{{ title }}</template>
      <template v-for="(group, category) in menuItems">
        <dl v-if="!group.hide" :key="category">
          <dt>{{ $t(`pages.menu.items.${category}.title`) }}</dt>
          <dd>
            <ul>
              <template v-for="(link, i) in group.items">
                <li
                  v-if="!link.hide"
                  :key="i"
                  @click.prevent.once="go(link)"
                  @keypress.enter.prevent.once="go(link)"
                >
                  <span :data-icon="link.icon"></span>
                  <span>
                    {{
                      $t(
                        `pages.menu.items.${link.category || category}.items.${
                          link.name
                        }`,
                      )
                    }}
                    {{ link.to }}
                  </span>
                </li>
              </template>
            </ul>
          </dd>
        </dl>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { DateUtils, abookViewComponent } from '@abook/models'

const { state, views } = abookViewComponent({
  state: toReactive({
    abook: useCurrentAbookState().current,
    today: useNow(),
  }),
})

const { menuItems } = useTopMenuItem({
  currentMonth: computed(() => DateUtils.formatDate(state.today, 'YYYYMM')),
  hasAbook: computed(() => views.isRegisted),
})

const title = computed(() => state.abook.name)

function go(item: { to?: string }) {
  if (item.to) {
    useRouter().push(item.to)
  }
}
</script>
