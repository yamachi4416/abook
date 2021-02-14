export class AccountModel {
  constructor (entity) {
    this.id = null
    this.financeDiv = null
    this.name = null
    this.color = '#ffffff'
    this.avaliable = true
    this.useFee = false
    this.usuallyUsedForPayment = false
    this.usuallyUsedForReceipt = false

    if (entity) {
      Object.assign(this, entity)
    }
  }

  isRegisted () {
    return (this.id || '').length > 0
  }

  clone () {
    const entity = { ...this }
    return new AccountModel(entity)
  }

  static wrap (entity) {
    if (entity) {
      return new AccountModel(entity)
    }
    return null
  }
}
