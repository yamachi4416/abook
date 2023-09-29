import { AccountEditModel, FinanceDivs } from '..'

function isValidFinanceDiv(value?: any): boolean {
  return (
    value === undefined ||
    value === FinanceDivs.Income ||
    value === FinanceDivs.Expense ||
    value === FinanceDivs.Assets ||
    value === FinanceDivs.Liabilities
  )
}

export function accountEditor({ account }: { account: AccountEditModel }) {
  return {
    get id() {
      return account.id
    },

    get name() {
      return account.name
    },
    set name(value) {
      account.name = value
    },

    get financeDiv() {
      return account.financeDiv
    },
    set financeDiv(value) {
      if (!isValidFinanceDiv(value)) {
        return
      }
      account.financeDiv = value
    },

    get useFee() {
      return account.useFee ?? false
    },
    set useFee(value) {
      account.useFee = !!value
    },

    get avaliable() {
      return account.avaliable ?? false
    },
    set avaliable(value) {
      account.avaliable = !!value
    },

    get color() {
      return account.color
    },
    set color(value) {
      account.color = value
    },

    get usuallyUsedForPayment() {
      return account.usuallyUsedForPayment ?? false
    },
    set usuallyUsedForPayment(value) {
      account.usuallyUsedForPayment = !!value
    },

    get usuallyUsedForReceipt() {
      return account.usuallyUsedForReceipt ?? false
    },
    set usuallyUsedForReceipt(value) {
      account.usuallyUsedForReceipt = !!value
    },

    get isEnableUseFee() {
      return account.financeDiv === FinanceDivs.Expense
    },

    get isEnableUsuallyUsedForPayment() {
      return (
        account.financeDiv === FinanceDivs.Assets ||
        account.financeDiv === FinanceDivs.Liabilities
      )
    },
  }
}
