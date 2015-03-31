
'use strict';

var React = require('react'),
    RouteHandler = require('react-router').RouteHandler;

var Master = React.createClass({
    render: function() {
        var og = this.props.data && this.props.data.content ? this.props.data.content.og_tags : {};
        return (
            <html>
                <head>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

                    <title>{og['og:title']}</title>
                    <meta name="description" content={og['og:description']} />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />

                    <link rel="stylesheet" href="/assets/css/app.css" />

                </head>

                <body>

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
