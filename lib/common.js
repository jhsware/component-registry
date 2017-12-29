'use strict';

var extendPrototypeWithThese = function (prototype, extendThese) {
    /*
        Helper method to implement a simple inheritance model for object prototypes.
    */
    
    var outp = prototype;
    
    if (extendThese) {
    
        // Applying inherited methods right to left so first (most left) overrides last (most right) in list
        extendThese.map(function (tmp){
            var tmpObj = tmp.prototype;
            var _iname = "_" + tmpObj._iname;
            for (var key in tmpObj) {
                if (key == '_implements') {
                    // Implements should be extended with later coming before earlier
                    // TODO: Filer so we remove duplicates from existing list (order makes difference)
                    outp.prototype._implements = tmpObj._implements.concat(outp.prototype._implements); 
                } else {
                    // All others added and lower indexes override higher
                    if (!outp.prototype[_iname]) {
                        outp.prototype[_iname] = {};
                    };
                    
                    if (key == '_constructor') {
                        var extendsKey = 'constructor';
                        outp.prototype[_iname][extendsKey] = tmpObj[key];
                        // Add the constructor so that if we don't implement one when extending, the inherited left
                        // most constructor is used
                        outp.prototype['_constructor'] = tmpObj[key];
                    } else {
                        var extendsKey = key;
                        outp.prototype[_iname][extendsKey] = tmpObj[key];
                    }
                    
                    /*
                    outp.prototype._extends[_iname][key] = function () {
                        tmpObj._constructor.call(this, tmpObj._super, arguments);
                    }
                    */
                    outp.prototype[key] = outp.prototype[_iname][extendsKey];
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