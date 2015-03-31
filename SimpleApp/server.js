'use strict';
var dotenv = require('dotenv').load();

var development = process.env.NODE_ENV !== 'production';

var path = require('path');
var url = require('url');
var express = require('express');
var nodejsx = require('node-jsx').install({
    extension: '.jsx'
});


/*
    Create the global component registry
*/    
console.log('*** Creating component registry');
var UtilityRegistry = require('component-registry').UtilityRegistry;
global.utilityRegistry = new UtilityRegistry();

var AdapterRegistry = require('component-registry').AdapterRegistry;
global.adapterRegistry = new AdapterRegistry();
/*
    /END COMPONENT REGISTRY/
*/

var renderApp = require('./app/app').renderApp;

var app = express();

var favIcon = function (req, res) {
    // TODO: Change so this returns the actual favicon.ico
    res.send("favicon stub");
}

// Serve assets locally
app.use('/assets', express.static(path.join(__dirname, 'assets')))

// handle favicon
app.get('/favicon.ico', favIcon)

// Frontend app
app.use(function (req, res, next) {
    renderApp(req, res, next);
})


var PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
    console.log("Go to http://localhost:" + PORT + "/ to visit the site!\n");    
});

module.exports = app;
