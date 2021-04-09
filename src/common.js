
export const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';

export function assert(isValid, msg) {
    if (!isValid) throw new Error(msg)
}

export function extendPrototypeWithThese(prototype, extendThese) {
    /*
        Helper method to implement a simple inheritance model for object prototypes.
    */
    
    var outp = prototype;
    
    if (extendThese) {
    
        // Applying inherited methods right to left so first (most left) overrides last (most right) in list
        for (const item of extendThese) {
            var tmpObj = item.prototype;
            var _iname = "_" + tmpObj._iname;
            for (var key in tmpObj) {
                if (key === '_implements') {
                    // Implements should be extended with later coming before earlier
                    // TODO: Filter so we remove duplicates from existing list (order makes difference)
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
                    // TODO: Investigate why this is here
                    outp.prototype._extends[_iname][key] = function () {
                        tmpObj._constructor.call(this, tmpObj._super, arguments);
                    }
                    */
                    outp.prototype[key] = outp.prototype[_iname][extendsKey];
                }
            }
        };
        
    }
    
    return outp;
}

export function addMembers(outp, params) {
    /*
        Helper method to add each item in params dictionary to the prototype of outp.
    */
    // Not using for..in because it returns inherited properties and I am
    // exchanging a hasOwnProperties check for Object.keys
    for (const key of Object.keys(params)) {
        outp.prototype[key] = params[key];
    }
    
    return outp;
}

export function checkMembers(ObjectPrototype, intrfcs) {
    for (var i = 0; i < intrfcs.length; i++) {
        var intrfc = intrfcs[i]
        for (const key in intrfc.prototype) {
          if (key === 'providedBy') return
          
          var memberTypeDesc = intrfc.prototype[key];
          assert(ObjectPrototype.prototype[key] !== undefined, 'ObjectPrototype "' + ObjectPrototype.name + '" is missing member "' + key + ': ' + memberTypeDesc + '" specified in "' + intrfc.name + '"')
        }
    }
}
