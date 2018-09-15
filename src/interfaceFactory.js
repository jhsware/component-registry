'use strict';
// Import didn't work and I couldn't figure out how to get the settings right
const uuid = require('uuid/v5')
const NAMESPACE = 'bc901568-0169-42a8-aac8-52fa2ffd0670';
import { globalRegistry } from './index'


export function createInterfaceClass(namespace) {
    class Interface {
        constructor (params, compat) {
            const outp = function Interface () {
                const paramOne = arguments[0],
                      paramTwo = arguments[1];
                const registry = (paramTwo ? paramTwo.registry : paramOne && paramOne.registry) || globalRegistry;
                if (typeof paramOne === 'object' && paramOne._implements) {
                    // Adapter lookup
                    return registry.getAdapter(paramOne, this.constructor)
                } else if (typeof paramOne === 'string') {
                    // Named utility lookup
                    return registry.getUtility(this.constructor, paramOne)
                } else {
                    // Unnamed utility lookup
                    return registry.getUtility(this.constructor)
                }
            }

            Object.defineProperty(outp, `interfaceId`, {value: uuid(`${namespace}.${params.name}`, NAMESPACE), configurable: false, writable: false})
            
            for (const key in params) {
                // outp.prototype[`_${key}`] = params[key]
                Object.defineProperty(outp, key, {value: params[key], configurable: false, writable: false})
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

            const schema = params.schema

            if (compat) {
                // Compatibility
                outp.addProperties = function (obj) {
                    // TODO: Implement this in isomorphic-schema

                    
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
            }

            if (!compat) {
                if (schema && typeof schema.addProperties === 'function') {
                    outp.addProperties = schema.addProperties.bind(schema) // addProperties(obj)
                } else {
                    outp.addProperties = function () {}
                }
            }

            return outp
        }
    }

    return Interface
}
