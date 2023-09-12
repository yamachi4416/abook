<template>
  <LayoutDefault>
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
  </LayoutDefault>
</template>

<script setup lang="ts">
const { current: abook } = storeToRefs(useAbooksStore())
const { currentMonth, isRegisted } = useAbookView({ date: useNow(), abook })
const { menuItems } = useTopMenuItem({ currentMonth, hasAbook: isRegisted })

const title = computed(() => abook?.value?.name)

function go(item: { to?: string }) {
  if (item.to) {
    useRouter().push(item.to)
  }
}
</script>
