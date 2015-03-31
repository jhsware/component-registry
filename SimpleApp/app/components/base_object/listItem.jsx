'use strict';
var React = require('react');
var createAdapter = require('component-registry').createAdapter;


var IListItem = require('../../interfaces').IListItem;
var IObject = require('../../interfaces').IObject;

var RenderListItem = createAdapter({
    implements: IListItem,
    adapts: IObject,
    
    component: React.createClass({
    
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

