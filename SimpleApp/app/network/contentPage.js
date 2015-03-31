'use strict';
var createUtility = require('component-registry').createUtility;

var IDataFetcher = require('../interfaces').IDataFetcher;

var UserPrototype = require('../components/user');
var NewsPrototype = require('../components/news');

var FetchDataUtility = createUtility({
    implements: IDataFetcher,
    name: 'contentPage',
    
    fetchData: function (params, callback) {
        
        var content = []
        for (var i = 0, imax = 10; i < imax; i++) {
            if (i % 2 == 0) {
                var tmp = new UserPrototype();
            } else {
                var tmp = new NewsPrototype();
            }
            content.push(tmp);
        }
        
        var outp = {
            status: 200,
            body: {
                title: "This is the start page",
                description: 'No description',
                content: content
            }
        };
        callback(undefined, outp);
    }
});
global.utilityRegistry.registerUtility(FetchDataUtility);
