'use strict';
var createObjectPrototype = require('component-registry').createObjectPrototype;

var IBaseObject = require('../../interfaces').IBaseObject;

var BaseObjectPrototype = createObjectPrototype({
    implements: [IBaseObject],
    title: undefined
});

module.exports = BaseObjectPrototype;

// Import views
require('./listItem');

