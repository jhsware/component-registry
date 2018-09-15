export class Schema {
  constructor(fields) {
    this._fields = Object.assign({}, fields)
  }

  getFields() {
    return this._fields
  }

  addProperties(obj) {
    Object.keys(this._fields).forEach((key) => {
      Object.defineProperty(obj, key, { configurable: true, enumerable: true, writable: true });
    })
  }
}
