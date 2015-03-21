var assert = require('assert');
var expect = require('expect.js');

var UtilityRegistry = require('../lib').UtilityRegistry;
var Interface = require('../lib').Interface;
var createUtility = require('../lib').createUtility;

describe('Utility Registry', function() {
    it('can be created', function() {        
        var registry = new UtilityRegistry();
        
        expect(registry).to.not.be(undefined);
    });
        
    it('can get an unnamed utility', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = new Interface();
        
        var DummyUtility = createUtility({
            implements: IDummyUtility
        });
        registry.registerUtility(DummyUtility);
        
        var util = registry.getUtility(IDummyUtility);
        
        expect(util).to.be.a(DummyUtility);
    });
    
    it('can get a named utility', function() {
        var registry = new UtilityRegistry();
        
        var IDummyUtility = new Interface();
        
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
        
        var IDummyUtility = new Interface();
        
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
    
    it("returns an error when registering an adapter that doesn't implement interface", function() {});
    it("returns an error when trying to get an adapter that doesn't exist", function() {});
});