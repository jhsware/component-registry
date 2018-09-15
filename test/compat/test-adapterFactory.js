import expect from 'expect.js'

var createInterface = require('../../dist/cjs').createInterface;
var createAdapter = require('../../dist/cjs').createAdapter;

describe('Compat', function () {
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
    });
});