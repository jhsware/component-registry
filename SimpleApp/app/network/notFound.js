'use strict';
var createUtility = require('component-registry').createUtility;

var IDataFetcher = require('../interfaces').IDataFetcher;

var FetchDataUtility = createUtility({
    implements: IDataFetcher,
    name: 'notFound',
    
    fetchData: function (params, callback) {
        var outp = {
            status: 200,
            body: {
                title: "Sorry! We couldn't find the page you were looking for :(",
                description: 'No description'
            }
        };
        callback(undefined, outp);
    }
});
global.utilityRegistry.registerUtility(FetchDataUtility);
