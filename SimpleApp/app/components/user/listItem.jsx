'use strict';
var React = require('react');
var createAdapter = require('component-registry').createAdapter;


var IListItem = require('../../interfaces').IListItem;
var IUser = require('../../interfaces').IUser;

var RenderListItem = createAdapter({
    implements: IListItem,
    adapts: IUser,
    
    ReactComponent: React.createClass({
    
        render: function() {
        
            var context = this.props.context;
                 
            return (
                <div className="IListItem">
                    <h2>{context.title}</h2>
                    <h3>My role is: {context.role}</h3>
                </div>
            );
        }
    })
});

global.adapterRegistry.registerAdapter(RenderListItem)

