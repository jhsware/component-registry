'use strict';

module.exports.AdapterRegistry = require('./adapterRegistry');
module.exports.UtilityRegistry = require('./utilityRegistry');

module.exports.Interface = require('./interface').Interface;
module.exports.createInterface = require('./interface').createInterface;

module.exports.createAdapter = require('./adapterFactory').create;

module.exports.createUtility = require('./utilityFactory').create;

module.exports.createObjectPrototype = require('./objectFactory').create;