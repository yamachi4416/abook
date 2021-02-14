export class Errors {
  constructor (errors) {
    this.errors = Object.assign({}, errors)
  }

  clear () {
    this.errors = {}
  }

  clearError (name) {
    delete this.errors[name]
  }

  hasError (name) {
    if (name === '*') {
      return Object.keys(this.errors).length > 0
    }

    if (name instanceof RegExp) {
      return Object.keys(this.errors)
        .some(v => name.test(v))
    }

    return Object.keys(this.errors).includes(name)
  }

  addError (name, value) {
    if (this.hasError(name)) {
      this.errors[name].push(value)
    } else {
      this.errors[name] = [value]
    }
  }

  setErrors (errors) {
    this.errors = Object.assign({}, errors)
  }

  getErrors (name) {
    if (name === '*') {
      return Object.values(this.errors)
        .reduce((r, xs) => r.concat(xs), [])
    }

    if (name instanceof RegExp) {
      return Object.entries(this.errors)
        .filter(v => name.test(v[0]))
        .reduce((r, v) => r.concat(v[1]), [])
    }
    return this.errors[name] || []
  }
}
