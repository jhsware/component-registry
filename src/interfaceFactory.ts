
// Import of uuid didn't work and I couldn't figure out how to get the settings right
import { v5 as uuid } from 'uuid'
import { globalRegistry } from './globalRegistry'
import {
  hasArrayPropImplements,
  isString,
  isWildcard,
  isUndefined,
  getInterfaceId
} from './utils'
import { ObjectPrototype } from './objectFactory';
import { TAdapterRegistry } from './adapterRegistry';
import { TUtilityRegistry } from './utilityRegistry';
import { UtilityNotFound } from './utilityFactory';
import { AdapterNotFound } from './adapterFactory';
const NAMESPACE = 'bc901568-0169-42a8-aac8-52fa2ffd0670';

const _idLookup: Record<string, string> = {};
function idFactory(namespace: string, name: string) {
  let id = _idLookup[`${namespace}.${name}`];
  if (!isUndefined(id)) {
    return id;
  }
  const newId = uuid(`${namespace}.${name}`, NAMESPACE);
  _idLookup[`${namespace}.${name}`] = newId;
  return newId;
}

function inheritsFrom(obj, base): boolean {
  while (!isUndefined(obj.prototype)) {
    if (obj.prototype instanceof base) return true;
    obj = obj.prototype
  }
  return false;
}

export function createInterfaceDecorator(namespace: string) {
  return function (intrfc: any, context) {
    // All interfaces need an interfaceId
    intrfc.interfaceId = idFactory(namespace, intrfc.name);

    // Some interfaces need providedBy
    if (inheritsFrom(intrfc, ObjectInterface) || inheritsFrom(intrfc, MarkerInterface)) {
      intrfc.providedBy = (obj) => {
          return intrfc.prototype.providedBy(obj, intrfc.interfaceId);
      }
    }

    return intrfc 
  }
}

export class MarkerInterface {
  static interfaceId: string;
  
  static providedBy(obj: ObjectPrototype<any>): boolean {
    return;
  }

  providedBy(obj: ObjectPrototype<any>, interfaceId?: string) {
    // Does the specified object implement this interface
    if (hasArrayPropImplements(obj)) {
      // Object has a list of interfaces it implements
      for (let i = 0, imax = obj.__implements__.length; i < imax; i++) {
        if (getInterfaceId(obj.__implements__[i]) === interfaceId) {
          return true;
        };
      }
      // } else if (hasPropImplements(obj) && getInterfaceId(obj.__implements__) === this.interfaceId) {
      //   // Object implements a single interface (probably a utility)
      //   return true;
    }
    // If we came this far, the object doesn't implement this interface
    return false;
  }
}

export type TypeFromInterface<T> = Omit<T, 'interfaceId' | 'providedBy'>; 

export class ObjectInterface {
  static interfaceId: string;
  
  constructor(context: ObjectPrototype<any>) {
    // TODO: Create facade for context
    // - Check that it implements this interface
    // - Only expose subset of props using proxy
  }

  static providedBy(obj: ObjectPrototype<any>): boolean {
    return;
  }

  providedBy(obj: ObjectPrototype<any>, interfaceId?: string ) {
    // Does the specified object implement this interface
    if (hasArrayPropImplements(obj)) {
      // Object has a list of interfaces it implements
      for (let i = 0, imax = obj.__implements__.length; i < imax; i++) {
        if (getInterfaceId(obj.__implements__[i]) === interfaceId) {
          return true;
        };
      }
      // } else if (hasPropImplements(obj) && getInterfaceId(obj.__implements__) === this.interfaceId) {
      //   // Object implements a single interface (probably a utility)
      //   return true;
    }
    // If we came this far, the object doesn't implement this interface
    return false;
  }

  toJSON(): any {}
}

export class AdapterInterface<TContext = any> {
  static interfaceId: string;

  context?: ObjectPrototype<TContext>;

  constructor(context: ObjectPrototype<any>, registry?: TAdapterRegistry) {
    const r = registry ?? globalRegistry;
    return (r.getAdapter(context, this) ?? new AdapterNotFound());
  }
}

export class UtilityInterface {
  static interfaceId: string;
  static __name__: string;

  constructor(nameOrRegistry?: string | TUtilityRegistry, registry?: TUtilityRegistry) {
    if (isString(nameOrRegistry)) {
      const name = nameOrRegistry as string;
      const reg = registry ?? globalRegistry;
      if (isWildcard(name)) {
        return reg.getUtilities(this);
      } else {
        return (reg.getUtility(this, name) ?? new UtilityNotFound()) as any;
      }
    } else {
      const reg = (nameOrRegistry ?? registry ?? globalRegistry) as TUtilityRegistry;
      return (reg.getUtility(this) ?? new UtilityNotFound()) as any;
    }
  }
}

