'use strict';

var common = require('./common');

var create = function (params) {
    /*
        extends -- (optional) list of object prototypes to inherit from
        implements -- (optional) list of interfaces this prototype implements (besides those that are inherited)
    
        create({
            extends: [SuperObjectPrototype_1, SuperObjectPrototype_2],
            implements: [IMyObjectInterface, IListableItem]
        })
    */
    
    var extendThese = params.extends,
        implementsInterfaces = params.implements || [];
        
    if (params.extends) {
        delete params.extends;
    }
    
    if (params.implements) {
        delete params.implements
    }
    
    var outp = function () {};
    
    outp.prototype._implements = []
    
    // If extends other do first so they get overridden by those passed as params
    // Inehrited prototypes with lower index have precedence
    common.extendPrototypeWithThese(outp, extendThese)
        
    // The rest of the params are added as methods, overriding previous
    common.addMembers(outp, params);
    
    // Add the interfaces so they can be checked
    // TODO: Filer so we remove duplicates from existing list (order makes difference)
    outp.prototype._implements = implementsInterfaces.concat(outp.prototype._implements);
        
    return outp;
}

module.exports.create = create;