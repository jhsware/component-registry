'use strict';
var React       = require('react');

var IDataFetcher = require('../interfaces').IDataFetcher;

var Page = React.createClass({
    statics: {
        fetchData: function (params, callback) {
            global.utilityRegistry.getUtility(IDataFetcher, 'notFound').fetchData(params, callback);
        }
    },

    render: function() {
        var data = this.props.data;
        return (
            <div>
                <h1>{data.title}</h1>
            </div>
        );
    }
});

module.exports = Page;
