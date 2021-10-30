const isString = s => typeof s === typeof ''
const isElement = s => s instanceof Element

class SavedPos {
  constructor() {
    this._pos = {}
  }

  save(key, selector) {
    const el = isElement(selector) ? selector : document.querySelector(selector)

    if (el) {
      this._pos[key] = {
        left: el.scrollLeft,
        top: el.scrollTop
      }
    }
  }

  getPos(key) {
    const p = this._pos[key] || { top: 0, left: 0 }
    delete this._pos[key]
    return p
  }

  setPos(key, pos) {
    if (isString(pos) || isElement(pos)) {
      this.save(key, pos)
    } else {
      this._pos[key] = pos
    }
  }

  scroll(key, selector) {
    const el = isElement(selector) ? selector : document.querySelector(selector)

    if (el) {
      el.scrollTo(this.getPos(key))
    }
  }

  clear() {
    this._pos = {}
  }
}

export const savedpos = new SavedPos()

export default ({ app }, inject) => {
  inject('savedpos', savedpos)
}
