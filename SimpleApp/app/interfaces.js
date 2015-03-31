'use strict';

var createInterface = require('component-registry').createInterface;

module.exports.IDataFetcher = createInterface({
    // Utility to fetch data from server
    name: 'IDataFetcher'
    
});

module.exports.IListItem = createInterface({
    // Adapter to render a list item
    name: 'IListItem'
});

module.exports.IBaseObject = createInterface({
    // Base Object
    name: 'IBaseObject'
});

module.exports.IUser = createInterface({
    // User object
    name: 'IUser'
});

module.exports.INews = createInterface({
    // News object
    name: 'INews'
});