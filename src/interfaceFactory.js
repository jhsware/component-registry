
// Import of uuid didn't work and I couldn't figure out how to get the settings right
import { v5 as uuid } from 'uuid'
import { globalRegistry } from './globalRegistry'
import {
  hasPropRegistry,
  hasPropImplements,
  hasArrayPropImplements,
  isString,
  isWildcard
} from './utils'
import {
  isDevelopment,
  throwDeprecatedCompat
} from './common'
const NAMESPACE = 'bc901568-0169-42a8-aac8-52fa2ffd0670';

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

export function createInterfaceClass(namespace) {
    class Interface {
        constructor (params) {
            if (isDevelopment) {
              if (arguments[1]) throwDeprecatedCompat()
            }

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

            if (schema && typeof schema.addProperties === 'function') {
                outp.addProperties = schema.addProperties.bind(schema) // addProperties(obj)
            } else {
                outp.addProperties = _NOOP // Do nothing
            }

            return outp
        }
    }

    return Interface
}
