'use strict';
var React = require('react');
var createAdapter = require('component-registry').createAdapter;


var IListItem = require('../../interfaces').IListItem;
var IUser = require('../../interfaces').IUser;

var RenderListItem = createAdapter({
    implements: IListItem,
    adapts: IUser,
    
    component: React.createClass({
    
        render: function() {
        
            var context = this.props.context;
                 
            return (
                <div className="IListItem">
                    <h1>{context.title}</h1>
                    <h2>My role is: {context.role}</h2>
                </div>
            );
        }
    })
});

global.adapterRegistry.registerAdapter(RenderListItem)

