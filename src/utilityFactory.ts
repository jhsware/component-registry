
import { 
    assert,
    extendPrototypeWithThese,
    addMembers,
    checkMembers,
    isDevelopment
} from './common'
import { globalRegistry } from './globalRegistry'

export class Utility {
    constructor (params) {
        /*
            extends -- (optional) list of object prototypes to inherit from
            implements -- interface this prototype implements (besides those that are inherited)
            name -- (optional) name of utility variant

            create({
                extends: [],
                implements: IRenderListItem,
                name: 'normal'
            })
        */
        if (isDevelopment) {
            assert(typeof params.implements === 'function' && params.implements.interfaceId, '[componeont-registry] When creating a Utility, param implements must be an interface!')
        }
        const extendThese = params.extends,
            implementsInterface = params.implements,
            name = params.name,
            registry = params.registry;
            
        if (params.extends) delete params.extends;
        if (params.implements) delete params.implements
        if (params.name) delete params.name
        if (params.registry) delete params.registry
        
        const Utility = function Utility () {};
        
        // If extends other do first so they get overridden by those passed as params
        // Inehrited prototypes with lower index have precedence
        extendPrototypeWithThese(Utility, extendThese)
            
        // The rest of the params are added as methods, overriding previous
        addMembers(Utility, params);

        // Check that we have added all the members that where defined as members
        checkMembers(Utility, [implementsInterface])
        
        // Add the interfaces so they can be checked
        Utility.prototype._implements = implementsInterface;
        Utility.prototype._name = name;

        // Set a more debug friendly name for Utility (by convention we strip leading "I" if it
        // exists)
        if (name) {
            const tmpName = name.startsWith('I') ? name.slice(1) : name
            Object.defineProperty(Utility, 'name', {value: tmpName, configurable: false, writable: false})
        }

        // Automatically register utility, either with provided registry or with
        // the global registry
        if (registry) {
            registry.registerUtility(Utility)
        } else {
            globalRegistry.registerUtility(Utility)
        }
            
        return Utility;
    }
}
