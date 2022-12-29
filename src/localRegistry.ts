import { AdapterRegistry, TAdapterRegistry } from './adapterRegistry'
import { TUtilityRegistry, UtilityRegistry } from './utilityRegistry'

export type TRegistry = TUtilityRegistry & TAdapterRegistry;

export class LocalRegistry extends UtilityRegistry implements TRegistry {
    utilities;
    adapters;
    registerAdapter;
    registerUtility;
    getAdapter;
    getUtility;
    getUtilities;

    constructor () {
        super();

        // Add adapter registry features
        const adapterRegistry = new AdapterRegistry();
        this.adapters = adapterRegistry.adapters;
        this.registerAdapter = adapterRegistry.registerAdapter;
        this.getAdapter = adapterRegistry.getAdapter;
    }
}