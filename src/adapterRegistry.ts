
import { TAdapter } from './adapterFactory';
import { isDevelopment } from './common'
import { TInterface } from './interfaceFactory';
import { TObjectPrototype } from './objectFactory';

import {
  hasPropRegistry,
  notNullOrUndef,
  hasPropImplements,
  hasArrayPropImplements,
  isString,
  isWildcard
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
    implementsInterface: TInterface,
    interfaceAdapters: TAdapter[],
    objectAdapters: TAdapter[]
}

export type TAdapterRegistry = {
    adapters: Record<string, TAdapterEntry>;
    registerAdapter(adapter: TAdapter): void;
    getAdapter(obj: TObjectPrototype, implementsInterface: TInterface, adaptsInterface: TInterface): TAdapter;
}

export class AdapterRegistry implements TAdapterRegistry {
    adapters;
    registerAdapter;
    getAdapter;

    constructor() {
        this.adapters = {};
    }
} 

AdapterRegistry.prototype.registerAdapter = function (adapter) {
    /*
        Add an adapter to the registry
    
        adapts -- interface or object prototype that the adapter decorates
        implementsInterface -- the interface that the adapter implements
        adapter -- the prototype of the adapter to instantiate on get
    */
    const adapts = adapter.prototype._adapts, 
        implementsInterfaces = adapter.prototype._implements;
        
    // TODO: Check that the adapter implements the interface
    // TODO: else throw InterfaceNotImplementedError
    
    
    // INTEGRITY CHECK: Have we specified what the adapter implements?
    if (!implementsInterfaces || !implementsInterfaces[0].interfaceId) {
        throw new AdapterRegistryException(
            "Registration error: You haven't specified interface that this adapter implements", 
            {
                adapter: adapter
            }
        )
    }
    
    // Register the adapter (interfaces are stored in a list)
    const tmpInterfaceId = implementsInterfaces[0].interfaceId;
    if (typeof this.adapters[tmpInterfaceId] === 'undefined') {
        this.adapters[tmpInterfaceId] = {
            implementsInterface: implementsInterfaces[0],
            interfaceAdapters: [],
            objectAdapters: []
        }
    }
    
    // INTEGRITY CHECK: Have we specified what the adapter has specified what it adapts?
    if (!adapts) {
        throw new AdapterRegistryException(
            "Registration error: You haven't specified interface or object that this adapter adapts", 
            {
                adapter: adapter
            }
        )
    }
    
    const adapters = this.adapters[tmpInterfaceId];
    
    if (adapts.interfaceId) {
        // This should be registered as an interface
        adapters.interfaceAdapters.push({
            adapts: adapts,
            adapter: adapter
        });
    } else {
        // This should be registered as an object adaptor
        adapters.objectAdapters.push({
            adapts: adapts,
            adapter: adapter
        });
        
    }    
}

// TODO: implement hasAdapter (returns true or false), look at getAdapter

AdapterRegistry.prototype.getAdapter = function (obj, implementsInterface, adaptsInterface) {
    /*
        Return an instance of an adapter for the provided object which implements
        the provided interface.
    
        Optionally add a specific param adaptsInterface in case there are several 
        adapters that implement the interface and match the object.
    */
    const adapters = this.adapters[implementsInterface.interfaceId];
    
    // if we didn't find an adapter for this we throw an error
    if (typeof adapters === 'undefined') {
        const message = "No registered adapter(s) found for: " + implementsInterface.name;
        throw new AdapterRegistryException(message, (isDevelopment ? obj : undefined));
    }
    
    // Ok so we found adapters that implement this interface, let's see if they
    // adapt the provided object.
    if (adapters) {
        // First check if an object adapter matches
        for (let i = 0, imax = adapters.objectAdapters.length; i < imax; i++) {
            const tmp = adapters.objectAdapters[i];
            // TODO: THIS IS A NOOP right now, there is no interfaceId-property on objects unless they are interfaces
            if (obj.interfaceId === tmp.adapts.interfaceId) {
                // Found the adapter, instantiate and return (adapter should set obj as context on creation)
                const Adapter = new tmp.adapter(obj);
                return Adapter;
            }
            
        } 
        // Then check if an interface adapter matches, iterate over each interface implemented by the
        // passed object to find the first match.

        // INTEGRITY CHECK: Throw a useful error if the passed object doesn't have _implements
        if (!(obj.interfaceId || (obj._implements && obj._implements.length > 0))) {
            const errorContext = (isDevelopment ? {
                context: obj, 
                implements: implementsInterface,
                registry: this
            } : undefined)
            throw new AdapterRegistryException(
                "Context (first param) doesn't have any _implements property, and thus no interfaces to use for look up", 
                errorContext
            )
        };
        
        // TODO: Should investigate inheritance and overriding here, the use case is that you want to override
        // adapters registered on a general interface in a component with that registered in an application. I
        // need to think about how this works and write the docs first, then tests and then implement it so it
        // is easy to understand and reason about.
        
        // Now support finding adapter by supplying an interface. Useful if no object exists yet such as
        // in a schema with ObjectField or for create views.
        const tmpImplements = notNullOrUndef(obj._implements) ? obj._implements : [obj];
        for (let j = 0, jmax = tmpImplements.length; j < jmax; j++) {
            const tmpInterface = tmpImplements[j];
            for (let i = 0, imax = adapters.interfaceAdapters.length; i < imax; i++) {
                const tmp = adapters.interfaceAdapters[i];
                if (tmpInterface.interfaceId === tmp.adapts.interfaceId) {
                    // If we got the adaptsInterface parameter we need to check that it matches otherwise
                    // keep on looking
                    if (notNullOrUndef(adaptsInterface) && adaptsInterface.interfaceId !== tmp.adapts.interfaceId) {
                        continue
                    }
                    // Found the adapter, instantiate and return (adapter should set obj as context on creation)
                    const Adapter = new tmp.adapter(obj);
                    return Adapter;
                }
                
            }
        }
    };
    
    // If we get this far, throws error if no adapter is found
    const message = ["No registered adapter implementing [" + implementsInterface.name + "] found that adapts: " + (obj._iname || obj)];

    if (isDevelopment) {
        message.push("Registered adapters adapt the follwing interfaces:")
        adapters.interfaceAdapters.forEach(function (adapter) {
            message.push("[" + adapter.adapts.name + "] " + adapter.adapts.interfaceId);
        });
        message.push("But we needed to adapt one of the following interfaces:")
        obj._implements.forEach(function (intrfc) {
            message.push("[" + intrfc.name + "] " + intrfc.interfaceId);
        })
        message.push("If the interface name matches but the ID of that interface doesn't, you might have imported a module containing the mismatched interface from two different places. They need to be exactly the same module to get the same ID. The ID is used for lookups.")
    }

    throw new AdapterRegistryException(message.join("\n"), (isDevelopment ? obj : undefined));
}
