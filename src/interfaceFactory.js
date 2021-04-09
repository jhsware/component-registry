
// Import of uuid didn't work and I couldn't figure out how to get the settings right
const uuid = require('uuid/v5')
const NAMESPACE = 'bc901568-0169-42a8-aac8-52fa2ffd0670';
import { globalRegistry } from './globalRegistry'
import {
  hasPropRegistry,
  notNullOrUndef,
  hasPropImplements,
  hasArrayPropImplements,
  isString,
  isWildcard
} from './utils'

function _providedBy (obj) {
    // Does the specified object implement this interface
    if (hasArrayPropImplements(obj)) {
        // Object has a list of interfaces it implements
        for (var i=0, imax = obj._implements.length; i<imax; i++) {
            if (obj._implements[i].interfaceId === this.interfaceId) {
                return true;
            };
        }
    } else if (hasPropImplements(obj) && obj._implements.interfaceId === this.interfaceId) {
        // Object implements a single interface (probably a utility)
        return true;
    }
    // If we came this far, the object doesn't implement this interface
    return false;
}

function _lookup (_this, intrfc, registry) {
  if (hasPropImplements(intrfc)) {
      // Adapter lookup
      return registry.getAdapter(intrfc, _this.constructor)
  } else if (isString(intrfc)) {
      if (isWildcard(intrfc)) {
        // Lookup all utilities
        return registry.getUtilities(_this.constructor)
      }
      else {
        // Named utility lookup
        return registry.getUtility(_this.constructor, intrfc)  
      }
  } else {
      // Unnamed utility lookup
      return registry.getUtility(_this.constructor)
  }
}

function _NOOP () {}

function _addPropsCompat (obj) {
  const schema = this
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

export function createInterfaceClass(namespace) {
    class Interface {
        constructor (params, compat) {
            const outp = function Interface (paramOne, paramTwo) {
                // First figure out what registry to use so we can pass
                // the same props to _lookup allowing JS engine to optimize
                let registry
                if (hasPropRegistry(paramTwo)) registry = paramTwo.registry
                else if (hasPropRegistry(paramOne)) registry = paramOne.registry
                else registry = globalRegistry

                const intrfc = paramOne
                return _lookup(this, intrfc, registry)
            }

            Object.defineProperty(outp, `interfaceId`, {value: uuid(`${namespace}.${params.name}`, NAMESPACE), configurable: false, writable: false})
            
            for (const key in params) {
                // outp.prototype[`_${key}`] = params[key]
                Object.defineProperty(outp, key, {value: params[key], configurable: false, writable: false})
            }

            // Use broken out func so JS engine can optimize
            outp.providedBy = _providedBy

            const schema = params.schema

            // TODO: Remove _addPropsCompat in V2
            if (compat) {
                // Compatibility
                outp.addProperties = _addPropsCompat.bind(schema)
            }

            if (!compat) {
                if (schema && typeof schema.addProperties === 'function') {
                    outp.addProperties = schema.addProperties.bind(schema) // addProperties(obj)
                } else {
                    outp.addProperties = _NOOP // Do nothing
                }
            }

            return outp
        }
    }

    return Interface
}
