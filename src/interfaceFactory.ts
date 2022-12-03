
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

export function createNamespace(namespace: string) {
  return (name: string) => uuid(`${namespace}.${name}`, NAMESPACE);
}

export class Interface {
  readonly interfaceId: string;
}

export class MarkerInterface implements Interface {
  readonly interfaceId: string;
  providedBy = _providedBy;
}

export class ObjectInterface implements Interface {
  readonly interfaceId: string;
  constructor(context: ObjectPrototype<any>) {
    // TODO: Create facade for context
    // - Check that it implements this interface
    // - Only expose subset of props using proxy
  }
  providedBy = _providedBy;
}

export class AdapterInterface implements Interface {
  readonly interfaceId: string;
  constructor(context: object, registry?: TAdapterRegistry) {
    const r = registry ?? globalRegistry;
    return r.getAdapter(context);
  }
}

export class UtilityInterface implements Interface {
  readonly interfaceId: string;
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

/*
class IUser extends ObjectInterface {
  interfaceId = 
}
const IUserAdapter = new AdapterInterface(NAMESPACE, 'IUserAdapter');

type TUserAdapter = {
  adapts: ObjectPrototype<any> | Interface;
  registry?: TAdapterRegistry;
  Component(): Function;
}
class UserAdapter extends Adapter {
  __implements__ = IUserAdapter;
  Component: () => Function;
  constructor({ adapts, registry = undefined, Component}: TUserAdapter) {
    super({ adapts, registry, Component});
  }
}

new UserAdapter({
  adapts: IUser,
  Component() {
    return this.context.name
  },
})
*/