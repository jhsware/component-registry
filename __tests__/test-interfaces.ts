import { describe, expect, it } from "@jest/globals";
import { Adapter, AdapterInterface, AdapterRegistry, createIdFactory, ObjectInterface, ObjectPrototype, Utility } from '../src/index'
const id = createIdFactory('test');

describe('Interfaces', function () {
    it('can create ObjectInterface', function () {
        class IUser extends ObjectInterface {
            get interfaceId() { return id('IUser') };
            name: string;
        }

        expect(IUser.name).toBe('IUser');
        expect(IUser.prototype.interfaceId).not.toBe(undefined);
    });
    
    it('can create MarkerInterface', function () {
        // class IUser extends ObjectInterface {
        //     get interfaceId() { return id('IUser') };
        //     name: string;
        // }

        // expect(IUser.name).toBe('IUser');
        // expect(IUser.prototype.interfaceId).not.toBe(undefined);
    });
    
    it('can create AdapterInterface', function () {
        // class IUser extends ObjectInterface {
        //     get interfaceId() { return id('IUser') };
        //     name: string;
        // }

        // expect(IUser.name).toBe('IUser');
        // expect(IUser.prototype.interfaceId).not.toBe(undefined);
    });
    
    it('can create UtilityInterface', function () {
        // class IUser extends ObjectInterface {
        //     get interfaceId() { return id('IUser') };
        //     name: string;
        // }

        // expect(IUser.name).toBe('IUser');
        // expect(IUser.prototype.interfaceId).not.toBe(undefined);
    });

    it('can test if an object implements it', function () {
        class INotImplemented extends ObjectInterface {
            get interfaceId() { return id('INotImplemented') };
        }

        class IUser extends ObjectInterface {
            get interfaceId() { return id('IUser') };
            sayHi(): string { return };
        }    

        type TUser = Omit<IUser, 'interfaceId' | 'providedBy'>;
        class User extends ObjectPrototype<TUser> implements TUser {
            readonly __implements__ = [IUser];
            name: string;
            constructor() {
                super();
            }
            sayHi() {
                return "Hi!"
            }
        }

        const user = new User();

        expect(IUser.prototype.providedBy(user)).toBe(true);
        expect(INotImplemented.prototype.providedBy(user)).toBe(false);
    });
});