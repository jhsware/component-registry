'use strict';

var extendPrototypeWithThese = function (prototype, extendThese) {
    /*
        Helper method to implement a simple inheritance model for object prototypes.
    */
    
    var outp = prototype;
    
    if (extendThese) {
    
        // Applying inherited methods right to left so first overrides last in list
        extendThese.map(function (tmp){
            var tmpObj = tmp.prototype;
            for (var key in tmpObj) {
                if (key == '_implements') {
                    // Implements should be extended with later coming before earlier
                    // TODO: Filer so we remove duplicates from existing list (order makes difference)
                    outp.prototype._implements = tmpObj._implements.concat(outp.prototype._implements); 
                } else {
                    // All others added and lower indexes override higher
                    if (!outp.prototype._super) {
                        outp.prototype._super = {}
                    };
                    if (key == "_constructor") {
                        outp.prototype._super[key] = function (data) {
                            tmpObj._constructor.call(this, data, tmpObj._super);
                        }
                    } else if (key == "_super") {
                        outp.prototype._super[key] = tmpObj[key];
                    } else {
                        outp.prototype._super[key] = tmpObj[key];
                        outp.prototype[key] = tmpObj[key];
                    }
                }
            }
        });
        
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
            outp.prototype[key] = params[key];
        }
    }
    
    return outp;
}
module.exports.addMembers = addMembers;