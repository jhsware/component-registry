var assert = require('assert');
var expect = require('expect.js');

const Interface = require('../lib').createInterfaceClass('test');
var createUtility = require('../lib').createUtility;

describe('Utility Factory', function() {
    it('can create an utility', function() {
        var IService = new Interface({name: 'IService'});

        var util = createUtility({
            implements: IService
        })
        
        expect(util).not.to.be(undefined);
    });

    it('can create a named utility', function() {
        var IService = new Interface({name: 'IService'});

        var util = createUtility({
            implements: IService,
            name: 'hallo'
        })
        
        expect(util).not.to.be(undefined);
        expect(util.name).to.equal('hallo');
    });

    it("checks for existence of members in implemented interface", function() {
        var IService = new Interface({name: 'IService'});

        IService.prototype.doSomething = function () {}

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