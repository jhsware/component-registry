import { AdapterRegistry, TAdapterRegistry } from './adapterRegistry'
import { TUtilityRegistry, UtilityRegistry } from './utilityRegistry'
import { isTest } from './common';
import { isUndefined } from './utils';

export type TRegistry = TUtilityRegistry & TAdapterRegistry;

export class Registry implements TRegistry {
    utilities;
    adapters;
    registerAdapter;
    registerUtility;
    getAdapter;
    getUtility;
    getUtilities;

    constructor() {
        /*

            Creates both utility and adapter registry, both mounted on global.registry
            You can access these like this:

            global.registry.registerAdapter()
            global.registry.registerUtility()
            ...

        */

        if (isUndefined(global.registry)) {
            isTest || console.log('[component-registry] Utility Registry');
            global.registry = new UtilityRegistry();

            isTest || console.log('[component-registry] Adapter Registry');
            const tmp = new AdapterRegistry();

            Object.keys(tmp).forEach(function (key) {
                if (tmp.hasOwnProperty(key)) {
                    global.registry[key] = tmp[key];
                }
            })

            global.registry['registerAdapter'] = tmp.registerAdapter;
            global.registry['getAdapter'] = tmp.getAdapter;
        }

        return global.registry as TRegistry;
    }
}

export const globalRegistry = new Registry()