import { describe, expect, it } from "@jest/globals";
import { createInterfaceClass, Utility, UtilityRegistry } from '../dist/index.cjs.js'
const Interface = createInterfaceClass('test')

describe('Utility Factory', function() {
    it('can create an utility', function() {
        const registry = new UtilityRegistry();
        const IService = new Interface({name: 'IService'});

        const util = new Utility({
            registry,
            implements: IService
        })
        
        expect(util).not.toBe(undefined);
    });

    it('can create a named utility', function() {
        const registry = new UtilityRegistry();
        const IService = new Interface({name: 'IService'});

        const util = new Utility({
            registry,
            implements: IService,
            name: 'hallo'
        })
        
        expect(util).not.toBe(undefined);
        expect(util.name).toEqual('hallo');
    });

    it("checks for existence of members in implemented interface", function() {
        const registry = new UtilityRegistry();
        const IService = new Interface({name: 'IService'});

        IService.prototype.doSomething = function () {}

        const util = new Utility({
            registry,
            implements: IService,
            doSomething () {}
        })
        
        expect(util).not.toBe(undefined);
    
        let failed
        try {
            new Utility({
                registry,
                implements: IService
            })
        } catch (e) {
            failed = true
        }
        expect(failed).toEqual(true);
    });
});