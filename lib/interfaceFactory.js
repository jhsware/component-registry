'use strict';
const uuid = require('uuid/v5');
const NAMESPACE = 'bc901568-0169-42a8-aac8-52fa2ffd0670';

module.exports.createInterfaceClass = function (namespace) {
    class Interface {
        constructor (params) {
            const outp = function Interface (obj) {
                for (const key in this.__proto__) {
                    if (typeof this[key] === 'function') {
                    this[key] = obj[key].bind(obj)
                    }
                }
                return this
            }

            Object.defineProperty(outp, `interfaceId`, {value: uuid(`${namespace}.${params.name}`, NAMESPACE), configurable: false, writable: false})
            
            for (const key in params) {
                // outp.prototype[`_${key}`] = params[key]
                Object.defineProperty(outp, `_${key}`, {value: params[key], configurable: false, writable: false})
            }

            outp.providedBy = function (obj) {
                // Does the specified object implement this interface
                if (obj && Array.isArray(obj._implements)) {
                    // Object has a list of interfaces it implements
                    for (var i=0, imax = obj._implements.length; i<imax; i++) {
                        if (obj._implements[i].interfaceId === this.interfaceId) {
                            return true;
                        };
                    }
                } else if (obj && obj._implements && obj._implements.interfaceId === this.interfaceId) {
                    // Object implements a single interface (probably a utility)
                    return true;
                }
                // If we came this far, the object doesn't implement this interface
                return false;
            }

            outp.addProperties = function (obj) {
                // TODO: Implement this in isomorphic-schema
                var schema = this._schema;
                var fields = (schema && schema._fields) || [];
                for (var key in fields) {
                    var field = fields[key];
                    Object.defineProperty(obj, key, {
                        configurable: true, // We might want to remove properties when passing data through API
                        enumerable: true,
                        writable: !field.readOnly
                    });
                };
    
            }

            return outp
        }
    }

    return Interface
}
