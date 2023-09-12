import { AccountEditModel, FinanceDiv } from '..'

function isValidFinanceDiv(value?: any): boolean {
  return (
    value === undefined ||
    value === FinanceDiv.Income ||
    value === FinanceDiv.Expense ||
    value === FinanceDiv.Assets ||
    value === FinanceDiv.Liabilities
  )
}

export function accountEditor({
  account,
}: {
  account: { value: AccountEditModel }
}) {
  return {
    get id() {
      return account.value.id
    },

    get name() {
      return account.value.name
    },
    set name(value) {
      account.value.name = value
    },

    get financeDiv() {
      return account.value.financeDiv
    },
    set financeDiv(value) {
      if (!isValidFinanceDiv(value)) {
        return
      }
      account.value.financeDiv = value
    },

    get useFee() {
      return account.value.useFee ?? false
    },
    set useFee(value) {
      account.value.useFee = !!value
    },

    get avaliable() {
      return account.value.avaliable ?? false
    },
    set avaliable(value) {
      account.value.avaliable = !!value
    },

    get color() {
      return account.value.color
    },
    set color(value) {
      account.value.color = value
    },

    get usuallyUsedForPayment() {
      return account.value.usuallyUsedForPayment ?? false
    },
    set usuallyUsedForPayment(value) {
      account.value.usuallyUsedForPayment = !!value
    },

    get usuallyUsedForReceipt() {
      return account.value.usuallyUsedForReceipt ?? false
    },
    set usuallyUsedForReceipt(value) {
      account.value.usuallyUsedForReceipt = !!value
    },

    get isEnableUseFee() {
      return account.value.financeDiv === FinanceDiv.Expense
    },

    get isEnableUsuallyUsedForPayment() {
      return (
        account.value.financeDiv === FinanceDiv.Assets ||
        account.value.financeDiv === FinanceDiv.Liabilities
      )
    },
  }
}
