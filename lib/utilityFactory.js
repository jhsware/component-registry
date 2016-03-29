'use strict';
var common = require('./common');

var create = function (params) {
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
    
    var extendThese = params.extends,
        implementsInterface = params.implements,
        name = params.name;
        
    if (params.extends) {
        delete params.extends;
    }
    
    if (params.implements) {
        delete params.implements
    }
    
    if (params.name) {
        delete params.name
    }
    
    var Utility = function () {};
    
    // If extends other do first so they get overridden by those passed as params
    // Inehrited prototypes with lower index have precedence
    common.extendPrototypeWithThese(Utility, extendThese)
        
    // The rest of the params are added as methods, overriding previous
    common.addMembers(Utility, params);
    
    // Add the interfaces so they can be checked
    Utility.prototype._implements = implementsInterface;
    Utility.prototype._name = name;
    
        
    return Utility;
}

module.exports.create = create;