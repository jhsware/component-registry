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
        for (var i = 0, imax = 200; i < imax; i++) {
            if (i % 4 == 0) {
                var tmp = new UserPrototype({
                    title: "I am User Nr " + i + "!"
                });
            } else {
                var tmp = new NewsPrototype({
                    title: "I am a News Item (" + i + ")"
                });
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
