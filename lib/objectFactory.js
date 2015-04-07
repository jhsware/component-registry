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
        implementsInterfaces = params.implements || [],
        constructor = params.constructor;
        
    if (params.extends) {
        delete params.extends;
    };
    
    // The object prototype gets the iname of the first implement
    // interface. It is used when functions are inherited using
    // extends
    if (params.implements && params.implements.length > 0) {
        params._iname = params.implements[0].name;
    };
    
    if (params.implements) {
        delete params.implements
    };
    
    if (params.constructor) {
        // Rename the constructor param so it can be added with the
        // other params
        params._constructor = params.constructor;
        delete params.constructor;
    };
    
    var outp = function (data) {
        // Run the constructor
        this._constructor && this._constructor(data);
        
        // Then add passed params/data
        for (var key in data) {
            this[key] = data[key];
        };
    };        
        
    outp.prototype._implements = []
    
    // If extends other do first so they get overridden by those passed as params
    // Inehrited prototypes with lower index have precedence
    common.extendPrototypeWithThese(outp, extendThese);
        
    // The rest of the params are added as methods, overriding previous
    common.addMembers(outp, params);
    
    // Add the interfaces so they can be checked
    // TODO: Filer so we remove duplicates from existing list (order makes difference)
    outp.prototype._implements = implementsInterfaces.concat(outp.prototype._implements);
        
    return outp;
}

module.exports.create = create;