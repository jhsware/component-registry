import { describe, expect, it } from "@jest/globals";
import { createInterfaceClass, UtilityRegistry, Utility } from '../dist/index.cjs.js'
const Interface = createInterfaceClass('test')

describe('Utility Registry', function() {
    it('can be created', function() {        
        const registry = new UtilityRegistry();
        
        expect(registry).not.toBe(undefined);
    });
        
    it('can get with registry.getUtility', function() {
        const registry = new UtilityRegistry();
        
        const IDummyUtility = new Interface({name: "IDummyUtility"});
        
        const DummyUtility = new Utility({
            registry: registry,
            implements: IDummyUtility
        });
        
        const util = registry.getUtility(IDummyUtility);
        
        expect(util).toBeInstanceOf(DummyUtility);
    });

    it('can get an unnamed utility', function() {
        const registry = new UtilityRegistry();
        
        const IDummyUtility = new Interface({name: "IDummyUtility"});
        
        const DummyUtility = new Utility({
            registry: registry,
            implements: IDummyUtility
        });
        
        const util = new IDummyUtility(IDummyUtility, { registry: registry });
        
        expect(util).toBeInstanceOf(DummyUtility);
    });
    
    it('can get a named utility', function() {
        const registry = new UtilityRegistry();
        
        const IDummyUtility = new Interface({name: "IDummyUtility"});
        
        const DummyUtility = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'basic'
        });
        
        const util = registry.getUtility(IDummyUtility, 'basic');
        
        expect(util).toBeInstanceOf(DummyUtility);
    });
    
    it('can get the correct named utility', function() {
        const registry = new UtilityRegistry();
        
        const IDummyUtility = new Interface({name: "IDummyUtility"});
        
        const DummyUtility = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'basic'
        });
        
        const NotMeUtility = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'not me'
        });
        
        const util = new IDummyUtility('basic', { registry: registry });
        
        expect(util).toBeInstanceOf(DummyUtility);
        expect(util).not.toBeInstanceOf(NotMeUtility);
    });
    
    it('can get a list of named utilities', function() {
        const registry = new UtilityRegistry();
        
        const IDummyUtility = new Interface({name: "IDummyUtility"});
        
        const DummyUtility_1 = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'one'
        });

        const DummyUtility_2 = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'two'
        });
        
        const DummyUtility_3 = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'three'
        });
        
        const utils = registry.getUtilities(IDummyUtility);
        
        expect(utils[0]).not.toBe(undefined);
        expect(utils[0]._name).not.toBe(undefined);
        expect(utils.length).toBe(3);
    });
    
    it('can get a list of named utilities and an unnamed utility', function() {
        const registry = new UtilityRegistry();
        
        const IDummyUtility = new Interface({name: "IDummyUtility"});

        const DummyUtility = new Utility({
            registry: registry,
            implements: IDummyUtility
        });
        
        const DummyUtility_1 = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'one'
        });

        const DummyUtility_2 = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'two'
        });
        
        const DummyUtility_3 = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'three'
        });
        
        const utils = registry.getUtilities(IDummyUtility);
        
        expect(utils[0]).not.toBe(undefined);
        expect(utils[0].name).toBe(undefined);
        expect(utils.length).toBe(4);
    });

    it('can get a list of named utilities and an unnamed utility using "*"', function() {
      const registry = new UtilityRegistry();
      
      const IDummyUtility = new Interface({name: "IDummyUtility"});

      const DummyUtility = new Utility({
          registry: registry,
          implements: IDummyUtility
      });
      
      const DummyUtility_1 = new Utility({
          registry: registry,
          implements: IDummyUtility,
          name: 'one'
      });

      const DummyUtility_2 = new Utility({
          registry: registry,
          implements: IDummyUtility,
          name: 'two'
      });
      
      const DummyUtility_3 = new Utility({
          registry: registry,
          implements: IDummyUtility,
          name: 'three'
      });
      
      const utils = new IDummyUtility('*', { registry });
      
      expect(utils[0]).not.toBe(undefined);
      expect(utils[0].name).toBe(undefined);
      expect(utils.length).toBe(4);
  });
    
    it('returns an empty list if no utilities are registered', function() {
        const registry = new UtilityRegistry();
        
        const IDummyUtility = new Interface({name: "IDummyUtility"});        
        
        const utils = registry.getUtilities(IDummyUtility);
        
        expect(utils.length).toBe(0);
    });
    
    it("returns 'undefined' if named utility isn't found and we have passed undefined as default", function() {
        const registry = new UtilityRegistry();
        
        const IDummyUtility = new Interface({name: "IDummyUtility"});
        
        const DummyUtility_1 = new Utility({
            registry: registry,
            implements: IDummyUtility,
            name: 'one'
        });
        
        const utils = registry.getUtility(IDummyUtility, 'two', undefined);
        
        expect(utils).toBe(undefined);
    });

    it("returns 'undefined' if UNNAMED utility isn't found and we have passed undefined as default", function() {
        const registry = new UtilityRegistry();
        
        const IDummyUtility = new Interface({name: "IDummyUtility"});
        
        const utils = registry.getUtility(IDummyUtility, undefined, undefined);
        
        expect(utils).toBe(undefined);
    });
});