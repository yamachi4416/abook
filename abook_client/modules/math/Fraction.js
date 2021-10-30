const gcm = (a, b) => {
  if (a < b) {
    ;[a, b] = [b, a]
  }

  if (b === 0) {
    return 1
  }

  let r = a % b
  while (r !== 0) {
    ;[a, b] = [b, r]
    r = a % b
  }

  return b
}

const toNumStr = n => {
  const s = String(n)
  if (s.includes('e')) {
    const xs = s.split('e')
    const e = Number(xs[1])
    if (xs[0].includes('.')) {
      const ys = xs[0].split('.')
      if (e > 0) {
        return ys[0] + ys[1] + '0'.repeat(e - ys[1].length)
      } else {
        return '0.' + '0'.repeat(Math.abs(ys[0].length + e)) + ys[0] + ys[1]
      }
    } else if (e > 0) {
      return xs[0] + '0'.repeat(e)
    } else {
      return '0.' + '0'.repeat(Math.abs(xs[0].length + e)) + xs[0]
    }
  } else {
    return s
  }
}

export class Fraction {
  static from(input) {
    const source = toNumStr(input)
    const xs = source.split('.')
    const n1 = new Fraction(Number(xs[0] || 0), 1, source)
    if (xs.length === 1 || !xs[1]) {
      return n1
    } else {
      xs[1] = xs[1].replace(/0+$/, '')
      const n2 = n1.add(new Fraction(Number(xs[1]), Math.pow(10, xs[1].length)))
      n2.source = source
      return n2
    }
  }

  static get empty() {
    return {
      toNumber() {
        return 0
      }
    }
  }

  constructor(numerator = 0, denomitor = 1, source = '') {
    const g = gcm(numerator, denomitor)
    this._n = numerator / g
    this._d = denomitor / g
    this.source = source || toNumStr(this.toNumber())
  }

  get n() {
    return this._n
  }

  get d() {
    return this._d
  }

  add(o) {
    return new Fraction(this.n * o.d + o.n * this.d, this.d * o.d)
  }

  sub(o) {
    return new Fraction(this.n * o.d - o.n * this.d, this.d * o.d)
  }

  mul(o) {
    return new Fraction(this.n * o.n, this.d * o.d)
  }

  div(o) {
    return new Fraction(this.n * o.d, this.d * o.n)
  }

  toNumber() {
    return this.n / this.d
  }

  toString() {
    if (this.source) {
      if (this.source.includes('.')) {
        return this.source.replace(/^0+/, '0')
      } else {
        return this.source.replace(/^0+/, '') || '0'
      }
    }
    return String(this.toNumber())
  }
}
