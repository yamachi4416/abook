<template>
  <DefaultLayout>
    <template #title>
      {{ title }}
    </template>

    <template #default>
      <FormPanel>
        <div class="row">
          <div class="col-8 col-sm-12">
            <FormGroup object="abook" field="name" :errors="errors">
              <input v-model="abook.name" type="text">
            </FormGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-4 col-sm-6">
            <FormGroup object="abook" field="startOfMonthIsPrev" :errors="errors">
              <Selects
                v-model="startOfMonthIsPrev"
                :options="$t('select.startOfMonthIs')"
                :empty="null"
                :mapper="(o) => [o.label, o.value]"
              />
            </FormGroup>
          </div>
          <div class="col-4 col-sm-6">
            <FormGroup object="abook" field="startOfMonthDate" :errors="errors">
              <Selects
                v-model="abook.startOfMonthDate"
                :options="startOfMonthDates"
                :empty="null"
                :mapper="(o) => [o.name, o.value]"
              />
            </FormGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <FormGroup object="abook" field="memo" :errors="errors">
              <textarea v-model="abook.memo" />
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
      <span />
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

  async asyncData ({ store }) {
    const abook = await store.dispatch('abooks/getCurrent')

    return {
      abook,
      original: abook ? abook.clone() : null
    }
  },

  computed: {
    startOfMonthDates () {
      return Array.from(Array(28))
        .map((v, i) => ({ name: this.$t('label.startOfMonthDate', [i + 1]), value: i + 1 }))
        .concat([{ name: this.$t('label.startOfMonthDateLast'), value: 30 }])
    },

    startOfMonthIsPrev: {
      get () {
        return this.abook.startOfMonthIsPrev ? 1 : 0
      },
      set (val) {
        this.abook.startOfMonthIsPrev = (val === 1)
      }
    },

    title () {
      return this.$t('pages.abooks.current.title', {
        name: this.original.name
      })
    }
  },

  methods: {
    ...mapActions({
      update: 'abooks/save'
    }),

    async save () {
      await this.useLoading(async () => {
        try {
          await this.update({ abook: this.abook })
          this.back()
        } catch (e) {
          this.setErrors(e)
        }
      }, false)
    }
  }
}
</script>
