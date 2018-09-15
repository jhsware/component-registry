import expect from 'expect.js'

var createInterface = require('../../dist/cjs').createInterface;
var createUtility = require('../../dist/cjs').createUtility;

describe('Compat', function () {
    describe('Utility Factory', function() {
        it('can create an utility', function() {
            var IService = createInterface({name: 'IService'});

            var util = createUtility({
                implements: IService
            })
            
            expect(util).not.to.be(undefined);
        });

        it('can create a named utility', function() {
            var IService = createInterface({name: 'IService'});

            var util = createUtility({
                implements: IService,
                name: 'hallo'
            })
            
            expect(util).not.to.be(undefined);
            expect(util.name).to.equal('hallo');
        });
    });
});