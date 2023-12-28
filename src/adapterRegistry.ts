import { Adapter } from './adapterFactory';
import { isDevelopment, TDecorator } from './common'
import { AdapterInterface, MarkerInterface, ObjectInterface } from './interfaceFactory';
import { ObjectPrototype } from './objectFactory';

import {
  getInterfaceId,
  isUndefined,
  notNullOrUndef,
} from './utils'

/*

    Exceptions

*/

function AdapterRegistryException(message, context) {
  this.message = message;
  this.name = "AdapterRegistryException";
  this.context = context;
  this.stack = (new Error()).stack;
}

/*

    Adapter Registry Code

*/

type TAdapterEntry = {
  interfaceAdapters: Adapter<any>[],
  objectAdapters: Adapter<any>[]
}

export type TAdapterRegistry = {
  adapters: Record<string, TAdapterEntry>;
  registerAdapter(adapter: Adapter<any>): void;
  getAdapter(obj: ObjectPrototype<any> | typeof ObjectInterface | typeof MarkerInterface, implementsInterface: AdapterInterface | typeof AdapterInterface): Adapter<any>;
  register: TDecorator;
}

export class AdapterRegistry implements TAdapterRegistry {
  adapters;
  registerAdapter;
  getAdapter;
  register: TDecorator;

  constructor() {
    this.adapters = {};
    this.register = (target, context = undefined) => {
      this.registerAdapter(target);
      return target;
    }
  }
}

AdapterRegistry.prototype.registerAdapter = function (implementation, implementsInterfaceId) {
  /*
      Add an adapter to the registry
  
      adapts -- interface or object prototype that the adapter decorates
      implementsInterface -- the interface that the adapter implements
      adapter -- the prototype of the adapter to instantiate on get
  */
  const adapts = implementation.__adapts__;
  implementsInterfaceId ??= getInterfaceId(implementation.__implements__);

  // Register the adapter (interfaces are stored in a list)
  if (isUndefined(this.adapters[implementsInterfaceId])) {
    this.adapters[implementsInterfaceId] = {
      interfaceAdapters: [], // TODO: This could be a dictionary for massive performance boost
      objectAdapters: [] // TODO: This could be a dictionary for massive performance boost
    }
  }

  const adapters = this.adapters[implementsInterfaceId];

  if (getInterfaceId(adapts)) {
    // This should be registered as an interface
    adapters.interfaceAdapters.push({
      adapts: adapts,
      adapter: implementation
    });
  } else {
    // This should be registered as an object adaptor
    adapters.objectAdapters.push({
      adapts: adapts,
      adapter: implementation
    });

  }
}

// TODO: implement hasAdapter (returns true or false), look at getAdapter

AdapterRegistry.prototype.getAdapter = function (context: ObjectPrototype<any>, implementsInterface) {
  /*
      Return an instance of an adapter for the provided object which implements
      the provided interface.
  
      Optionally add a specific param adaptsInterface in case there are several 
      adapters that implement the interface and match the object.
  */
  const implementsInterfaceId = getInterfaceId(implementsInterface);
  const adapters = this.adapters[implementsInterfaceId];

  // if we didn't find an adapter for this we throw an error
  if (isUndefined(adapters)) {
    // Return undefined if nothing found
    return;
  }

  // Ok so we found adapters that implement this interface, let's see if they
  // adapt the provided object.
  const obj = context as ObjectPrototype<any>;
  if (adapters) {
    // First check if an object adapter matches
    for (const { adapter, adapts } of adapters.objectAdapters) {
      if (obj instanceof adapts) {
        // Clone adapter and return with context set
        // TODO: Is there a better way of returning the instance?
        return createAdapterInstance(adapter, context);
      }

    }
    // Then check if an interface adapter matches, iterate over each interface implemented by the
    // passed object to find the first match.

    // INTEGRITY CHECK: Throw a useful error if the passed object doesn't have __implements__
    if (isUndefined(getInterfaceId(obj)) && isUndefined(obj.__implements__?.[0])) {
      const errorContext = (isDevelopment ? {
        obj: obj,
        registry: this
      } : undefined)
      throw new AdapterRegistryException(
        "Object missing __implements__ property, nothing to look up",
        errorContext
      )
    };

    // TODO: Should investigate inheritance and overriding here, the use case is that you want to override
    // adapters registered on a general interface in a component with that registered in an application. I
    // need to think about how this works and write the docs first, then tests and then implement it so it
    // is easy to understand and reason about.

    // Now support finding adapter by interface

    const tmpImplements = notNullOrUndef(obj.__implements__) ? obj.__implements__ : [obj];
    for (const objImplements of tmpImplements) {
      for (const interfaceAdapter of adapters.interfaceAdapters) {
        if (getInterfaceId(objImplements) === getInterfaceId(interfaceAdapter.adapts)) {
          // Clone adapter and return with context set
          // TODO: Is there a better way of returning the instance?
          const { adapter } = interfaceAdapter;

          return createAdapterInstance(adapter, context);
        }

      }
    }
  };

  // Return undefined if nothing found
  return;
}

function createAdapterInstance(Adapter, context) {
  // TODO: Perhaps cloning the adapter is a problem. Look att diffing algo and see if we should:
  // - set key to prove identity
  // - not clone and skip setting context
  // UPDATE: I don't think we can clone this, we should skip context and just return a stateless adapter
  // When a form is updated, the element gets swapped out, thus loosing focus on the field

  // Function or Class Component (for Inferno/React/etc.)
  if (notNullOrUndef(Adapter.__Component__)) {
    return Adapter.__Component__;
  }

  // Regular Adapter
  return new Adapter(context);
}