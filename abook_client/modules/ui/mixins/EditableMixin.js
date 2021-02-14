import { Errors } from '../../errors'
import { showConfirm } from '../../ui'
import LoadingMixin from './LoadingMixin'

export default {
  mixins: [LoadingMixin],

  data () {
    return {
      errors: new Errors()
    }
  },

  methods: {
    setErrors (e) {
      const { status, data } = e.response
      if (status === 400) {
        this.errors.setErrors(data)
        this.stopLoading()
      } else {
        throw e
      }
    },

    async confirmRemove () {
      return await showConfirm({
        parent: this.$parent,
        title: this.$t('confirm.remove.message')
      })
    }
  }
}
