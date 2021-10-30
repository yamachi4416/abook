<template>
  <transition name="fade">
    <div
      v-if="show"
      :key="_uid"
      class="modal"
      :class="{ current: isCurrentModal }"
      v-bind="$attrs"
    >
      <div class="modal-overlay" @click.self="dismiss()">
        <div class="modal-content" :style="styles" @click.self="dismiss()">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'

export default {
  inheritAttrs: false,
  props: {
    styles: {
      type: Object,
      default: () => ({})
    },
    dismissable: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      show: false
    }
  },

  computed: {
    ...mapGetters({
      currentModal: 'ui/currentModal'
    }),

    isCurrentModal() {
      const c = this.currentModal
      return c && c.uid === this._uid
    }
  },

  beforeMount() {
    this.prevActive = document.activeElement
    if (this.prevActive) {
      this.prevActive.blur()
    }
  },

  mounted() {
    window.addEventListener('keydown', this.keydown)
    this.addModal(this)
    this.show = true
    const tabstop = document.createElement('span')
    tabstop.setAttribute('tabindex', '0')
    tabstop.addEventListener('focus', event => {
      if (this.isCurrentModal) {
        event.preventDefault()
        this.$emit('focus-into')
      }
    })
    document.body.insertBefore(tabstop, document.body.firstChild)
    this.tabstop = tabstop
  },

  beforeDestroy() {
    this.show = false
    window.removeEventListener('keydown', this.keydown)
    document.body.removeChild(this.tabstop)
  },

  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
    if (this.prevActive && this.isCurrentModal) {
      this.prevActive.focus()
    }
    this.removeModal(this)
    this.$emit('close')
  },

  methods: {
    ...mapMutations({
      addModal: 'ui/addModal',
      removeModal: 'ui/removeModal'
    }),

    async close() {
      this.show = false
      await this.$nextTick()
      this.$destroy()
    },

    async dismiss() {
      if (this.dismissable) {
        await this.close()
      }
    },

    async keydown(event) {
      if (!this.isCurrentModal) {
        return
      }

      if (event.keyCode === 27) {
        event.preventDefault()
        await this.close()
      } else {
        this.$emit('keydown', event)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;

  .modal-content {
    transition: transform 0.2s;
  }
}
.fade-enter,
.fade-leave-to {
  opacity: 0;

  .modal-content {
    transform: scale(0.5);
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 100;
  overflow-y: auto;

  &.current &-overlay {
    background: rgba(0, 0, 0, 0.6);
    transition: background 0.3s;
  }

  &:not(.current) &-overlay {
    background: rgba(0, 0, 0, 0);
    transition: background 0.3s;
  }

  &-overlay {
    background: rgba(0, 0, 0, 0);
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &-content {
    width: $max-layout-width;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding-top: $header-height;
    padding-bottom: $footer-height;
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
