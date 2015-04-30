var assert = require('assert');
var expect = require('expect.js');

var UtilityRegistry = require('../lib').UtilityRegistry;
var createInterface = require('../lib').createInterface;
var createUtility = require('../lib').createUtility;

describe('Utility Registry', function() {
    it('can be created', function() {        
        var registry = new UtilityRegistry();
        
        expect(registry).to.not.be(undefined);
    });
        
    it('can get an unnamed utility', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = createInterface({name: "IDummyUtility"});
        
        var DummyUtility = createUtility({
            implements: IDummyUtility
        });
        registry.registerUtility(DummyUtility);
        
        var util = registry.getUtility(IDummyUtility);
        
        expect(util).to.be.a(DummyUtility);
    });
    
    it('can get a named utility', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = createInterface({name: "IDummyUtility"});
        
        var DummyUtility = createUtility({
            implements: IDummyUtility,
            name: 'basic'
        });
        registry.registerUtility(DummyUtility);
        
        var util = registry.getUtility(IDummyUtility, 'basic');
        
        expect(util).to.be.a(DummyUtility);
    });
    
    it('can get the correct named utility', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = createInterface({name: "IDummyUtility"});
        
        var DummyUtility = createUtility({
            implements: IDummyUtility,
            name: 'basic'
        });
        registry.registerUtility(DummyUtility);
        
        var NotMeUtility = createUtility({
            implements: IDummyUtility,
            name: 'not me'
        });
        registry.registerUtility(NotMeUtility);
        
        var util = registry.getUtility(IDummyUtility, 'basic');
        
        expect(util).to.be.a(DummyUtility);
        expect(util).not.to.be.a(NotMeUtility);
    });
    
    it('can get a list of named utilities', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = createInterface({name: "IDummyUtility"});
        
        var DummyUtility_1 = createUtility({
            implements: IDummyUtility,
            name: 'one'
        });
        registry.registerUtility(DummyUtility_1);

        var DummyUtility_2 = createUtility({
            implements: IDummyUtility,
            name: 'two'
        });
        registry.registerUtility(DummyUtility_2);
        
        var DummyUtility_3 = createUtility({
            implements: IDummyUtility,
            name: 'three'
        });
        registry.registerUtility(DummyUtility_3);
        
        
        var utils = registry.getUtilities(IDummyUtility);
        
        expect(utils[0].utility).not.to.be(undefined);
        expect(utils[0].name).not.to.be(undefined);
        expect(utils.length).to.be(3);
    });
    
    it('can get a list of named utilities and an unnamed utility', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = createInterface({name: "IDummyUtility"});

        var DummyUtility = createUtility({
            implements: IDummyUtility
        });
        registry.registerUtility(DummyUtility);

        
        var DummyUtility_1 = createUtility({
            implements: IDummyUtility,
            name: 'one'
        });
        registry.registerUtility(DummyUtility_1);

        var DummyUtility_2 = createUtility({
            implements: IDummyUtility,
            name: 'two'
        });
        registry.registerUtility(DummyUtility_2);
        
        var DummyUtility_3 = createUtility({
            implements: IDummyUtility,
            name: 'three'
        });
        registry.registerUtility(DummyUtility_3);
        
        
        var utils = registry.getUtilities(IDummyUtility);
        
        expect(utils[0].utility).not.to.be(undefined);
        expect(utils[0].name).to.be(undefined);
        expect(utils.length).to.be(4);
    });
    
    it('returns an empty list if no utilities are registered', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = createInterface({name: "IDummyUtility"});        
        
        var utils = registry.getUtilities(IDummyUtility);
        
        expect(utils.length).to.be(0);
    });
    
    it("returns an error when registering an adapter that doesn't implement interface", function() {});
    it("returns an error when trying to get an adapter that doesn't exist", function() {});
});