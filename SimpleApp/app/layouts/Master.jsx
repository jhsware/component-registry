
'use strict';

var React = require('react'),
    RouteHandler = require('react-router').RouteHandler;
var ReactRouter = require('react-router');
var Link        = ReactRouter.Link;

var Master = React.createClass({
    render: function() {
        var data = this.props.data || {};
        return (
            <html>
                <head>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

                    <title>{data.title}</title>
                    <meta name="description" content={data.description || ''} />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />

                    <link rel="stylesheet" href="/assets/css/app.css" />

                </head>

                <body>
                    <ul className="menu">
                        <li><Link to="/">Start</Link></li>
                        <li><Link to="/blaj">Not Found</Link></li>
                    </ul>
                    <div className="page">
                        <RouteHandler {...this.props} />
                    </div>

                    <script src="//code.jquery.com/jquery-2.1.1.min.js"></script>
                    <script src="/assets/js/app.js" />
                </body>
            </html>
        );
    }
});

module.exports = Master;
