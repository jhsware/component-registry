'use strict';
var createObjectPrototype = require('component-registry').createObjectPrototype;

var IObject = require('../../interfaces').IObject;

var BaseObjectPrototype = createObjectPrototype({
    implements: [IObject],
    title: undefined
});

module.exports = BaseObjectPrototype;

// Import views
require('./listItem');

