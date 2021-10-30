<template>
  <div class="journal-edit">
    <div class="journal-edit--accrualDate">
      <FormGroup object="journal" field="accrualDate" :errors="errors">
        <input v-model="journal.accrualDate" type="date" />
      </FormGroup>
    </div>

    <div class="journal-edit--journalDiv">
      <FormGroup object="journal" field="journalDiv" :errors="errors">
        <Selects
          v-model="journal.journalDiv"
          :empty="null"
          :options="$t('select.journalDiv')"
          :mapper="o => [o.label, o.value]"
          @change="changeJournalDiv()"
        />
      </FormGroup>
    </div>

    <div class="journal-edit--debitAccount">
      <FormGroup
        object="journal"
        field="debitAccount"
        :label-field="`debitAccount_${journal.journalDiv || ''}`"
        :errors="errors"
      >
        <Selects
          v-model="journal.debitAccount"
          :options="debitAccounts"
          :mapper="o => [o.name, o]"
          :matcher="(a, b) => a.id === b.id"
          @change="changeDebitAccount()"
        />
      </FormGroup>
    </div>

    <div class="journal-edit--creditAccountId">
      <FormGroup
        object="journal"
        field="creditAccount"
        :label-field="`creditAccount_${journal.journalDiv || ''}`"
        :errors="errors"
      >
        <Selects
          v-model="journal.creditAccount"
          :options="creditAccounts"
          :mapper="o => [o.name, o]"
          :matcher="(a, b) => a.id === b.id"
          @change="changeCreditAccount()"
        />
      </FormGroup>
    </div>

    <div
      v-if="journal.fee && feeAccounts.length > 0"
      class="journal-edit--fee-accountId"
    >
      <FormGroup object="journal" field="fee.account" :errors="errors">
        <Selects
          v-model="journal.fee.account"
          :options="feeAccounts"
          :mapper="o => [o.name, o]"
          :matcher="(a, b) => a.id === b.id"
          @change="changeFeeAccount()"
        />
      </FormGroup>
    </div>

    <div
      v-if="journal.fee && journal.fee.account"
      class="journal-edit--feeAmount"
    >
      <FormGroup object="journal" field="fee.feeAmount" :errors="errors">
        <CalcNumber
          ref="feeAmount"
          v-model.number="journal.fee.feeAmount"
          @change="changeFeeAmount()"
        />
      </FormGroup>
    </div>

    <div
      class="journal-edit--amount"
      :class="{ 'use-fee': journal.fee && journal.fee.account }"
    >
      <FormGroup
        object="journal"
        field="amount"
        :label-field="`amount${
          journal.fee && journal.fee.account ? '_3f' : ''
        }`"
        :errors="errors"
      >
        <CalcNumber
          ref="amount"
          v-model="journal.amount"
          @change="changeAmount"
        />
      </FormGroup>
    </div>

    <div
      v-if="journal.fee && journal.fee.account"
      class="journal-edit--fee-amount"
    >
      <FormGroup object="journal" field="fee.amount" :errors="errors">
        <CalcNumber v-model="journal.fee.amount" @change="changeFee()" />
      </FormGroup>
    </div>

    <div class="journal-edit--memo">
      <FormGroup object="journal" field="memo" :errors="errors">
        <textarea v-model="journal.memo"></textarea>
      </FormGroup>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    accounts: {
      type: Array,
      required: true
    },
    editmodel: {
      type: Object,
      required: true
    },
    original: {
      type: Object,
      required: true
    },
    errors: {
      type: Object,
      required: true
    }
  },

  computed: {
    journal() {
      return this.editmodel
    },

    debitAccounts() {
      const a1 = this.original.debitAccount
      const a2 = this.journal.debitAccount
      return this.getDebitAccounts().filter(
        a => a.avaliable || (a1 && a.id === a1.id) || (a2 && a.id === a2.id)
      )
    },

    creditAccounts() {
      const a1 = this.original.creditAccount
      const a2 = this.journal.creditAccount
      return this.getCreditAccounts().filter(
        a => a.avaliable || (a1 && a.id === a1.id) || (a2 && a.id === a2.id)
      )
    },

    feeAccounts() {
      const a1 = this.original.fee && this.original.fee.account
      return this.accounts
        .filter(a => a.financeDiv === 2)
        .filter(a => (a.avaliable && a.useFee) || (a1 && a.id === a1.id))
    },

    usuallyUsedForPayment() {
      return this.creditAccounts.find(a => a.usuallyUsedForPayment)
    },

    usuallyUsedForReceipt() {
      return this.debitAccounts.find(a => a.usuallyUsedForReceipt)
    }
  },

  mounted() {
    if (this.journal && !this.journal.isRegisted()) {
      if (this.journal.journalDiv) {
        this.changeJournalDiv()
      }
    }
  },

  methods: {
    getDebitAccounts() {
      if (this.journal.journalDiv === 1) {
        return this.accounts.filter(a => [3, 4].includes(a.financeDiv))
      }

      if (this.journal.journalDiv === 2) {
        return this.accounts.filter(a => [2].includes(a.financeDiv))
      }

      if (this.journal.journalDiv === 3) {
        const credit = this.journal.creditAccount
        if (credit) {
          return this.accounts.filter(
            a => [3, 4].includes(a.financeDiv) && a !== credit
          )
        }

        return this.accounts.filter(a => [3, 4].includes(a.financeDiv))
      }

      return this.accounts.filter(a => [2, 3, 4].includes(a.financeDiv))
    },

    getCreditAccounts() {
      if (this.journal.journalDiv === 1) {
        return this.accounts.filter(a => [1].includes(a.financeDiv))
      }

      if (this.journal.journalDiv === 2) {
        return this.accounts.filter(a => [3, 4].includes(a.financeDiv))
      }

      if (this.journal.journalDiv === 3) {
        const debit = this.journal.debitAccount
        if (debit) {
          return this.accounts.filter(
            a => [3, 4].includes(a.financeDiv) && a !== debit
          )
        }
        return this.accounts.filter(a => [3, 4].includes(a.financeDiv))
      }

      return this.accounts.filter(a => [1, 3, 4].includes(a.financeDiv))
    },

    changeDebitAccount() {
      if (this.journal.debitAccount) {
        const financeDiv = this.journal.debitAccount.financeDiv
        if (financeDiv === 2) {
          this.journal.journalDiv = 2
          if (!this.journal.creditAccount) {
            this.journal.creditAccount = this.usuallyUsedForPayment
          }
        } else if (this.journal.creditAccount) {
          if (!this.journal.journalDiv) {
            if (this.journal.creditAccount.financeDiv === 1) {
              this.journal.journalDiv = 1
            } else {
              this.journal.journalDiv = 3
            }
          }
        }
      }
    },

    changeCreditAccount() {
      if (this.journal.creditAccount) {
        const financeDiv = this.journal.creditAccount.financeDiv
        if (financeDiv === 1) {
          this.journal.journalDiv = 1
          if (!this.journal.debitAccount) {
            this.journal.debitAccount = this.usuallyUsedForReceipt
          }
        } else if (this.journal.debitAccount) {
          if (!this.journal.journalDiv) {
            if (this.journal.debitAccount.financeDiv === 2) {
              this.journal.journalDiv = 2
            } else {
              this.journal.journalDiv = 3
            }
          }
        }
      }
    },

    changeJournalDiv() {
      if (this.journal.debitAccount) {
        if (
          !this.getDebitAccounts().find(
            a => a.id === this.journal.debitAccount.id
          )
        ) {
          this.journal.debitAccount = null
        }
      }

      if (this.journal.creditAccount) {
        if (
          !this.getCreditAccounts().find(
            a => a.id === this.journal.creditAccount.id
          )
        ) {
          this.journal.creditAccount = null
        }
      }

      if (this.journal.journalDiv === 1) {
        if (!this.journal.debitAccount) {
          this.journal.debitAccount = this.usuallyUsedForReceipt
        }
      }

      if (this.journal.journalDiv === 2) {
        if (!this.journal.creditAccount) {
          this.journal.creditAccount = this.usuallyUsedForPayment
        }
      }

      if (this.journal.journalDiv === 3) {
        this.journal.fee = { account: null }
      } else {
        this.journal.fee = null
      }
    },

    changeFeeAccount() {
      if (this.journal.fee.account) {
        this.journal.fee.feeAmount = this.journal.amount
      } else {
        this.journal.fee = { account: null }
      }
    },

    changeFeeAmount() {
      const journal = this.journal

      if (!(journal.fee && journal.fee.account)) {
        return
      }

      if (!journal.fee.feeAmount) {
        if (journal.amount) {
          journal.fee.feeAmount =
            journal.amount - (journal.fee.amount || 0) || null
        } else {
          journal.fee.feeAmount = null
        }
      } else if (journal.fee.amount) {
        journal.amount = journal.fee.feeAmount + journal.fee.amount
      } else if (journal.amount) {
        if (journal.amount >= journal.fee.feeAmount) {
          journal.fee.amount = journal.amount - journal.fee.feeAmount
        } else {
          journal.amount = journal.fee.feeAmount
        }
      } else {
        journal.amount = journal.fee.feeAmount
      }
    },

    changeAmount() {
      const journal = this.journal

      if (!(journal.fee && journal.fee.account)) {
        return
      }

      if (!journal.amount) {
        if (journal.fee.feeAmount) {
          journal.amount =
            journal.fee.feeAmount + (journal.fee.amount || 0) || null
        } else {
          journal.amount = null
        }
      } else if (journal.fee.amount) {
        if (journal.amount < journal.fee.amount) {
          journal.amount = journal.amount + journal.fee.amount
        }
        journal.fee.feeAmount = journal.amount - journal.fee.amount || null
      } else if (journal.fee.feeAmount) {
        if (journal.amount >= journal.fee.feeAmount) {
          journal.fee.amount = journal.amount - journal.fee.feeAmount
        } else {
          journal.fee.feeAmount = journal.amount
        }
      } else {
        journal.fee.feeAmount = journal.amount
      }
    },

    changeFee() {
      const journal = this.journal

      if (!(journal.fee && journal.fee.account)) {
        return
      }

      if (!journal.fee.amount) {
        if (journal.amount) {
          journal.fee.feeAmount = journal.amount
        } else if (journal.fee.feeAmount) {
          journal.amount = journal.fee.feeAmount
        }
      } else if (journal.amount) {
        if (journal.amount <= journal.fee.amount) {
          journal.fee.amount = journal.amount
          journal.fee.feeAmount = null
        } else {
          journal.fee.feeAmount = journal.amount - journal.fee.amount
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';

.journal-edit {
  display: grid;

  &--accrualDate {
    grid-area: accrualDate;
  }

  &--journalDiv {
    grid-area: journalDiv;
  }

  &--debitAccount {
    grid-area: debitAccount;
  }

  &--creditAccountId {
    grid-area: creditAccountId;
  }

  &--fee-accountId {
    grid-area: fee-accountId;
  }

  &--feeAmount {
    grid-area: feeAmount;
  }

  &--amount {
    grid-area: feeAmount;
    &.use-fee {
      grid-area: amount;
    }
  }

  &--fee-amount {
    grid-area: fee-amount;
  }

  &--memo {
    grid-area: memo;
  }

  &--none {
    grid-area: none;
  }

  @include __media_phone {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      'accrualDate'
      'journalDiv'
      'debitAccount'
      'creditAccountId'
      'fee-accountId'
      'feeAmount'
      'amount'
      'fee-amount'
      'memo';
  }

  @include __media_tablet_pc {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      'accrualDate  none            none'
      'journalDiv   none            none'
      'debitAccount creditAccountId fee-accountId'
      'feeAmount    amount          fee-amount'
      'memo         memo            memo';
  }
}
</style>
