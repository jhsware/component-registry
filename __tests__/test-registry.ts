import { describe, expect, it, beforeEach } from "@jest/globals";

import {
    globalRegistry as registry,
    LocalRegistry,
    createInterfaceClass,
    Adapter,
    Utility,
    createObjectPrototype } from '../dist/index.cjs.js'

const Interface = createInterfaceClass('test')

describe('Global Registry', function() {
    beforeEach(function () {
        registry.utilities = {}
        registry.adapters = {}
    })

    it('can be created', function() {
        expect(registry).not.toBe(undefined);
    });

    it('can get an unnamed utility', function() {
        const IDummyUtility = new Interface({name: "IDummyUtility"});
        
        const DummyUtility = new Utility({
            implements: IDummyUtility
        });
        
        const util = new IDummyUtility();
        
        expect(util).toBeInstanceOf(DummyUtility);
    });
    
    it('can get a named utility', function() {
        const IDummyUtility = new Interface({name: "IDummyUtility"});
        
        const DummyUtility = new Utility({
            implements: IDummyUtility,
            name: 'basic'
        });
        
        const util = new IDummyUtility('basic');
        
        expect(util).toBeInstanceOf(DummyUtility);
    });
    
    it('can get the correct named utility', function() {
        const IDummyUtility = new Interface({name: "IDummyUtility"});
        
        const DummyUtility = new Utility({
            implements: IDummyUtility,
            name: 'basic'
        });
        
        const NotMeUtility = new Utility({
            implements: IDummyUtility,
            name: 'not me'
        });
        
        const util = new IDummyUtility('basic');
        
        expect(util).toBeInstanceOf(DummyUtility);
        expect(util).not.toBeInstanceOf(NotMeUtility);
    });
    
    it("returns 'undefined' if named utility isn't found and we have passed true at end", function() {
        const IDummyUtility = new Interface({name: "IDummyUtility"});
        
        const DummyUtility_1 = new Utility({
            implements: IDummyUtility,
            name: 'one'
        });
        
        const utils = registry.getUtility(IDummyUtility, 'two', undefined);
        
        expect(utils).toBe(undefined);
    });
    
    it('can register adapter with convenience method', function() {
        const IUser = new Interface({name: "IUser"});
        
        const IUserAdapter = new Interface({name: "IUserAdapter"});
        
        const UserAdapter = new Adapter({
            implements: IUserAdapter,
            adapts: IUser
        })
        
        const UserPrototype = createObjectPrototype({
            implements: [IUser]
        });
        
        const theUser = new UserPrototype();
        
        const ua = new IUserAdapter(theUser);

        expect(ua).toBeInstanceOf(UserAdapter);
    });
    
    it('can get an adapter registered by interface', function() {
        const IUser = new Interface({name: "IUser"});
        
        const IUserAdapter = new Interface({name: "IUserAdapter"});
        
        const UserAdapter = new Adapter({
            implements: IUserAdapter,
            adapts: IUser
        })
        
        const UserPrototype = createObjectPrototype({
            implements: [IUser]
        });
        
        const theUser = new UserPrototype();
        
        const ua = new IUserAdapter(theUser);

        expect(ua).toBeInstanceOf(UserAdapter);
    });
    
    it('can get an adapter by specifying the adaptsInterface param', function() {
        const IUser = new Interface({name: "IUser"});
        
        const IStrong = new Interface({name: "IStrong"});
        
        const IUserAdapter = new Interface({name: "IUserAdapter"});
        
        const StrongAdapter = new Adapter({
            implements: IUserAdapter,
            adapts: IStrong
        })
        
        const UserPrototype = createObjectPrototype({
            implements: [IUser, IStrong]
        });
        
        const theUser = new UserPrototype();
        
        const ua = registry.getAdapter(theUser, IUserAdapter, IStrong);

        expect(ua).toBeInstanceOf(StrongAdapter);
    });
    
    it('can get an adapter registered by object', function() {
        const UserPrototype = createObjectPrototype({});
        
        const IUserAdapter = new Interface({name: "IUserAdapter"});
        
        const UserAdapter = new Adapter({
            implements: IUserAdapter,
            adapts: UserPrototype
        })
        
        const theUser = new UserPrototype();
        
        const ua = new IUserAdapter(theUser);
        
        expect(ua).toBeInstanceOf(UserAdapter);
    });
    
    
    it('can get an adapter registered by interface by providing interface', function() {
        const IUser = new Interface({name: "IUser"});
        
        const IUserAdapter = new Interface({name: "IUserAdapter"});
        
        const UserAdapter = new Adapter({
            implements: IUserAdapter,
            adapts: IUser
        })
        
        // TODO: This is pretty useless, should we support it?
        const ua = registry.getAdapter(IUser, IUserAdapter);

        expect(ua).toBeInstanceOf(UserAdapter);
    });
    
    it('can get an adapter for specific prototype', function() {
        const IBase = new Interface({name: 'IBase'});
        
        const BasePrototype = createObjectPrototype({
            implements: [IBase],
        });
        
        const IListWidget = new Interface({name: 'IListWidget'});
        
        const BaseListWidget = new Adapter({
            implements: IListWidget,
            adapts: IBase
        })
        
        const IUser = new Interface({name: 'IUser'});
        
        const UserPrototype = createObjectPrototype({
            extends: [BasePrototype],
            implements: [IUser]
        });
        
        const UserListWidget = new Adapter({
            implements: IListWidget,
            adapts: IUser
        })
        
        const theUser = new UserPrototype();
        
        const listWidget = new IListWidget(theUser);

        expect(listWidget).toBeInstanceOf(UserListWidget);
        expect(listWidget).not.toBeInstanceOf(BaseListWidget);
    });
});

describe('Local Registry', function() {

  it('can be created', function() {
      const registry = new LocalRegistry()
      expect(registry).not.toBe(undefined);
  });

  it('can get an unnamed utility', function() {
    const registry = new LocalRegistry()
    const IDummyUtility = new Interface({name: "IDummyUtility"});
    
    const DummyUtility = new Utility({
        registry,
        implements: IDummyUtility
    });
    
    const util = new IDummyUtility({ registry });
    
    expect(util).toBeInstanceOf(DummyUtility);
  });

  it('no leaking to second registry', function() {
    const localRegistry = new LocalRegistry()
    const IDummyUtility = new Interface({name: "IDummyUtility"});
    
    const DummyUtility = new Utility({
        registry: localRegistry,
        implements: IDummyUtility
    });

    const localRegistry2 = new LocalRegistry()
    
    const util = new IDummyUtility({ registry: localRegistry });
    const util2 = localRegistry2.getUtilities(IDummyUtility);
    
    expect(util).toBeInstanceOf(DummyUtility);
    expect(util2.length).toEqual(0);
  });

  it('no leaking to global registry', function() {
    const localRegistry = new LocalRegistry()
    const IDummyUtility = new Interface({name: "IDummyUtility"});
    
    const DummyUtility = new Utility({
        registry: localRegistry,
        implements: IDummyUtility
    });
    
    const util = new IDummyUtility({ registry: localRegistry });
    const util2 = registry.getUtilities(IDummyUtility);
    
    expect(util).toBeInstanceOf(DummyUtility);
    expect(util2.length).toEqual(0);
  });
});
