'use strict';

var React = require('react');

var Page = function (Template) {
    return React.createClass({
        statics: {
            fetchData: function (params, callback) {
                var outp = {
                    status: 200,
                    body: {
                        title: "This is the start page"
                    }
                };
                callback(undefined, outp);
            }
        },

        render: function() {
            
            return (
                <Template>
                    <h1>{this.props.title}</h1>
                </Template>
            );
        }
    });
}

module.exports = Page;
