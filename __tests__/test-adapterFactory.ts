import { describe, expect, it } from "@jest/globals";
import { createInterfaceClass, createObjectPrototype, Adapter, AdapterRegistry } from '../dist/index.cjs.js'
import { TAdapterRegistry } from "../dist/types.js";
const Interface = createInterfaceClass('test')

describe('Adapter Factory', function() {
    it('can create an adapter', function() {
        const registry = new AdapterRegistry() as TAdapterRegistry;
        const IUser = new Interface({name: 'IUser'});
        const IDisplayWidget = new Interface({name: 'IDisplayWidget'});

        const adapter = new Adapter({
            registry,
            implements: IDisplayWidget,
            adapts: IUser
        })
        
        expect(adapter).not.toBe(undefined);
    });

    it("checks for existence of methods in implemnented interface", function() {
        const registry = new AdapterRegistry();
        const IUser = new Interface({name: 'IUser'});
        const IDisplayWidget = new Interface({name: 'IDisplayWidget'});
        
        IDisplayWidget.prototype.render = function () {}
        
        const adapter = new Adapter({
          implements: IDisplayWidget,
          adapts: IUser,
          render: function () {}
        })
    
        expect(adapter).not.toBe(undefined);

        let failed;
        try {
            const adapter = new Adapter({
              registry,
              implements: IDisplayWidget,
              adapts: IUser
            })
        } catch (e) {
            failed = true
        }
        expect(failed).toEqual(true);
    });

    it("make sure we actually can call the methods on the adapter", function() {
        const registry = new AdapterRegistry();
        const IUser = new Interface({name: 'IUser'});
        const IDisplayWidget = new Interface({name: 'IDisplayWidget'});
        
        IDisplayWidget.prototype.render = function () {}
        
        const adapter = new Adapter({
          registry,
          implements: IDisplayWidget,
          adapts: IUser,
          render(inp) {
              return inp
          }
        })

        const User = createObjectPrototype({
            implements: [IUser]
        })
    
        const theUser = new User()

        const outp = new IDisplayWidget(theUser, { registry }).render('test')

        expect(outp).toBe('test');
    });
});