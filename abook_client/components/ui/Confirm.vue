<template>
  <Modal
    class="confirm-modal"
    :dismissable="false"
    @keydown="keyRing"
    @focus-into="keyRingInto"
  >
    <div ref="container" class="form">
      <header>
        <h1 class="title" v-text="title"></h1>
      </header>
      <main>
        <p class="message" v-text="message"></p>
      </main>
      <div class="btns">
        <button ref="first" class="btn btn--cancel" @click.once="cancel">
          {{ $t('actions.no') }}
        </button>
        <button ref="last" class="btn btn--ok" @click.once="ok">
          {{ $t('actions.yes') }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Vue from 'vue'
import { KeyRingMixin, ClosableMixin } from '@/modules/ui/mixins'

export default Vue.extend({
  mixins: [KeyRingMixin, ClosableMixin],

  props: {
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    }
  },

  methods: {
    async ok() {
      this.$emit('ok')
      await this.close()
    },

    async cancel() {
      this.$emit('cancel')
      await this.close()
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';
@import '~assets/scss/ui/form.scss';
@import '~assets/scss/ui/inputs.scss';

.confirm-modal {
  .form {
    @include __form;

    width: 100%;
    max-width: calc(#{$max-layout-width} / 2);
    position: relative;

    .title:not(:empty) {
      text-align: center;
      padding: 10px;
    }

    .message:not(:empty) {
      white-space: pre-wrap;
      padding: 10px;
    }

    .btns {
      padding: 15px 15px 0 15px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto;
      column-gap: 10px;

      .btn {
        @include __input();
        cursor: pointer;

        &:disabled {
          color: #aaa;
          border-color: #aaa;
          cursor: not-allowed;
        }

        &--ok {
          color: #007bff;
          border-color: #007bff;

          &:not(:disabled) {
            &:active {
              color: #fff;
              background-color: #007bff;
              border-color: #007bff;
            }
          }
        }
      }
    }
  }
}
</style>
