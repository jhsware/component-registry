
'use strict';

var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var routes = require('./routes');

// Register dataFetchers
require('./network');

function renderApp(req, res, next) {
    Router.run(routes, req.path, function (Handler, state) {
        var dataFetchers = state.routes.filter(function (route) {
            return route.handler.fetchData;
        });

        if (dataFetchers.length > 0) {
            var routeName = dataFetchers[0].name;
            var fetchData = dataFetchers[0].handler.fetchData;
            var routePath = dataFetchers[0].path;

            fetchData(state.params, function (err, result) {
                if (err || result.status != 200) {
                    // Allow mounted error handler in server.js handle this
                    console.log("[APP] got an error");
                    console.log(err);
                    return next(err);
                }
                
                try {
                    var html = React.renderToString(<Handler params={state.params} data={result.body} />);
                } catch (e) {
                    console.error(e.stack);
                    var html = e.stack;
                }
                return res.send('<!doctype html>\n' + html);
            });
        } else {
            var html = React.renderToString(<Handler params={state.params} />);
            return res.send('<!doctype html>\n' + html);
        };
    });
}

if (typeof window !== 'undefined') {

    // Perform routing
    Router.run(routes, Router.HistoryLocation, function (Handler, state) {
        var dataFetchers = state.routes.filter(function (route) {
            return route.handler.fetchData;
        });

        if (dataFetchers.length > 0) {
            var routeName = dataFetchers[0].name;
            var fetchData = dataFetchers[0].handler.fetchData;

            fetchData(state.params, function (err, result) {
                if (err || result.status != 200) {
                    // Pass error object to
                    console.log("[APP] We got an error!");
                    // TODO: Show error modal
                    //return alert("We got an error! See console");
                } else {
                    // All is ok, just render the page
                    try {
                        return React.render(<Handler params={state.params} data={result.body} />, document);
                    } catch (e) {
                        console.error(e.stack);
                    }
                    
                }
            });
        } else {
            return React.render(<Handler params={state.params} />, document);
        };
    });
};

module.exports.renderApp = renderApp;
