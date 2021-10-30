import datetime from '@/modules/utils/datetime'

export class JournalModel {
  constructor(entity) {
    this.id = null
    this.accrualDate = datetime().format('YYYY-MM-DD')
    this.journalDiv = null
    this.debitAccount = null
    this.creditAccount = null
    this.amount = null
    this.fee = null

    if (entity) {
      Object.assign(this, entity)

      if (this.journalDiv === 3) {
        if (this.fee) {
          this.fee.feeAmount = this.amount - this.fee.amount
        }
      }
    }
  }

  isRegisted() {
    return (this.id || '').length > 0
  }

  isUseAccountId(accId) {
    return (
      this.creditAccount.id === accId ||
      this.debitAccount.id === accId ||
      (this.fee && this.fee.account.id === accId)
    )
  }

  clone() {
    const entity = { ...this }
    if (this.creditAccount) {
      entity.creditAccount = { ...this.creditAccount }
    }

    if (this.debitAccount) {
      entity.debitAccount = { ...this.debitAccount }
    }

    if (this.fee) {
      entity.fee = { ...this.fee }
    }
    return new JournalModel(entity)
  }

  static wrap(entity) {
    if (entity) {
      return new JournalModel(entity)
    }
    return null
  }

  static wraps(entities) {
    return (entities || []).map(this.wrap)
  }

  static groupByAccrualDate(journals) {
    const groups = journals.reduce((p, j) => {
      const key = j.accrualDate
      p[key] = [...(p[key] || []), j]
      return p
    }, {})

    return Object.entries(groups).map(d => ({ date: d[0], items: d[1] }))
  }

  static summaryOfFinance(journals, accounts) {
    return Object.values(this.summaryOfAccount(journals, accounts)).reduce(
      (p, a) => {
        if (!p[a.financeDiv]) {
          p[a.financeDiv] = {
            financeDiv: a.financeDiv,
            debit: 0,
            credit: 0,
            amount: 0,
            items: []
          }
        }

        const d = p[a.financeDiv]
        d.items.push(a)
        d.debit += a.debit
        d.credit += a.credit
        d.amount += a.amount

        return p
      },
      {}
    )
  }

  static summaryOfAccount(journals, accounts) {
    const mapAccount = a => ({
      id: a.id,
      name: a.name,
      color: a.color,
      dispOrder: a.dispOrder,
      financeDiv: a.financeDiv,
      items: []
    })

    const putAccount = (p, a) => {
      if (!p[a.id]) {
        p[a.id] = mapAccount(a)
      }
      return p[a.id]
    }

    const accMap = (accounts || []).reduce((p, a) => {
      putAccount(p, a)
      return p
    }, {})

    journals.forEach(m => {
      m.items.forEach(j => {
        putAccount(accMap, j.creditAccount).items.push(j)
        putAccount(accMap, j.debitAccount).items.push(j)
        if (j.fee) {
          putAccount(accMap, j.fee.account).items.push(j)
        }
      })
    })

    return Object.values(accMap)
      .sort((a, b) => {
        if (a.financeDiv === b.financeDiv) {
          return a.dispOrder - b.dispOrder
        } else {
          return a.financeDiv - b.financeDiv
        }
      })
      .reduce((ret, a) => {
        const debit = a.items.reduce((p, j) => {
          if (j.debitAccount.id === a.id) {
            return p + j.amount - (j.fee ? j.fee.amount : 0)
          } else if (j.fee && j.fee.account.id === a.id) {
            return p + j.fee.amount
          }
          return p
        }, 0)

        const credit = a.items.reduce((p, j) => {
          if (j.creditAccount.id === a.id) {
            return p + j.amount
          }
          return p
        }, 0)

        a.debit = debit
        a.credit = credit
        a.amount = [1, 4].includes(a.financeDiv)
          ? credit - debit
          : debit - credit

        ret[a.id] = a

        return ret
      }, {})
  }
}
