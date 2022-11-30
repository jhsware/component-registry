
// Import of uuid didn't work and I couldn't figure out how to get the settings right
import { v5 as uuid } from 'uuid'
import { globalRegistry, TRegistry } from './globalRegistry'
import {
  hasPropRegistry,
  hasPropImplements,
  hasArrayPropImplements,
  isString,
  isWildcard
} from './utils'
import {
  isDevelopment,
} from './common'
import { TObjectPrototype } from './objectFactory';
import { TAdapterRegistry } from './adapterRegistry';
import { TUtilityRegistry } from './utilityRegistry';
const NAMESPACE = 'bc901568-0169-42a8-aac8-52fa2ffd0670';

function _providedBy(obj) {
  // Does the specified object implement this interface
  if (hasArrayPropImplements(obj)) {
    // Object has a list of interfaces it implements
    for (let i = 0, imax = obj._implements.length; i < imax; i++) {
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

function _getRegistry(context, opts): TAnyRegistry {
  if (hasPropRegistry(opts)) return opts.registry;
  else if (hasPropRegistry(context)) return (context as { registry: TAnyRegistry }).registry
  return globalRegistry
}

function _lookup(_this, intrfc, registry) {
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

function _NOOP() { }

export type TInterface = {
  name: string;
  interfaceId: string;
  schema?: any;
  providedBy(obj: TObjectPrototype): boolean;
  addProperties?(obj: TObjectPrototype): void;
}

type TAnyRegistry = TRegistry | TAdapterRegistry | TUtilityRegistry;
type TInterfaceType = undefined | 'adapter' | 'utility';
type TInterfaceConstructor = { name: string, type?: TInterfaceType, schema?: any };
// Any type of registry
export function createInterfaceClass(namespace: string) {
  class Interface implements TInterface {

    name: string;
    interfaceId: string;
    schema?: any;
    providedBy(obj: TObjectPrototype): boolean { return false };
    addProperties(): void { };

    constructor({ name, type = undefined, schema = undefined }: TInterfaceConstructor) {
      switch (type) {
        case "adapter":
          return createAdapterInterface({ namespace, name, schema }) as any;
        case "utility":
          return createUtilityInterface({ namespace, name, schema }) as any;
        default:
          return createInterface({ namespace, name, schema }) as any;
      }
    }
  }
  return Interface as { new(props: { name: string, type?: TInterfaceType, schema?: any }): Interface };
}

// Object and marker interface for object prototypes
function createInterface({ namespace, name, schema }: TInterfaceConstructor & { namespace: string }) {
  class Interface implements TInterface {
    name: string;
    interfaceId: string;
    schema?: any;

    providedBy = _providedBy;
    addProperties(obj: TObjectPrototype) {
      typeof this.schema?.addProperties === 'function' ? this.schema.addProperties(obj) : _NOOP
    };
  }

  Object.defineProperties(AdapterInterface, {
    name: {value: name, configurable: false, writable: false},
    interfaceId: {value: uuid(`${namespace}.${name}`, NAMESPACE), configurable: false, writable: false},
  });
  if (schema) {
    Object.defineProperty(AdapterInterface, 'schema', {value: schema, configurable: false, writable: false})
  }

  return Interface
}

// Adpater class interface for registry
export type TAdapterInterface = TInterface & {
  new(
    context: TObjectPrototype | { adapts: TObjectPrototype, registry?: TAnyRegistry } | { implements: TInterface, registry?: TAnyRegistry },
    opts?: { registry: TAnyRegistry }
  ): AdapterInterface
};
export abstract class AdapterInterface implements TInterface {
  name: string;
  interfaceId: string;
  schema?: any;
  providedBy(obj: TObjectPrototype): boolean { return };
    
  constructor(
    context: any,
    opts?: any) { }
}

function createAdapterInterface({ namespace, name, schema }: TInterfaceConstructor & { namespace: string }) {
  class AdapterInterface implements TInterface {
    name: string;
    interfaceId: string;
    schema?: any;
    providedBy = _providedBy;

    constructor(
      context: TObjectPrototype | { adapts: TObjectPrototype, implements?: TInterface, registry?: TAnyRegistry },
      opts?: { registry: TAnyRegistry }) {

      let registry = _getRegistry(context, opts);
      const adapt = (context as any).adapts || context
      return _lookup(this, adapt, registry);
    }
  }

  Object.defineProperties(AdapterInterface, {
    name: {value: name, configurable: false, writable: false},
    interfaceId: {value: uuid(`${namespace}.${name}`, NAMESPACE), configurable: false, writable: false},
    schema: {value: schema, configurable: false, writable: false},
  });
  return AdapterInterface;
}

// Utility class interface for registry
export type TUtilityInterface = TInterface & {
  new(
    context: TInterface | { implements: TInterface, name?: string, registry?: TAnyRegistry },
    opts?: { registry: TAnyRegistry }
  ): AdapterInterface};
export abstract class UtilityInterface implements TInterface {
  name: string;
  interfaceId: string;
  schema?: any;
  providedBy(obj: TObjectPrototype): boolean { return };

  constructor(
    context: any,
    opts?: any) { }
}

function createUtilityInterface({ namespace, name, schema }: TInterfaceConstructor & { namespace: string }) {
  class UtilityInterface implements TInterface {
    name: string;
    interfaceId: string;
    schema?: any;
    providedBy = _providedBy;

    constructor(
      context: TInterface | { implements: TInterface, name?: string, registry?: TAnyRegistry },
      opts?: { registry: TAnyRegistry }) {

      let registry = _getRegistry(context, opts);
      return _lookup(this, name, registry);
    }
  }

  Object.defineProperties(UtilityInterface, {
    name: {value: name, configurable: false, writable: false},
    interfaceId: {value: uuid(`${namespace}.${name}`, NAMESPACE), configurable: false, writable: false},
    schema: {value: schema, configurable: false, writable: false},
  });

  return UtilityInterface;
}