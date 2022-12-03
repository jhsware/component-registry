import { describe, expect, it } from "@jest/globals";
import { TAdapter, TAdapterRegistry } from "../dist/types.js";
import {
    createIdFactory,
    Adapter,
    AdapterInterface,
    AdapterRegistry,
    ObjectInterface,
    ObjectPrototype,

} from "../src/index";
const id = createIdFactory('test');

describe('Adapter Registry', function() {

    it('can be created', function() {        
        const registry = new AdapterRegistry();
        
        expect(registry).not.toBe(undefined);
    });
    
    it("make sure we can register, lookup and call methods on the adapter", function () {
        const registry = new AdapterRegistry() as TAdapterRegistry;
        class IUser extends ObjectInterface {
          readonly interfaceId = id('IUser');
          name: string;
        }
        type TUser = Omit<IUser, 'interfaceId' | 'providedBy'>;
        class User extends ObjectPrototype<TUser> implements TUser {
          readonly __implements__ = [IUser];
          name: string;
          constructor ({ name }: TUser) {
            super({ name });
          }
        }
    
        class INameAdapter extends AdapterInterface {
          readonly interfaceId = id('INameAdapter');
          Component(): string { return };
        }
        // We don't need implements because adapter is looked up using the interface
        class NameAdapter extends Adapter {
          readonly __implements__ = INameAdapter;
          constructor({ adapts, Component, registry }: Omit<INameAdapter, 'interfaceId'> & TAdapter) {
            super({ adapts, Component, registry });
          }
        }
    
        const adapter = new NameAdapter({
          adapts: IUser,
          Component() {
            return this.context.name;
          },
          registry,
        })
    
        const user = new User({ name: 'Julia' });
    
        const outp = new INameAdapter(user).Component();
    
        expect(outp).toBe('Julia');
      });

    // it('can register adapter with custom registry', function() {
    //     const registry = new AdapterRegistry();
        
    //     const IUser = new Interface({name: "IUser"});
        
    //     const IUserAdapter = new Interface({name: "IUserAdapter"});
        
    //     const UserAdapter = new Adapter({
    //         registry: registry,
    //         implements: IUserAdapter,
    //         adapts: IUser
    //     })
        
    //     const UserPrototype = createObjectPrototype({
    //         implements: [IUser]
    //     });
        
    //     const theUser = new UserPrototype();
        
    //     const ua = new IUserAdapter(theUser, { registry: registry });

    //     expect(ua).toBeInstanceOf(UserAdapter);
    // });

    // it('can get adapter with custom registry using registry.getAdapter', function() {
    //     const registry = new AdapterRegistry();
        
    //     const IUser = new Interface({name: "IUser"});
        
    //     const IUserAdapter = new Interface({name: "IUserAdapter"});
        
    //     const UserAdapter = new Adapter({
    //         registry: registry,
    //         implements: IUserAdapter,
    //         adapts: IUser
    //     })
        
    //     const UserPrototype = createObjectPrototype({
    //         implements: [IUser]
    //     });
        
    //     const theUser = new UserPrototype();
        
    //     const ua = registry.getAdapter(theUser, IUserAdapter);

    //     expect(ua).toBeInstanceOf(UserAdapter);
    // });
    
    // it('can get an adapter registered by interface', function() {
    //     const registry = new AdapterRegistry();
        
    //     const IUser = new Interface({name: "IUser"});
        
    //     const IUserAdapter = new Interface({name: "IUserAdapter"});
        
    //     const UserAdapter = new Adapter({
    //         registry: registry,
    //         implements: IUserAdapter,
    //         adapts: IUser
    //     })
        
        
    //     const UserPrototype = createObjectPrototype({
    //         implements: [IUser]
    //     });
        
    //     const theUser = new UserPrototype();
        
    //     const ua = new IUserAdapter(theUser, { registry: registry });

    //     expect(ua).toBeInstanceOf(UserAdapter);
    // });
    
    // it('can get an adapter by specifying the adaptsInterface param', function() {
    //     const registry = new AdapterRegistry();
        
    //     const IUser = new Interface({name: "IUser"});
        
    //     const IStrong = new Interface({name: "IStrong"});
        
    //     const IUserAdapter = new Interface({name: "IUserAdapter"});
        
    //     const StrongAdapter = new Adapter({
    //         registry: registry,
    //         implements: IUserAdapter,
    //         adapts: IStrong
    //     })
        
        
    //     const UserPrototype = createObjectPrototype({
    //         implements: [IUser, IStrong]
    //     });
        
    //     const theUser = new UserPrototype();
        
    //     // TODO: Do we want to keep this? How about short form?
    //     const ua = registry.getAdapter(theUser, IUserAdapter, IStrong);

    //     expect(ua).toBeInstanceOf(StrongAdapter);
    // });
    
    // it('can get an adapter registered by object', function() {
    //     const registry = new AdapterRegistry();
        
    //     const UserPrototype = createObjectPrototype({});
        
    //     const IUserAdapter = new Interface({name: "IUserAdapter"});
        
    //     const UserAdapter = new Adapter({
    //         registry: registry,
    //         implements: IUserAdapter,
    //         adapts: UserPrototype
    //     })
        
    //     const theUser = new UserPrototype();
        
    //     const ua = new IUserAdapter(theUser, { registry: registry });
        
    //     expect(ua).toBeInstanceOf(UserAdapter);
    // });
    
    
    // it('can get an adapter registered by interface by providing interface', function() {
    //     const registry = new AdapterRegistry();
        
    //     const IUser = new Interface({name: "IUser"});
        
    //     const IUserAdapter = new Interface({name: "IUserAdapter"});
        
    //     const UserAdapter = new Adapter({
    //         registry: registry,
    //         implements: IUserAdapter,
    //         adapts: IUser
    //     })
        
    //     // TODO: This looks pretty useless, should we support this?
    //     const ua = registry.getAdapter(IUser, IUserAdapter);

    //     expect(ua).toBeInstanceOf(UserAdapter);
    // });
    
    // it("returns an error when registering an adapter that doesn't implement interface", function() {});
    // it("returns an error when trying to get an adapter that doesn't exist", function() {});
    
    // it('can get an adapter for inherited prototype', function() {
    //     const registry = new AdapterRegistry();
        
    //     const IBase = new Interface({name: "IBase"});
        
    //     const BasePrototype = createObjectPrototype({
    //         implements: [IBase],
    //     });
        
    //     const IListWidget = new Interface({name: "IListWidget"});
        
    //     const BaseListWidget = new Adapter({
    //         registry: registry,
    //         implements: IListWidget,
    //         adapts: IBase
    //     })
        
    //     const UserPrototype = createObjectPrototype({
    //         extends: [BasePrototype]
    //     });
        
    //     const theUser = new UserPrototype();
        
    //     const listWidget = new IListWidget(theUser, { registry: registry });

    //     expect(listWidget).toBeInstanceOf(BaseListWidget);
    // });
    
    // it('can get an adapter for specific prototype', function() {
    //     const registry = new AdapterRegistry();
        
    //     const IBase = new Interface({name: 'IBase'});
        
    //     const BasePrototype = createObjectPrototype({
    //         implements: [IBase],
    //     });
        
    //     const IListWidget = new Interface({name: 'IListWidget'});
        
    //     const BaseListWidget = new Adapter({
    //         registry: registry,
    //         implements: IListWidget,
    //         adapts: IBase
    //     })
        
    //     const IUser = new Interface({name: 'IUser'});
        
    //     const UserPrototype = createObjectPrototype({
    //         extends: [BasePrototype],
    //         implements: [IUser]
    //     });
        
    //     const UserListWidget = new Adapter({
    //         registry: registry,
    //         implements: IListWidget,
    //         adapts: IUser
    //     })
        
    //     const theUser = new UserPrototype();
        
    //     const listWidget = new IListWidget(theUser, { registry: registry });

    //     expect(listWidget).toBeInstanceOf(UserListWidget);
    //     expect(listWidget).not.toBeInstanceOf(BaseListWidget);
    // });
    
});