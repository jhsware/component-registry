'use strict';
var React = require('react');

var IDataFetcher = require('../interfaces').IDataFetcher;
var IListItem = require('../interfaces').IListItem;

var Page = React.createClass({
    statics: {
        fetchData: function (params, callback) {
            global.utilityRegistry.getUtility(IDataFetcher, 'contentPage').fetchData(params, callback);
        }
    },
    
    render: function() {
        
        var data = this.props.data;
        
        var contentEls = data.content.map(function (obj, i) {
            var ReactComponent = global.adapterRegistry.getAdapter(obj, IListItem).ReactComponent;
            return <ReactComponent key={'item-' + i} context={obj} />;            
        });
        
        return (
            <div>
                <h1>{data.title}</h1>
                <div className="contentList">
                    {contentEls}
                </div>
            </div>
        );
    }
});

module.exports = Page;
