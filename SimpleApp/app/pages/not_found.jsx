'use strict';

var React       = require('react');

var Page = function (Template) {
    return React.createClass({
        statics: {
            fetchData: function (params, callback) {
                var outp = {
                    status: 200,
                    body: {
                        title: "Page not found"
                    }
                };
                
                callback(undefined, outp);
            }
        },

        render: function() {
            return (
                <Template>
                    <h1>Sorry! We couldn't find the page you were looking for :(</h1>
                </Template>
            );
        }
    });
}

module.exports = Page;
