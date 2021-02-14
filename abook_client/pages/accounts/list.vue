<template>
  <DefaultLayout :header-border="false">
    <template #title>
      {{ $t('pages.accounts.index.title') }}
    </template>

    <template #default>
      <table class="account-table">
        <thead>
          <tr>
            <th v-text="$t('form.financeName')" />
            <th v-text="$t('form.name')" />
          </tr>
        </thead>
        <Sortable
          handle=".account-name--handle"
          tag-name="tbody"
          :items="accounts"
          :disabled="sortDisabled"
          :class="{ 'clickable': sortDisabled }"
          :group-keys="['financeDiv']"
          @dragend="sortEnd"
        >
          <tr
            v-for="a in accounts"
            :key="a.id"
            @click="edit(a.id)"
          >
            <td>
              <span class="badge" :badge="a.financeDiv">
                {{ $t(`select.financeDiv.${a.financeDiv}.label`) }}
              </span>
            </td>
            <td>
              <span class="account-name">
                <span class="account-name--ball">
                  <span class="color-ball" :style="{ background: a.color }" />
                </span>
                <span class="account-name--name">{{ a.name }}</span>
                <span
                  v-if="!sortDisabled"
                  class="account-name--handle fill"
                  data-icon="drag_handle"
                />
              </span>
            </td>
          </tr>
        </Sortable>
      </table>
    </template>

    <template #footer>
      <span>
        <button data-icon="add" @click.once="add">
          {{ $t('actions.add') }}
        </button>
      </span>
      <span>
        <button
          :data-icon="sortDisabled ? 'sort' : 'done'"
          @click="sortToggle"
        >
          {{ $t(`actions.${sortDisabled ? 'sort' : 'done'}`) }}
        </button>
      </span>
      <span />
      <span />
    </template>
  </DefaultLayout>
</template>

<script>
import { mapActions } from 'vuex'
import { SavePosMixin, LoadingMixin } from '@/modules/ui/mixins'

export default {
  mixins: [SavePosMixin, LoadingMixin],

  async asyncData ({ store }) {
    return {
      accounts: await store.dispatch('accounts/getAll'),
      sortDisabled: true
    }
  },

  methods: {
    ...mapActions({
      getAll: 'accounts/getAll',
      updateDispOrders: 'accounts/updateDispOrders'
    }),

    edit (id) {
      if (this.sortDisabled) {
        this.$router.push(`/accounts/${id}`)
      }
    },

    add () {
      this.$router.push('/accounts/0')
    },

    async sortToggle () {
      if (this.sortDisabled) {
        this.sortDisabled = false
      } else {
        await this.useLoading(async () => {
          await this.updateDispOrders(this.accounts.map(a => a.id))
          this.accounts = await this.getAll()
          this.sortDisabled = true
        }, true)
      }
    },

    sortEnd (evt) {
      const { oldIndex, newIndex } = evt
      this.accounts.splice(newIndex, 0, this.accounts.splice(oldIndex, 1)[0])
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/ui/table.scss";
@import "~assets/scss/ui/inputs.scss";

.account-table {
  @include __table;

  max-width: 100%;

  thead, tbody {
    tr {
      th, td {
        text-align: left;
        &:first-child {
          width: 1%;
        }
      }
    }
  }

  .clickable {
    tr {
      cursor: pointer;

      &:active {
        cursor: unset;
        background: var(--focus-background);
      }
    }
  }

  .toggle {
    @include __toggle_button();
    font-size: 0.3em;
  }

  .account-name {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    &--name {
      flex-grow: 1;
    }

    &--handle {
      cursor: pointer;
      font-size: 1.1em;
      padding-left: 10px;
      padding-right: 10px;
    }
  }

  .color-ball {
    display: block;
    height: 1em;
    width: 1em;
    margin-right: 1em;
    background: #fff;
    border: 1px solid var(--them-color-border-sub);
    border-radius: 50%;
  }
}
</style>
