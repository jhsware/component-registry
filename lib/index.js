'use strict';

module.exports.AdapterRegistry = require('./adapterRegistry');
module.exports.UtilityRegistry = require('./utilityRegistry');
module.exports.globalRegistry = require('./globalRegistry');

module.exports.createInterface = require('./interfaceFactory').create;

module.exports.createAdapter = require('./adapterFactory').create;

module.exports.createUtility = require('./utilityFactory').create;

module.exports.createObjectPrototype = require('./objectFactory').create;