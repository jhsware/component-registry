

import { 
    extendPrototypeWithThese,
    addMembers,
    checkMembers
} from './common'

import {
  notNullOrUndef,
  isFunc
} from './utils'

const _reservedProps = {
  _implements: true,
  _iname: true,
  _constructor: true
}

function _isSpecialOrReservedProp (key, data) {
  const prop = data[key]
  if (typeof prop === 'function') return true

  if (data._implements !== undefined) {
    if (_reservedProps[key]) return true
    if (typeof prop === 'object' && prop !== null && prop._implements !== undefined) return true
  }

  return false
}

function _toJSON () {
  var data = {};
  for (var key in this) {
      // Only own properties are used
      if (this.hasOwnProperty(key)) {
        var prop = this[key];
        if (prop && typeof prop.toJSON === 'function') {
            // Recursively prepare objects for stringify, skipping member objects that don't have a toJSON method
            data[key] = prop.toJSON();
        } else if (typeof prop !== 'function') {
            data[key] = prop;
        }
      }
  }
  return data;
}

function _init (_this, data) {
    // Add all schema props from implemented interfaces to allow composition
    for (var i = _this._implements.length - 1; i >= 0; i--) {
        _this._implements[i].addProperties(_this)
    }
    
    // Make a shallow copy of input data so we can remove root props in constructors
    // without messing up the oringial data
    
    var inData = {};
    for (var key in data) {
        // To allow cloning we need to skip reserved props, special props and functions
        if (!_isSpecialOrReservedProp(key, data) || (isFunc(data[key]) && data[key].interfaceId !== undefined)) {
          inData[key] = data[key];
        }
    }
    
    // Run the constructor
    if (isFunc(_this._constructor)) {
      _this._constructor(inData);
    }
    
    // Add the remaining data. The constructors might mutate this and we only
    // want to add what is left
    for (var key in inData) {
        _this[key] = inData[key];
    };
}

export function createObjectPrototype(params) {
    /*
        extends -- (optional) list of object prototypes to inherit from
        implements -- (optional) list of interfaces this prototype implements (besides those that are inherited)
    
        create({
            extends: [SuperObjectPrototype_1, SuperObjectPrototype_2],
            implements: [IMyObjectInterface, IListableItem]
        })
    */
    
    // TODO: obj.interfaceId is used in several places so we should probably have
    // an object specific interfaceId (although it isn't a good name), perhaps use the first interface
    // in implements list and add a prefix?
    
    const {
      extends: extendThese,
      implements: implementsInterfaces = [],
      constructor,
      ...paramsToAdd
    } = params;

    // Only add the constructor if it was an ownProperty of params. We can get
    // an object from from proto that is unpacked as constructor above.
    if (params.hasOwnProperty('constructor')) {
        // Rename the constructor param so it can be added with the other params
        paramsToAdd._constructor = constructor;
    };

    // The object prototype gets the iname of the first implement
    // interface. It is used when functions are inherited using
    // extends
    if (Array.isArray(implementsInterfaces) && implementsInterfaces.length > 0) {
        // Check that the interfaces that are passed as implemented aren't undefined. This helps
        // to catch import errors etc on creation instead of only swallowing it silently.
        // TODO: Perhaps not check for this in production?
        for (let i = 0; i < implementsInterfaces.length; i++) {
          const intrfc = implementsInterfaces[i]
          if (!intrfc) {
              throw new Error('The interface at index [' + i + '] appears to be undefined, check that you have created it and that it is imported properly');
          }
        }
        // Set the most significant interface as _iname of this object
        // TODO: This is actually confusing, should we remove this? What use is it in real life?
        paramsToAdd._iname = implementsInterfaces[0].name;
    };
    
    var ObjectPrototype = function (data) {
      _init(this, data);
    };

    // Set a more debug friendly name for ObjectPrototype (by convention we strip leading "I" if it
    // exists)
    if (paramsToAdd._iname) {
        // var tmpName = params._iname.startsWith('I') ? params._iname.slice(1) : params._iname
        var tmpName = paramsToAdd._iname.startsWith('I') ? paramsToAdd._iname.slice(1) : paramsToAdd._iname
        Object.defineProperty(ObjectPrototype, 'name', {value: tmpName, configurable: true})
    }
        
    ObjectPrototype.prototype.toJSON = _toJSON
        
    ObjectPrototype.prototype._implements = []
    
    // If extends other do first so they get overridden by those passed as params
    // Inehrited prototypes with lower index have precedence
    extendPrototypeWithThese(ObjectPrototype, extendThese);
        
    // The rest of the params are added as methods, overriding previous
    addMembers(ObjectPrototype, paramsToAdd);

    // Check that we have added all the members that where defined as members
    // TODO: Should we only do this check in development mode? Would improve performance
    if (notNullOrUndef(implementsInterfaces)) {
      checkMembers(ObjectPrototype, implementsInterfaces || [])

      // Add the interfaces so they can be checked
      // TODO: Filer so we remove duplicates from existing list (order makes difference)
      ObjectPrototype.prototype._implements = implementsInterfaces.concat(ObjectPrototype.prototype._implements);
    }
    
        
    return ObjectPrototype;
}
