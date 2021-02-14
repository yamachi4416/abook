<template>
  <div>
    <div
      class="default"
      :class="{
        'hide-footer': hideFooter,
        [transition]: true
      }"
      :style="{ height: `${vh}px`}"
    >
      <div
        class="header"
        :class="{
          'header-border': headerBorder
        }"
      >
        <Title>
          <slot name="title" />
        </Title>
      </div>
      <div class="main" :class="{ smooth: smoothScroll }">
        <slot name="default" />
      </div>
      <div
        class="footer"
        :class="{
          'footer-border': footerBorder
        }"
      >
        <div>
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    headerBorder: {
      type: Boolean,
      required: false,
      default: true
    },
    footerBorder: {
      type: Boolean,
      required: false,
      default: true
    },
    hideFooter: {
      type: Boolean,
      required: false,
      default: false
    },
    smoothScroll: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  computed: {
    ...mapGetters({
      vh: 'ui/vh',
      transition: 'ui/transition'
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.default {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: $max-layout-width;
  padding: 0;
  margin: 0 auto;

  .header {
    width: 100%;
    height: $header-height;
    box-sizing: content-box;
    padding: 0;
    padding-top: env(safe-area-inset-top, 0px);
    background: var(--them-color-background);
    color: var(--them-color-font);
    text-align: center;

    &-border {
      border-bottom: 1px solid var(--them-color-border-sub);
    }
  }

  .main {
    flex: 1;
    top: $header-height;
    margin: 0 auto;
    scroll-behavior: none;
    overflow: auto;
    width: 100%;
    z-index: 1;

    opacity: 1;
    transform: none;
    transition: transform 0.3s ease-out, opacity 0.5s ease-out;
    background: var(--them-background);
    color: var(--font-color);
    border-color: var(--them-color-border);

    -webkit-overflow-scrolling: auto;
    &.smooth {
      -webkit-overflow-scrolling: touch;
    }
  }

  .footer {
    width: 100%;
    height: $footer-height;
    box-sizing: content-box;
    padding: 0;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    display: table;
    text-align: center;
    z-index: 2;

    background: var(--them-color-background);
    color: var(--them-color-font);

    &-border {
      border-top: 1px solid var(--them-color-border-sub);
    }

    &-hide {
      display: none;
    }

    & > * {
      display: table-row;

      & > * {
        display: table-cell;
        vertical-align: middle;
        width: 25%;

        [data-icon] {
          &::before {
            width: 100%;
          }
          font-size: .9em;
        }
      }
    }
  }
}

@media print {
  .default {
    -webkit-print-color-adjust: exact;
    height: unset;

    .main {
      overflow: unset;
    }

    .footer {
      display: none;
    }
  }
}

.hide-footer {
  .footer {
    display: none;
  }
}

.page-leave,
.page-leave-to {
  .page .main {
    visibility: hidden;
  }

  .prev .main {
    overflow-y: hidden;
    transform: translateX(100vw) scale(0.5);
  }

  .next .main {
    overflow-y: hidden;
    transform: translateX(-100vw) scale(0.5);
  }
}

.page-enter,
.page-enter-to {
  .page .main {
    transform: translateY(100%);
  }

  .fade .main {
    opacity: 0;
  }

  .prev .main {
    overflow-y: hidden;
    transform: translateX(-100vw) scale(0.5);
  }

  .next .main {
    overflow-y: hidden;
    transform: translateX(100vw) scale(0.5);
  }
}

.page-leave-active {
  .main {
    transition: all .2s ease-out;
  }
}

.page-enter-active {
  .main {
    transition: all .2s ease-in;
  }
}
</style>
