import { AdapterRegistry } from './adapterRegistry'
import { TRegistry } from './globalRegistry';
import { UtilityRegistry } from './utilityRegistry'

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