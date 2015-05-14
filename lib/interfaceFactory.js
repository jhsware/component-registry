'use strict';

var uuid = require('node-uuid');

var Interface = function (params) {
    // Schema defines fields and can be used for validation and form generation (optional)
    this.schema = params.schema;
    // The name of the interface, this must be unique
    this.name = params.name;
    // Additional properties that aren't exposed as form data, in the future this might be 
    // used to check that objects fulfill the implementation
    this.members = params.members;
    
    this.interfaceId = uuid.v4();
    
    console.log("[SCHEMA] Created interface [" + this.name + "] with id: " + this.interfaceId);
}

Interface.prototype.providedBy = function (obj) {
    // Does the specified object implement this interface
    var tmp = obj._implements.filter(function (intrfc) {
        return intrfc.interfaceId === this.interfaceId;
    }.bind(this));
    
    return tmp.length > 0
}

var createInterface = function (params) {
    // Make sure we don't get an undefined params list
    params = params || {};
    
    var extendsThese = params.extends,
        schema = params.schema,
        name = params.name;
        
    // TODO: If extends other interfaces then concatenate schemas from those, order sets precedence (first is overrides).
    // Then superimpose given schema on top of these.
    
    var newInterface = new Interface({
        schema: schema,
        name: name
    });
    
    return newInterface
}

module.exports.create = createInterface;