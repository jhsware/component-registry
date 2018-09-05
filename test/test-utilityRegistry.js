var assert = require('assert');
var expect = require('expect.js');

var UtilityRegistry = require('../lib').UtilityRegistry;
const Interface = require('../lib').createInterfaceClass('test');
const { Utility } = require('../lib');

describe('Utility Registry', function() {
    beforeEach(function () {
        registry.utilities = {}
    })
    
    it('can be created', function() {        
        var registry = new UtilityRegistry();
        
        expect(registry).to.not.be(undefined);
    });
        
    it('can get with registry.getUtility', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = new Interface({name: "IDummyUtility"});
        
        var DummyUtility = new Utility({
            registry: registry,
            implements: IDummyUtility
        });
        
        var util = registry.getUtility(IDummyUtility);
        
        expect(util).to.be.a(DummyUtility);
    });

    it('can get an unnamed utility', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = new Interface({name: "IDummyUtility"});
        
        var DummyUtility = new Utility({
            registry: registry,
            implements: IDummyUtility
        });
        
        var util = new IDummyUtility(IDummyUtility, { registry: registry });
        
        expect(util).to.be.a(DummyUtility);
    });
    
    it('can get a named utility', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = new Interface({name: "IDummyUtility"});
        
        var DummyUtility = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'basic'
        });
        
        var util = registry.getUtility(IDummyUtility, 'basic');
        
        expect(util).to.be.a(DummyUtility);
    });
    
    it('can get the correct named utility', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = new Interface({name: "IDummyUtility"});
        
        var DummyUtility = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'basic'
        });
        
        var NotMeUtility = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'not me'
        });
        
        var util = new IDummyUtility('basic', { registry: registry });
        
        expect(util).to.be.a(DummyUtility);
        expect(util).not.to.be.a(NotMeUtility);
    });
    
    it('can get a list of named utilities', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = new Interface({name: "IDummyUtility"});
        
        var DummyUtility_1 = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'one'
        });

        var DummyUtility_2 = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'two'
        });
        
        var DummyUtility_3 = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'three'
        });
        
        var utils = registry.getUtilities(IDummyUtility);
        
        expect(utils[0]).not.to.be(undefined);
        expect(utils[0]._name).not.to.be(undefined);
        expect(utils.length).to.be(3);
    });
    
    it('can get a list of named utilities and an unnamed utility', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = new Interface({name: "IDummyUtility"});

        var DummyUtility = new Utility({
            registry: registry,
            implements: IDummyUtility
        });
        
        var DummyUtility_1 = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'one'
        });

        var DummyUtility_2 = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'two'
        });
        
        var DummyUtility_3 = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'three'
        });
        
        var utils = registry.getUtilities(IDummyUtility);
        
        expect(utils[0]).not.to.be(undefined);
        expect(utils[0].name).to.be(undefined);
        expect(utils.length).to.be(4);
    });
    
    it('returns an empty list if no utilities are registered', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = new Interface({name: "IDummyUtility"});        
        
        var utils = registry.getUtilities(IDummyUtility);
        
        expect(utils.length).to.be(0);
    });
    
    it("returns 'undefined' if named utility isn't found and we have passed undefined as default", function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = new Interface({name: "IDummyUtility"});
        
        var DummyUtility_1 = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'one'
        });
        
        var utils = registry.getUtility(IDummyUtility, 'two', undefined);
        
        expect(utils).to.be(undefined);
    });

    it("returns 'undefined' if UNNAMED utility isn't found and we have passed undefined as default", function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = new Interface({name: "IDummyUtility"});
        
        var utils = registry.getUtility(IDummyUtility, undefined, undefined);
        
        expect(utils).to.be(undefined);
    });
});