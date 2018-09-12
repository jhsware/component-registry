module.exports.Schema = function (fields) {
  this._fields = Object.assign({}, fields)
}

module.exports.Schema.prototype.getFields = function () {
  return this._fields
}

module.exports.Schema.prototype.addProperties = function (obj) {
  Object.keys(this._fields).forEach((key) => {
    Object.defineProperty(obj, key, { configurable: true, enumerable: true, writable: true });
  })
}