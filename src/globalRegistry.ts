import { AdapterRegistry } from './adapterRegistry'
import { UtilityRegistry } from './utilityRegistry'
import { isTest } from './common';

export class Registry {
    registerAdapter;
    registerUtility;

    constructor() {
        /*

            Creates both utility and adapter registry, both mounted on global.registry
            You can access these like this:

            global.registry.registerAdapter()
            global.registry.registerUtility()
            ...

        */

        if (typeof global.registry === 'undefined') {
            isTest || console.log('[component-registry] Creating component utility registry');
            global.registry = new UtilityRegistry();

            isTest || console.log('[component-registry] Creating component adapter registry');
            const tmp = new AdapterRegistry();

            Object.keys(tmp).forEach(function (key) {
                if (tmp.hasOwnProperty(key)) {
                    global.registry[key] = tmp[key];
                }
            })

            global.registry['registerAdapter'] = tmp.registerAdapter;
            global.registry['getAdapter'] = tmp.getAdapter;
        }

        return global.registry;
    }
}

export const globalRegistry = new Registry()