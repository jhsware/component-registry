'use strict';

var extendPrototypeWithThese = function (prototype, extendThese) {
    var outp = prototype;
    
    if (extendThese) {
    
        for (var i = extendThese.length - 1; i >= 0; i--) {
            // I need to create the object in order to copy the prototype functions
            var tmpObj = new extendThese[i]();
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
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            outp.prototype[key] = params[key];
        }
    }
    
    return outp;
}
module.exports.addMembers = addMembers;