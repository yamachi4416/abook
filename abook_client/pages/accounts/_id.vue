<template>
  <DefaultLayout>
    <template #title>
      {{ $t(`pages.accounts.${account.isRegisted() ? 'edit' : 'new'}.title`) }}
    </template>

    <template #default>
      <FormPanel>
        <ErrorMessages name="account.*" :errors="errors" />
        <div class="row">
          <div class="col-2 col-md-4 col-sm-4">
            <FormGroup object="account" field="avaliable" :errors="errors">
              <input
                v-model="account.avaliable"
                type="checkbox"
                class="toggle"
              >
            </FormGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-3 col-md-5 col-sm-5">
            <FormGroup
              object="account"
              field="financeDiv"
              label-field="financeName"
              :errors="errors"
            >
              <Selects
                v-model.number="account.financeDiv"
                :empty="null"
                :options="$t('select.financeDiv')"
                :mapper="(o) => [o.label, o.value]"
                :disabled="account.isRegisted()"
              />
            </FormGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-3 col-md-5 col-sm-5">
            <FormGroup object="account" field="color" :errors="errors">
              <input v-model="account.color" type="color">
            </FormGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <FormGroup object="account" field="name" :errors="errors">
              <input v-model="account.name" type="text">
            </FormGroup>
          </div>
        </div>
        <div v-if="account.financeDiv === 2" class="row">
          <div class="col-12">
            <FormGroup object="account" field="useFee" :errors="errors">
              <input
                v-model="account.useFee"
                type="checkbox"
                class="toggle"
              >
            </FormGroup>
          </div>
        </div>
        <div v-if="account.financeDiv === 3 || account.financeDiv === 4" class="row">
          <div class="col-12">
            <FormGroup object="account" field="usuallyUsedForPayment" :errors="errors">
              <input
                v-model="account.usuallyUsedForPayment"
                type="checkbox"
                class="toggle"
              >
            </FormGroup>
          </div>
          <div class="col-12">
            <FormGroup object="account" field="usuallyUsedForReceipt" :errors="errors">
              <input
                v-model="account.usuallyUsedForReceipt"
                type="checkbox"
                class="toggle"
              >
            </FormGroup>
          </div>
        </div>
      </FormPanel>
    </template>

    <template #footer>
      <span>
        <button data-icon="save" @click="save()">
          {{ $t('actions.save') }}
        </button>
      </span>
      <span>
        <button
          v-if="account.isRegisted()"
          data-icon="delete_outline"
          @click="remove()"
        >
          {{ $t('actions.remove') }}
        </button>
      </span>
      <span />
      <span />
    </template>
  </DefaultLayout>
</template>

<script>
import { mapActions } from 'vuex'
import { EditableMixin, BackableMixin } from '@/modules/ui/mixins'

export default {
  mixins: [EditableMixin, BackableMixin],
  scrollToTop: true,
  async asyncData ({ store, params, app }) {
    return {
      account: await store.dispatch('accounts/get', params.id)
    }
  },

  methods: {
    ...mapActions({
      create: 'accounts/create',
      update: 'accounts/update',
      delete: 'accounts/delete'
    }),

    async save () {
      await this.useLoading(async () => {
        try {
          if (this.account.isRegisted()) {
            await this.update(this.account)
          } else {
            await this.create(this.account)
          }
          this.back()
        } catch (e) {
          this.setErrors(e)
        }
      }, false)
    },

    async remove () {
      const ok = await this.confirmRemove()
      if (!ok) {
        return
      }

      await this.useLoading(async () => {
        try {
          await this.delete(this.account.id)
          this.back()
        } catch (e) {
          this.setErrors(e)
        }
      }, false)
    }
  }
}
</script>
