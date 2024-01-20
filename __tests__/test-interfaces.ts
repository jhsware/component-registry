import { describe, expect, it } from "@jest/globals";
import { AdapterInterface, createInterfaceDecorator, MarkerInterface, ObjectInterface, ObjectPrototype, TypeFromInterface, UtilityInterface } from '../src/index'
const Interface = createInterfaceDecorator('test');

describe('Interfaces', function () {
    it('can create ObjectInterface', function () {
        @Interface
        class  IUser extends ObjectInterface {}

        expect(IUser.name).toBe('IUser');
        expect(IUser.interfaceId).not.toBe(undefined);
    });

    it('can create MarkerInterface', function () {
        @Interface
        class IMarker extends MarkerInterface { }


        expect(IMarker.name).toBe('IMarker');
        expect(IMarker.interfaceId).not.toBe(undefined);
    });

    it('can create AdapterInterface', function () {
        @Interface
        class INameAdapter extends AdapterInterface {
            Component(): string { return '' };
        }


        expect(INameAdapter.name).toBe('INameAdapter');
        expect(INameAdapter.interfaceId).not.toBe(undefined);
    });

    it('can create UtilityInterface', function () {
        @Interface
        class INameUtil extends UtilityInterface {
            Component(): string { return '' };
        }


        expect(INameUtil.name).toBe('INameUtil');
        expect(INameUtil.interfaceId).not.toBe(undefined);
    });

    it('can test if an object implements it', function () {
        @Interface
        class  INotImplemented extends ObjectInterface { }

        @Interface
        class  IUser extends ObjectInterface {
            sayHi(): string { return '' };
        }

        type TUser = TypeFromInterface<IUser>;
        class User extends ObjectPrototype<IUser> implements TUser {
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

        expect(IUser.providedBy(user)).toBe(true);
        expect(INotImplemented.providedBy(user)).toBe(false);
    });
});
