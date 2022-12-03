
// Import of uuid didn't work and I couldn't figure out how to get the settings right
import { v5 as uuid } from 'uuid'
import { globalRegistry, TRegistry } from './globalRegistry'
import {
  hasPropImplements,
  hasArrayPropImplements,
  isString,
  isWildcard,
  isUndefined
} from './utils'
import { ObjectPrototype } from './objectFactory';
import { TAdapterRegistry } from './adapterRegistry';
import { TUtilityRegistry } from './utilityRegistry';
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
  get interfaceId(): string { return };
}

export class MarkerInterface implements Interface {
  get interfaceId(): string { return };
  providedBy = _providedBy;
}

export class ObjectInterface implements Interface {
  get interfaceId(): string { return };
  constructor(context: ObjectPrototype<any>) {
    // TODO: Create facade for context
    // - Check that it implements this interface
    // - Only expose subset of props using proxy
  }
  providedBy = _providedBy;
}

export class AdapterInterface implements Interface {
  get interfaceId(): string { return };
  constructor(context: object, registry?: TAdapterRegistry) {
    const r = registry ?? globalRegistry;
    return r.getAdapter(context);
  }
}

export class UtilityInterface implements Interface {
  get interfaceId(): string { return };
  constructor(name?: string | TUtilityRegistry, registry?: TUtilityRegistry) {
    if (isString(name)) {
      const r = registry ?? globalRegistry;
      if (isWildcard(name)) {
        return r.getUtilities(this);
      } else {
        return r.getUtility(this, name);
      }
    } else {
      const r = (name ?? registry ?? globalRegistry) as TUtilityRegistry;
      return r.getUtility(this) as any;
    }
  }
}

function _providedBy(obj) {
  // Does the specified object implement this interface
  if (hasArrayPropImplements(obj)) {
    // Object has a list of interfaces it implements
    for (let i = 0, imax = obj.__implements__.length; i < imax; i++) {
      if (obj.__implements__[i].interfaceId === this.interfaceId) {
        return true;
      };
    }
  } else if (hasPropImplements(obj) && obj.__implements__.interfaceId === this.interfaceId) {
    // Object implements a single interface (probably a utility)
    return true;
  }
  // If we came this far, the object doesn't implement this interface
  return false;
}
