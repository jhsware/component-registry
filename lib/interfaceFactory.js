'use strict';

var _generateId = function () {
    var nr = Math.abs(Math.random() * 1000000);
    var now = Date.now();
    return now + '_' + nr;
}

var Interface = function (params) {
    /*
        schema will be optional, but isn't implemented yet
    */
    this.schema = params.schema;
    this.name = params.name;
    
    this.interfaceId = _generateId();
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