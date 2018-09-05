'use strict';

module.exports.AdapterRegistry = require('./adapterRegistry');
module.exports.UtilityRegistry = require('./utilityRegistry');
module.exports.globalRegistry = require('./globalRegistry');

module.exports.createInterfaceClass = require('./interfaceFactory').createInterfaceClass;

module.exports.Adapter = require('./adapterFactory').Adapter;

module.exports.createUtility = require('./utilityFactory').create;

module.exports.createObjectPrototype = require('./objectFactory').create;