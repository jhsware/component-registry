'use strict';

var _generateId = function () {
    var nr = Math.abs(Math.random() * 1000000);
    var now = Date.now();
    return now + '_' + nr;
}

var Interface = function (opts) {
    /*
        schema will be optional, but isn't implemented yet
    */
    if (typeof opts === 'undefined') {
        opts = {};
    };
    this.schema = opts.schema;
    this.name = opts.name;
    
    this.interfaceId = _generateId();
}

module.exports.Interface = Interface;

var createInterface = function (params) {
    var extendsThese = params.extends,
        schema = params.schema;
        
    // TODO: If extends other interfaces then concatenate schemas from those, order sets precedence (first is overrides).
    // Then superimpose given schema on top of these.
    
    var newInterface = new Interface({
        schema: schema
    });
}

module.exports.createInterface = createInterface;