'use strict';

var createInterface = require('component-registry').createInterface;

// Utility to fetch data from server
module.exports.IDataFetcher = createInterface();


// Adapter to render a list item
module.exports.IListItem = createInterface();


// Base Object
module.exports.IObject = createInterface();

// User object
module.exports.IUser = createInterface();

// News object
module.exports.INews = createInterface();