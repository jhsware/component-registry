
import {
    assert,
    extendPrototypeWithThese,
    addMembers,
    checkMembers,
    isDevelopment } from './common'
import { globalRegistry } from './globalRegistry'

export class Adapter {
    constructor (params, compat) {
        /*
            extends -- (optional) list of object prototypes to inherit from
            implements -- interface this prototype implements (besides those that are inherited)
            adapts -- interface OR object prototype that this adapter can work with

            create({
                extends: [],
                implements: [IRenderListItem],
                adapts: IListableItem
            })
        */
       if (isDevelopment) {
            assert(typeof params.implements === 'function' && params.implements.interfaceId, '[componeont-registry] When creating an Adapter, param implements must be an interface!')
            assert((typeof params.implements === 'function' && params.implements.interfaceId)
                || (typeof params.implements === 'object' && params.implements._implements), '[componeont-registry] When creating an Adapter, param adapts must be an interface or an ObjectPrototype!')
       }
        
        var extendThese = params.extends,
            implementsInterface = params.implements,
            adapts = params.adapts,
            registry = params.registry;
            
        if (params.extends) delete params.extends;
        if (params.implements) delete params.implements
        if (params.adapts) delete params.adapts
        if (params.registry) delete params.registry
        
        var Adapter = function Adapter (obj) {
            this.context = obj
        };
        
        Adapter.prototype._implements = []
        
        // If extends other do first so they get overridden by those passed as params
        // Inehrited prototypes with lower index have precedence
        extendPrototypeWithThese(Adapter, extendThese)
            
        // The rest of the params are added as methods, overriding previous
        addMembers(Adapter, params);

        // Check that we have added all the members that where defined as members
        checkMembers(Adapter, [implementsInterface])
        
        // Add the interfaces so they can be checked
        // TODO: Filer so we remove duplicates from existing list (order makes difference)
        Adapter.prototype._implements = [implementsInterface].concat(Adapter.prototype._implements);
        Adapter.prototype._adapts = adapts;

        // Set a more debug friendly name for Utility (by convention we strip leading "I" if it
        // exists)
        if (implementsInterface[0]) {
            var name = implementsInterface[0]._name
            var tmpName = name.startsWith('I') ? name.slice(1) : name
            Object.defineProperty(Adapter, 'name', {value: tmpName, configurable: true})
        }
        
        if (compat) return Adapter

        // Automatically register adapter, either with provided registry or with
        // the global registry
        if (registry) {
            registry.registerAdapter(Adapter)
        } else {
            globalRegistry.registerAdapter(Adapter)
        }
        
        return Adapter;
    }
}
