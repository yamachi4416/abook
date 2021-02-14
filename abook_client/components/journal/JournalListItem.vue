<template>
  <component
    :is="'div'"
    class="item"
    @click.once.prevent.stop="$emit('click', item)"
  >
    <span class="item-badge">
      <span class="badge" :badge="item.journalDiv">
        {{ $t(`select.journalDiv.${item.journalDiv}.label`) }}
      </span>
    </span>
    <span class="item-dname">{{ item.debitAccount.name }}</span>
    <span class="item-cname">{{ item.creditAccount.name }}</span>
    <span class="item-amount">{{ (item.amount - (item.fee ? item.fee.amount : 0) ) | comma }}</span>
    <span v-if="item.memo" class="item-memo" v-text="item.memo" />
    <span v-if="item.fee" class="item-fdname">{{ item.fee.account.name }}</span>
    <span v-if="item.fee" class="item-fcname">{{ item.creditAccount.name }}</span>
    <span v-if="item.fee" class="item-famount">{{ item.fee.amount | comma }}</span>
  </component>
</template>

<script>
export default {
  props: {
    tagName: {
      type: String,
      default: 'div'
    },
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.item {
  cursor: pointer;
  padding: 5px 10px;
  border-bottom: 0.5px dashed var(--them-color-border-sub);

  &:active {
    background: var(--focus-background);
  }

  &:last-of-type {
    border-bottom: none;
  }

  display: grid;
  grid-template-columns: 60px 19% 19% 90px 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    "badge dname  cname  amount  note"
    "badge fdname fcname famount note";

  & > * {
    display: block;
    padding: 0 5px;
  }

  &-badge {
    grid-area: badge;
  }

  &-dname {
    grid-area: dname;
    word-break: break-word;
  }

  &-cname {
    grid-area: cname;
    word-break: break-word;
  }

  &-amount {
    grid-area: amount;
    text-align: right;
  }

  &-fdname {
    grid-area: fdname;
    word-break: break-word;
  }

  &-fcname {
    grid-area: fcname;
    word-break: break-word;
  }

  &-famount {
    grid-area: famount;
    text-align: right;
  }

  &-memo {
    grid-area: note;
    white-space: pre-line;
    word-break: break-word;
  }

  @include __media_tablet {
    grid-template-columns: 60px 1fr 1fr 90px;
    grid-template-rows: auto auto auto;
    grid-template-areas:
      "badge dname  cname  amount"
      "badge fdname fcname famount"
      "badge note   note   note";

    &-memo {
      padding: 5px;
      font-size: .9rem;
    }
  }

  @include __media_phone {
    grid-template-columns: 60px 1fr 1fr;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      "badge dname  cname"
      "badge amount amount"
      "badge fdname famount"
      "badge note  note";

    &-amount {
      padding-top: 10px;
    }

    &-fcname {
      display: none;
    }

    &-memo {
      padding: 5px;
      font-size: .9rem;
    }
  }
}
</style>
