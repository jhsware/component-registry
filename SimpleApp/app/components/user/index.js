'use strict';
var createObjectPrototype = require('component-registry').createObjectPrototype;

var BaseObjectProto = require('../base_object');
var IUser = require('../../interfaces').IUser;

var UserPrototype = createObjectPrototype({
    implements: [IUser],
    extends: [BaseObjectProto],
    title: 'I am a user!',
    role: 'editor'
})

module.exports = UserPrototype;

// Import views
require('./listItem');