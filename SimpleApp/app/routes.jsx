'use strict';

var React = require('react/addons'),
    Router = require('react-router'),
    Route = Router.Route,
    NotFoundRoute = Router.NotFoundRoute,
    DefaultRoute = Router.DefaultRoute,
    MasterTemplate = require('./layouts/Master');

module.exports = (
    <Route name="app" path="/" handler={require('./layouts/Master')}>
        <DefaultRoute handler={require('./pages/start')(MasterTemplate)} />
    
        <Route path="/start" handler={require('./pages/start')(MasterTemplate)} />

        <NotFoundRoute handler={require('./pages/not_found')(MasterTemplate)} />
    </Route>
);
