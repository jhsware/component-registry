'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import AdapterRegistry from './adapterRegistry';
import UtilityRegistry from './utilityRegistry';

var Registry = function Registry() {
    _classCallCheck(this, Registry);

    /*
         Creates both utility and adapter registry, both mounted on global.registry
        You can access these like this:
         global.registry.registerAdapter()
        global.registry.registerUtility()
        ...
     */

    if (typeof global.registry === 'undefined') {
        console.log('[component-registry] Creating component utility registry');
        global.registry = new UtilityRegistry();

        console.log('[component-registry] Creating component adapter registry');
        var tmp = new AdapterRegistry();

        Object.keys(tmp).forEach(function (key) {
            if (tmp.hasOwnProperty(key)) {
                global.registry[key] = tmp[key];
            }
        });

        global.registry['registerAdapter'] = tmp.registerAdapter;
        global.registry['getAdapter'] = tmp.getAdapter;
    }

    return global.registry;
};

export default Registry;
//# sourceMappingURL=globalRegistry.js.map