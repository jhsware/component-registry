var assert = require('assert');
var expect = require('expect.js');

var createInterface = require('../lib').createInterface;
var createUtility = require('../lib').createUtility;

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

    it("checks for existence of members in implemnented interface", function() {
        var IService = createInterface({name: 'IService', members: { doSomething: 'function: does something...'}});

        var util = createUtility({
            implements: IService,
            doSomething: function () {}
        })
        
        expect(util).not.to.be(undefined);
    
        var failed
        try {
            createUtility({
                implements: IService
            })
        } catch (e) {
            failed = true
        }
        expect(failed).to.equal(true);
    });
});