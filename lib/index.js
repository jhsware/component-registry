'use strict';
const Registry = require('./globalRegistry');

module.exports.Registry = Registry;
module.exports.AdapterRegistry = require('./adapterRegistry');
module.exports.UtilityRegistry = require('./utilityRegistry');
module.exports.globalRegistry = new Registry();

module.exports.createInterfaceClass = require('./interfaceFactory').createInterfaceClass;

module.exports.Adapter = require('./adapterFactory').Adapter;

module.exports.Utility = require('./utilityFactory').Utility;

module.exports.createObjectPrototype = require('./objectFactory').create;

// Compat, deprecate for 2.0
module.exports.createInterface = require('./compat').createInterface;
module.exports.createAdapter = require('./compat').createAdapter;
module.exports.createUtility = require('./compat').createUtility;
