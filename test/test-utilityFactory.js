var expect = require('expect.js');

const Interface = require('../lib').createInterfaceClass('test');
const { Utility } = require('../lib');

describe('Utility Factory', function() {
    beforeEach(function () {
        registry.utilities = {}
    })
    
    it('can create an utility', function() {
        var IService = new Interface({name: 'IService'});

        var util = new Utility({
            implements: IService
        })
        
        expect(util).not.to.be(undefined);
    });

    it('can create a named utility', function() {
        var IService = new Interface({name: 'IService'});

        var util = new Utility({
            implements: IService,
            name: 'hallo'
        })
        
        expect(util).not.to.be(undefined);
        expect(util.name).to.equal('hallo');
    });

    it("checks for existence of members in implemented interface", function() {
        var IService = new Interface({name: 'IService'});

        IService.prototype.doSomething = function () {}

        var util = new Utility({
            implements: IService,
            doSomething () {}
        })
        
        expect(util).not.to.be(undefined);
    
        var failed
        try {
            new Utility({
                implements: IService
            })
        } catch (e) {
            failed = true
        }
        expect(failed).to.equal(true);
    });
});