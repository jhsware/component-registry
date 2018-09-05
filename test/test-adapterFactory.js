var assert = require('assert');
var expect = require('expect.js');

const Interface = require('../lib').createInterfaceClass('test');
const { Adapter } = require('../lib');

describe('Adapter Factory', function() {
    it('can create an adapter', function() {
        var IUser = new Interface({name: 'IUser'});
        var IDisplayWidget = new Interface({name: 'IDisplayWidget'});

        var adapter = new Adapter({
            implements: IDisplayWidget,
            adapts: IUser
        })
        
        expect(adapter).not.to.be(undefined);
    });

    it("checks for existence of members in implemnented interface", function() {
        var IUser = new Interface({name: 'IUser'});
        var IDisplayWidget = new Interface({name: 'IDisplayWidget'});
        
        IDisplayWidget.prototype.render = function () {}
        
        var adapter = new Adapter({
          implements: IDisplayWidget,
          adapts: IUser,
          render: function () {}
        })
    
        expect(adapter).not.to.be(undefined);

        var failed
        try {
            var adapter = new Adapter({
              implements: IDisplayWidget,
              adapts: IUser
            })
        } catch (e) {
            failed = true
        }
        expect(failed).to.equal(true);
    });
});