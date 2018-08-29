var assert = require('assert');
var expect = require('expect.js');

var createInterface = require('../lib').createInterface;
var createAdapter = require('../lib').createAdapter;

describe('Adapter Factory', function() {
    it('can create an adapter', function() {
        var IUser = createInterface({name: 'IUser'});
        var IDisplayWidget = createInterface({name: 'IDisplayWidget'});

        var adapter = createAdapter({
            implements: IDisplayWidget,
            adapts: IUser
        })
        
        expect(adapter).not.to.be(undefined);
    });

    it("checks for existence of members in implemnented interface", function() {
        var IUser = createInterface({name: 'IUser'});
        var IDisplayWidget = createInterface({name: 'IDisplayWidget', members: { render: 'function: render widget'}});
        
        var adapter = createAdapter({
          implements: IDisplayWidget,
          adapts: IUser,
          render: function () {}
        })
    
        expect(adapter).not.to.be(undefined);

        var failed
        try {
            var adapter = createAdapter({
              implements: IDisplayWidget,
              adapts: IUser
            })
        } catch (e) {
            failed = true
        }
        expect(failed).to.equal(true);
    });
});