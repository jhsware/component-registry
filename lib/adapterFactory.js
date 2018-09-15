'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { assert } from './common';
import { globalRegistry } from './index';

export var Adapter = function Adapter(params, compat) {
    _classCallCheck(this, Adapter);

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
    if (common.isDevelopment) {
        assert(typeof params.implements === 'function' && params.implements.interfaceId, '[componeont-registry] When creating an Adapter, param implements must be an interface!');
        assert(typeof params.implements === 'function' && params.implements.interfaceId || _typeof(params.implements) === 'object' && params.implements._implements, '[componeont-registry] When creating an Adapter, param adapts must be an interface or an ObjectPrototype!');
    }

    var extendThese = params.extends,
        implementsInterface = params.implements,
        adapts = params.adapts,
        registry = params.registry;

    if (params.extends) delete params.extends;
    if (params.implements) delete params.implements;
    if (params.adapts) delete params.adapts;
    if (params.registry) delete params.registry;

    var _Adapter = function Adapter(obj) {
        this.context = obj;
    };

    _Adapter.prototype._implements = [];

    // If extends other do first so they get overridden by those passed as params
    // Inehrited prototypes with lower index have precedence
    common.extendPrototypeWithThese(_Adapter, extendThese);

    // The rest of the params are added as methods, overriding previous
    common.addMembers(_Adapter, params);

    // Check that we have added all the members that where defined as members
    common.checkMembers(_Adapter, [implementsInterface]);

    // Add the interfaces so they can be checked
    // TODO: Filer so we remove duplicates from existing list (order makes difference)
    _Adapter.prototype._implements = [implementsInterface].concat(_Adapter.prototype._implements);
    _Adapter.prototype._adapts = adapts;

    // Set a more debug friendly name for Utility (by convention we strip leading "I" if it
    // exists)
    if (implementsInterface[0]) {
        var name = implementsInterface[0]._name;
        var tmpName = name.startsWith('I') ? name.slice(1) : name;
        Object.defineProperty(_Adapter, 'name', { value: tmpName, configurable: true });
    }

    if (compat) return _Adapter;

    // Automatically register adapter, either with provided registry or with
    // the global registry
    if (registry) {
        registry.registerAdapter(_Adapter);
    } else {
        globalRegistry.registerAdapter(_Adapter);
    }

    return _Adapter;
};
//# sourceMappingURL=adapterFactory.js.map