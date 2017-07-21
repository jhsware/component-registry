'use strict';

var uuid = require('uuid');

function providedBy (obj) {
    // Does the specified object implement this interface
    if (obj && Array.isArray(obj._implements)) {
        // Object has a list of interfaces it implements
        for (var i=0, imax = obj._implements.length; i<imax; i++) {
            if (obj._implements[i].interfaceId === this.interfaceId) {
                return true;
            };
        }
    } else if (obj && obj._implements && obj._implements.interfaceId === this.interfaceId) {
        // Object implements a single interface (probably a utility)
        return true;
    }
    // If we came this far, the object doesn't implement this interface
    return false;
}

var createInterface = function (params) {
    // Make sure we don't get an undefined params list
    params = params || {};
    
    var extendsThese = params.extends,
        schema = params.schema,
        name = params.name;
        
    // TODO: If extends other interfaces then concatenate schemas from those, order sets precedence (first is overrides).
    // Then superimpose given schema on top of these.
    var Interface = function (params) {
        // Schema defines fields and can be used for validation and form generation (optional)
        this.schema = params.schema;
        // The name of the interface, this should be unique
        this.name = params.name;
        // Additional properties that aren't exposed as form data, in the future this might be 
        // used to check that objects fulfill the implementation
        this.members = params.members;
        
        this.interfaceId = uuid.v4();
        
        // console.log("[SCHEMA] Created interface [" + this.name + "] with id: " + this.interfaceId);
    }

    Interface.prototype.providedBy = providedBy
    
    // Set name for better debugging
    Object.defineProperty(Interface, 'name', {value: name, configurable: true})
    
    var newInterface = new Interface({
        schema: schema,
        name: name
    });
    
    return newInterface
}

module.exports.create = createInterface;