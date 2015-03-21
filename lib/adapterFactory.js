'use strict';
var common = require('./common');

var create = function (params) {
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
    
    var extendThese = params.extends,
        implementsInterface = params.implements,
        adapts = params.adapts;
        
    if (params.extends) {
        delete params.extends;
    }
    
    if (params.implements) {
        delete params.implements
    }
    
    if (params.adapts) {
        delete params.adapts
    }
    
    var outp = function (obj) {
        this.context = obj
    };
    
    outp.prototype._implements = []
    
    // If extends other do first so they get overridden by those passed as params
    // Inehrited prototypes with lower index have precedence
    common.extendPrototypeWithThese(outp, extendThese)
        
    // The rest of the params are added as methods, overriding previous
    common.addMembers(outp, params);
    
    // Add the interfaces so they can be checked
    // TODO: Filer so we remove duplicates from existing list (order makes difference)
    outp.prototype._implements = [implementsInterface].concat(outp.prototype._implements);
    outp.prototype._adapts = adapts;
        
    return outp;
}

module.exports.create = create;