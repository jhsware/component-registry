'use strict';

var extendPrototypeWithThese = function (prototype, extendThese) {
    /*
        Helper method to implement a simple inheritance model for object prototypes.
    */
    
    var outp = prototype;
    
    if (extendThese) {
    
        // Applying inherited methods right to left so first overrides last in list
        for (var i = extendThese.length - 1; i >= 0; i--) {
            var tmpObj = extendThese[i].prototype;
            for (var key in tmpObj) {
                if (key == '_implements') {
                    // Implements should be extended with later coming before earlier
                    // TODO: Filer so we remove duplicates from existing list (order makes difference)
                    outp.prototype._implements = tmpObj._implements.concat(outp.prototype._implements); 
                } else {
                    // All others added and lower indexes override higher
                   outp.prototype[key] = tmpObj[key]; 
                }
            }
        }
        
    }
    
    return outp;
}
module.exports.extendPrototypeWithThese = extendPrototypeWithThese;

var addMembers = function (outp, params) {
    /*
        Helper method to add each item in params dictionary to the prototype of outp.
    */
    
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            if (typeof outp.prototype[key] === 'function') {
                // Store inherited functions that are overridden in the _super property
                if (!outp.prototype._super) {
                    outp.prototype._super = {};
                }
                outp.prototype._super[key] = outp.prototype[key];
            }
            outp.prototype[key] = params[key];
        }
    }
    
    return outp;
}
module.exports.addMembers = addMembers;