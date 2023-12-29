export class Schema {
  _fields
  
  constructor(fields) {
    this._fields = Object.assign({}, fields)
  }

  get fields() {
    return this._fields
  }
}
