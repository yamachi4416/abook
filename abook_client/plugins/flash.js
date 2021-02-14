class FlashAttribute {
  constructor () {
    this._attrs = {}
  }

  getAttr (key) {
    const a = this._attrs[key]
    delete this._attrs[key]
    return a
  }

  setAttr (key, value) {
    this._attrs[key] = value
  }

  clear () {
    this._attrs = {}
  }
}

const flashattrs = new FlashAttribute()

export default ({ app }, inject) => {
  inject('flashattrs', flashattrs)
}
