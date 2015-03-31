'use strict';
var React = require('react');
var createAdapter = require('component-registry').createAdapter;


var IListItem = require('../../interfaces').IListItem;
var IBaseObject = require('../../interfaces').IBaseObject;

var RenderListItem = createAdapter({
    implements: IListItem,
    adapts: IBaseObject,
    
    ReactComponent: React.createClass({
    
        render: function() {
        
            var context = this.props.context;
                 
            return (
                <div className="IListItem">
                    <h1>{context.title}</h1>
                </div>
            );
        }
    })
});

global.adapterRegistry.registerAdapter(RenderListItem)

