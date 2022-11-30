import { AdapterRegistry } from './adapterRegistry'
import { TRegistry } from './globalRegistry';
import { UtilityRegistry } from './utilityRegistry'

export class LocalRegistry implements TRegistry {
    utilities;
    adapters;
    registerAdapter;
    registerUtility;
    getAdapter;
    getUtility;
    getUtilities;

    constructor () {
        /*

            Creates both utility and adapter registry, both mounted on global.registry
            You can access these like this:

            global.registry.registerAdapter()
            global.registry.registerUtility()
            ...

        */
        const registry = new UtilityRegistry();

        let tmp = new AdapterRegistry();    
        Object.keys(tmp).forEach(function (key) {
            if (tmp.hasOwnProperty(key)) {
                registry[key] = tmp[key];
            }
        })

        registry['registerAdapter'] = tmp.registerAdapter;
        registry['getAdapter'] = tmp.getAdapter;

        return registry as TRegistry;
    }
}