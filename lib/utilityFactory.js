'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { assert, extendPrototypeWithThese, addMembers, checkMembers } from './common';
import { globalRegistry } from './index';

export var Utility = function Utility(params, compat) {
    _classCallCheck(this, Utility);

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
    if (common.isDevelopment) {
        assert(typeof params.implements === 'function' && params.implements.interfaceId, '[componeont-registry] When creating a Utility, param implements must be an interface!');
    }
    var extendThese = params.extends,
        implementsInterface = params.implements,
        name = params.name,
        registry = params.registry;

    if (params.extends) delete params.extends;
    if (params.implements) delete params.implements;
    if (params.name) delete params.name;
    if (params.registry) delete params.registry;

    var _Utility = function Utility() {};

    // If extends other do first so they get overridden by those passed as params
    // Inehrited prototypes with lower index have precedence
    extendPrototypeWithThese(_Utility, extendThese);

    // The rest of the params are added as methods, overriding previous
    addMembers(_Utility, params);

    // Check that we have added all the members that where defined as members
    checkMembers(_Utility, [implementsInterface]);

    // Add the interfaces so they can be checked
    _Utility.prototype._implements = implementsInterface;
    _Utility.prototype._name = name;

    // Set a more debug friendly name for Utility (by convention we strip leading "I" if it
    // exists)
    if (name) {
        var tmpName = name.startsWith('I') ? name.slice(1) : name;
        Object.defineProperty(_Utility, 'name', { value: tmpName, configurable: false, writable: false });
    }

    if (compat) return _Utility;

    // Automatically register utility, either with provided registry or with
    // the global registry
    if (registry) {
        registry.registerUtility(_Utility);
    } else {
        globalRegistry.registerUtility(_Utility);
    }

    return _Utility;
};
//# sourceMappingURL=utilityFactory.js.map