import { Fraction } from './Fraction'

const operators = Object.freeze({
  '+': a => b => b == null ? a : a.add(b),
  '-': a => b => b == null ? a : a.sub(b),
  '×': a => b => b == null ? a : a.mul(b),
  '÷': a => b => b == null ? a : a.div(b),
  '=': a => _ => a
})

const filters = Object.freeze({
  round: a => Math.round(a),
  ceil: a => a < 0 ? Math.floor(a) : Math.ceil(a),
  floor: a => a < 0 ? Math.ceil(a) : Math.floor(a)
})

const calculate = (data) => {
  return data.reduce((f, v) => {
    if (v instanceof Calculator) {
      return _ => f(v.fracVal)
    } else if (operators[v]) {
      return operators[v](f())
    } else {
      return _ => f(v)
    }
  }, a => a)() || Fraction.empty
}

export class Calculator {
  constructor (maxlength = 21) {
    this.maxlength = maxlength
    this.history = []
    this.data = []
    this.filter = null
  }

  setFilter (val) {
    this.filter = filters[val]
  }

  get val () {
    return (this.filter || (a => a))(
      calculate(this.data).toNumber())
  }

  get fracVal () {
    const f = calculate(this.data)
    if (this.filter) {
      return Fraction.from(String(this.filter(f.toNumber())))
    } else {
      return f
    }
  }

  get last () {
    return this.isEmpty()
      ? null : this.data[this.data.length - 1]
  }

  get isEqualed () {
    return !this.isEmpty() &&
      this.last === '='
  }

  get isOperator () {
    return !this.isEmpty() &&
      this._isOperator(this.last)
  }

  _isOperator (n) {
    return !!operators[n]
  }

  isEmpty () {
    return this.data.length === 0
  }

  clear () {
    if (!this.isEmpty()) {
      this.history.push([this.data, this.val])
    }
    this.data = []

    return this
  }

  delIndex (n) {
    if (n < this.data.length) {
      if (!this._isOperator(this.data[n])) {
        const tmp = this.data.splice(n + 1)
        this.data.pop()
        this.data = this.data.concat(tmp)
        if (!this.isEmpty() && this._isOperator(this.data[0])) {
          this.data.splice(0, 1)
        }
      }
    }
  }

  del () {
    if (this.isEmpty()) {
      return this
    } else if (this.isOperator) {
      this.data.pop()
    } else {
      const xs = this.data.pop().source.split('')
      xs.pop()
      const src = xs.join('')
      if (src === '-') {
        this.data.push(src)
      } else if (src.length) {
        this.data.push(Fraction.from(src))
      }
    }

    return this
  }

  delCe () {
    if (this.isEmpty()) {
      return this
    }

    this.data.pop()
  }

  inN (n) {
    if (this._isOperator(n)) {
      if (this.isEmpty()) {
        if (n === '-') {
          this.data.push(n)
        }
        return this
      } else if (this.isEqualed) {
        const hist = [this.data, this.fracVal]
        this.history.push(hist)
        this.data = [hist[1], n]
        return this
      }

      if (!(n === '-' && this.last !== '-' && this.last !== '+')) {
        if (this.isOperator) {
          this.data.pop()
        }
        if (this.isOperator) {
          this.data.pop()
        }
      }

      if (!this.isEmpty() || n === '-') {
        this.data.push(n)
      }
      return this
    }

    if (this.isEqualed) {
      const hist = [this.data, this.fracVal]
      this.history.push(hist)
      this.data = []
    }

    let last = this.isOperator ? null : this.data.pop()
    if (!last) {
      if (this.last === '-') {
        this.data.pop()
        if (this.isOperator) {
          last = Fraction.from('-' + n)
        } else {
          this.data.push('-')
          last = Fraction.from(n)
        }
      } else if (n === '.') {
        return this
      } else {
        last = Fraction.from(n)
      }
    } else if (last.source.length < this.maxlength) {
      if (!(n === '.' && last.source.includes('.'))) {
        if (last.source === '0') {
          if (n === '.') {
            last = Fraction.from(last.source + n)
          } else {
            last = Fraction.from(n)
          }
        } else {
          last = Fraction.from((last.source + n).substr(0, this.maxlength))
        }
      }
    }
    this.data.push(last)

    return this
  }

  inP (o, p, n) {
    if (this.data.length >= 2) {
      if (this.last instanceof Fraction &&
        this.last.source === n &&
        this.data[this.data.length - 2] === p) {
        this.data.pop()
        this.data.pop()
        return this
      }
    }

    if (this.isEqualed) {
      const hist = [this.data, this.fracVal]
      this.history.push(hist)
      this.data = [hist[1]]
    }

    if (this.last instanceof Fraction) {
      this.inN(o).inN(n)
    }

    return this
  }

  toString () {
    return `(${this.data.join(' ')})`
  }
}
