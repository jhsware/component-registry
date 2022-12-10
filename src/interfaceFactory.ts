
// Import of uuid didn't work and I couldn't figure out how to get the settings right
import { v5 as uuid } from 'uuid'
import { globalRegistry, TRegistry } from './globalRegistry'
import {
  hasPropImplements,
  hasArrayPropImplements,
  isString,
  isWildcard,
  isUndefined,
  getInterfaceId
} from './utils'
import { ObjectPrototype } from './objectFactory';
import { TAdapterRegistry } from './adapterRegistry';
import { TUtilityRegistry } from './utilityRegistry';
import { TUtility, Utility, UtilityNotFound } from './utilityFactory';
import { AdapterNotFound } from './adapterFactory';
const NAMESPACE = 'bc901568-0169-42a8-aac8-52fa2ffd0670';

const _idLookup: Record<string, string> = {};
export function createIdFactory(namespace: string) {
  return function id(name: string) {
    let id = _idLookup[`${namespace}.${name}`];
    if (!isUndefined(id)) {
      return id;
    }
    const newId = uuid(`${namespace}.${name}`, NAMESPACE);
    _idLookup[`${namespace}.${name}`] = newId;
    return newId;
  }
}

export class Interface {
  get interfaceId(): string { return '' };
}

export abstract class MarkerInterface implements Interface {
  get interfaceId(): string { return '' };
  providedBy(obj: ObjectPrototype<any>) {
    // Does the specified object implement this interface
    if (hasArrayPropImplements(obj)) {
      // Object has a list of interfaces it implements
      for (let i = 0, imax = obj.__implements__.length; i < imax; i++) {
        if (getInterfaceId(obj.__implements__[i]) === this.interfaceId) {
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

export abstract class ObjectInterface implements Interface {
  get interfaceId(): string { return '' };
  constructor(context: ObjectPrototype<any>) {
    // TODO: Create facade for context
    // - Check that it implements this interface
    // - Only expose subset of props using proxy
  }
  providedBy(obj: ObjectPrototype<any>) {
    // Does the specified object implement this interface
    if (hasArrayPropImplements(obj)) {
      // Object has a list of interfaces it implements
      for (let i = 0, imax = obj.__implements__.length; i < imax; i++) {
        if (getInterfaceId(obj.__implements__[i]) === this.interfaceId) {
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

export abstract class AdapterInterface implements Interface {
  get interfaceId(): string { return '' };
  constructor(context: object, registry?: TAdapterRegistry) {
    const r = registry ?? globalRegistry;
    return (r.getAdapter(context, this) ?? new AdapterNotFound());
  }
}

export abstract class UtilityInterface implements Interface {
  get interfaceId(): string { return '' };
  constructor(nameOrRegistry?: string | TUtilityRegistry, registry?: TUtilityRegistry) {
    if (isString(nameOrRegistry)) {
      const name = nameOrRegistry;
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

