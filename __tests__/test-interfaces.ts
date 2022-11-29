import { describe, expect, it } from "@jest/globals";
import { createInterfaceClass, createObjectPrototype, Adapter, Utility } from '../dist/index.cjs.js'
const Interface = createInterfaceClass('test')

describe('Interfaces', function() {
    it('can be created', function() {
        const IUser = new Interface({name: 'IUser'});
                
        expect(IUser.name).toBe('IUser');
        expect(IUser.interfaceId).not.toBe(undefined);
    });
    
    it('can test if an object implements it', function() {
        const IUser = new Interface({name: 'IUser'});
        
        const INotImplemented = new Interface({name: 'INotImplemented'});
        
        const userPrototype = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        const user = new userPrototype();
        
        expect(IUser.providedBy(user)).toBe(true);
        expect(INotImplemented.providedBy(user)).toBe(false);
    });

    it('can test if an adapter implements it', function() {
        const INotImplemented = new Interface({name: 'INotImplemented'});

        const IUser = new Interface({name: 'IUser'});        
        const userPrototype = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        const IPrintUser = new Interface({name: 'IPrintUser'});
        const printAdapter = new Adapter({
            implements: IPrintUser,
            adapts: IUser,
            print: function () {
                return "Hi!"
            }
        })
        
        const user = new userPrototype();
        const printUser = new printAdapter(user);
        
        expect(IPrintUser.providedBy(printUser)).toBe(true);
        expect(INotImplemented.providedBy(printUser)).toBe(false);
    });

    
    it('can test if a utility impelements it (single interface)', function() {
        const IUserFactory = new Interface({name: 'IUser'});
        
        const INotImplemented = new Interface({name: 'INotImplemented'});
        
        const userPrototypeFactory = new Utility({
            implements: IUserFactory,
            doStuff: function () {
                return "Hi!"
            }
        })
        
        const factory = new userPrototypeFactory();
        
        expect(IUserFactory.providedBy(factory)).toBe(true);
        expect(INotImplemented.providedBy(factory)).toBe(false);
    });

});