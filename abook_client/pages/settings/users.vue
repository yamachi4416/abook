<template>
  <DefaultLayout
    :hide-footer="true"
  >
    <template #title>
      {{ $t('pages.settings.users.title') }}
    </template>

    <template #default>
      <div class="cards">
        <dl class="card">
          <dt class="card-title">
            {{ $t('pages.settings.users.section-users') }}
          </dt>
          <dd class="card-content content">
            <div class="user-profile">
              <div class="user-profile-photo">
                <img class="user-profile-photo-image" :src="user.photoURL">
              </div>
              <div class="user-profile-info">
                <div>
                  <div>
                    <FormGroup
                      object="users"
                      field="displayName"
                    >
                      <span>{{ user.displayName }}</span>
                    </FormGroup>
                  </div>
                  <div>
                    <FormGroup
                      object="users"
                      field="email"
                    >
                      <span>{{ user.email }}</span>
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
          </dd>
        </dl>

        <dl class="card">
          <dt class="card-title">
            {{ $t('pages.settings.users.section-terminal') }}
          </dt>
          <dd class="card-content content">
            <div class="terminal">
              <div class="terminal-locale">
                <FormGroup
                  object="users"
                  field="locale"
                >
                  <Selects
                    v-model="locale"
                    :empty="null"
                    :options="$i18n.locales"
                    :mapper="(o) => [o.name, o.code]"
                  />
                </FormGroup>
              </div>
              <div class="terminal-tax1">
                <FormGroup
                  object="calc"
                  field="tax1"
                  :errors="errors"
                >
                  <Selects
                    v-model="tax1"
                    :empty="null"
                    :options="percents"
                    :mapper="(o) => [`${o} %`, o]"
                  />
                </FormGroup>
              </div>
              <div class="terminal-tax2">
                <FormGroup
                  object="calc"
                  field="tax2"
                  :errors="errors"
                >
                  <Selects
                    v-model="tax2"
                    :empty="null"
                    :options="percents"
                    :mapper="(o) => [`${o} %`, o]"
                  />
                </FormGroup>
              </div>
            </div>
          </dd>
        </dl>
      </div>
    </template>
  </DefaultLayout>
</template>

<script>
import { BackableMixin, EditableMixin, OptionMixin } from '@/modules/ui/mixins'

export default {
  mixins: [EditableMixin, BackableMixin,
    OptionMixin({ tax1: 'calc.tax1', tax2: 'calc.tax2' })],

  async asyncData ({ store }) {
    const user = await store.dispatch('users/getUser').then(u => u.toJSON())
    return {
      user: {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }
    }
  },

  computed: {
    locale: {
      get () {
        return this.$i18n.locale
      },

      set (val) {
        this.$i18n.setLocale(val)
        this.$i18n.setLocaleCookie(val)
      }
    },

    percents () {
      return Array.from({ length: 50 }, (v, k) => String(k + 1))
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/ui/cards.scss";

.cards {
  @include __cards;
}

.user-profile {
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-template-rows: auto;
  padding: 10px;
  white-space: pre-line;
  word-break: break-word;
  width: 100%;

  &-photo {
    display: flex;
    align-items: center;
    justify-content: center;

    &-image {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
  }
}

.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.terminal {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    "locale locale"
    "tax1   tax2";
  padding: 10px;
  width: 100%;

  &-locale {
    grid-area: locale;
  }

  &-tax1 {
    grid-area: tax1;
  }

  &-tax2 {
    grid-area: tax2;
  }
}
</style>
