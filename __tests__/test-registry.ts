import { describe, expect, it, beforeEach } from "@jest/globals";

import {
  globalRegistry as registry,
  LocalRegistry,
  AdapterInterface, createInterfaceDecorator, ObjectInterface, UtilityInterface, Utility, Adapter, ObjectPrototype, UtilityNotFound, globalRegistry
} from "../src";

const Interface = createInterfaceDecorator('test');

describe('Global Registry', function () {
  beforeEach(function () {
    registry.utilities = {}
    registry.adapters = {}
  })

  it('can be created', function () {
    expect(registry).not.toBe(undefined);
  });

  it('can get an unnamed utility', function () {
    @Interface
    class IDummyUtility extends UtilityInterface {
    }

    class DummyUtility extends Utility implements IDummyUtility {
      static __implements__ = IDummyUtility;
    }
    registry.register(DummyUtility);

    const util = new IDummyUtility();

    expect(util).toBeInstanceOf(DummyUtility);
  });

  it('can get a named utility', function () {
    @Interface
    class IDummyUtility extends UtilityInterface {
    }

    class DummyUtility extends Utility implements IDummyUtility {
      static __implements__ = IDummyUtility;
      static __name__ = 'basic';
    }
    registry.register(DummyUtility);

    const util = new IDummyUtility('basic');

    expect(util).toBeInstanceOf(DummyUtility);
  });

  it('can get the correct named utility', function () {
    @Interface
    class IDummyUtility extends UtilityInterface {
    }

    class DummyUtilityBasic extends Utility implements IDummyUtility {
      static __implements__ = IDummyUtility;
      static __name__ = 'basic';
    }
    registry.register(DummyUtilityBasic);
    
    class DummyUtilityNotMe extends Utility implements IDummyUtility {
      static __implements__ = IDummyUtility;
      static __name__ = 'not me';
    }
    registry.register(DummyUtilityNotMe);

    const util = new IDummyUtility('basic');

    expect(util).toBeInstanceOf(DummyUtilityBasic);
    expect(util).not.toBeInstanceOf(DummyUtilityNotMe);
  });

  // it("returns 'undefined' if named utility isn't found and we have passed true at end", function() {
  //             @Interface
  // @Interface
  //      class  IDummyUtility extends ObjectInterface {
  //       // }

  //     class DummyUtility_1 extends Utility implements  {
  //         __implements__ IDummyUtility,
  //         name: 'one'
  //     });

  //     const utils = registry.getUtility(IDummyUtility, 'two', undefined);

  //     expect(utils).toBe(undefined);
  // });

  it('can register adapter with convenience method', function () {
    @Interface
    class IUser extends ObjectInterface {
    }


    @Interface
    class IUserAdapter extends AdapterInterface {
    }

    class UserAdapter extends Adapter<IUser> {
      static __implements__ = IUserAdapter;
      static __adapts__ = IUser;
    }
    registry.register(UserAdapter);

    class User extends ObjectPrototype<any> {
      readonly __implements__ = [IUser];
    }

    const theUser = new User();

    const ua = new IUserAdapter(theUser);

    expect(ua).toBeInstanceOf(UserAdapter);
  });

  it('can get an adapter registered by interface', function () {
    @Interface
    class IUser extends ObjectInterface {

    }
    @Interface
    class IUserAdapter extends AdapterInterface {
    }

    class UserAdapter extends Adapter<IUser> {
      static __implements__ = IUserAdapter;
      static __adapts__ = IUser;
    }
    registry.register(UserAdapter);

    class User extends ObjectPrototype<any> {
      __implements__ = [IUser];
    }
    const theUser = new User();

    const ua = new IUserAdapter(theUser);

    expect(ua).toBeInstanceOf(UserAdapter);
  });

  it('can get an adapter by specifying the adaptsInterface param', function () {
    @Interface
    class IUser extends ObjectInterface {
    }

    @Interface
    class IStrong extends ObjectInterface {
    }

    class User extends ObjectPrototype<any> {
      __implements__ = [IUser, IStrong];
    }
    @Interface
    class IUserAdapter extends AdapterInterface {
    }

    class UserAdapter extends Adapter<IUser> {
      static __implements__ = IUserAdapter;
      static __adapts__ = IStrong;
    }
    registry.register(UserAdapter);

    const theUser = new User();

    const ua = registry.getAdapter(theUser, IUserAdapter);

    expect(ua).toBeInstanceOf(UserAdapter);
  });

  it('can get an adapter registered by object', function () {
    class User extends ObjectPrototype<any> {

    }
    @Interface
    class IUserAdapter extends AdapterInterface {
    }

    class UserAdapter extends Adapter<User> {
      static __implements__ = IUserAdapter;
      static __adapts__ = User;
    }
    registry.register(UserAdapter);

    const theUser = new User();

    const ua = new IUserAdapter(theUser, registry);

    expect(ua).toBeInstanceOf(UserAdapter);
  });


  it('can get an adapter registered by interface by providing interface', function () {
    @Interface
    class IUser extends ObjectInterface {
    }
    @Interface
    class IUserAdapter extends AdapterInterface {
    }

    class UserAdapter extends Adapter<IUser> {
      static __implements__ = IUserAdapter;
      static __adapts__ = IUser;
    }
    registry.register(UserAdapter);

    // TODO: This is pretty useless, should we support it?
    const ua = registry.getAdapter(IUser, IUserAdapter);

    expect(ua).toBeInstanceOf(UserAdapter);
  });
});

describe('Local Registry', function () {

  it('can be created', function () {
    const registry = new LocalRegistry()
    expect(registry).not.toBe(undefined);
  });

  it('can get an unnamed utility', function () {
    const registry = new LocalRegistry()
    @Interface
    class IDummyUtility extends UtilityInterface {
    }

    class DummyUtility extends Utility implements IDummyUtility {
      static __implements__ = IDummyUtility;
    }
    registry.register(DummyUtility);

    const util = new IDummyUtility(registry);

    expect(util).toBeInstanceOf(DummyUtility);
  });

  it('no leaking to second registry', function () {
    const localRegistry = new LocalRegistry();
    const localRegistry2 = new LocalRegistry();
    @Interface
    class IDummyUtility extends UtilityInterface {
    }

    class DummyUtility extends Utility implements IDummyUtility {
      static __implements__ = IDummyUtility;
    }
    localRegistry.register(DummyUtility);

    const util = new IDummyUtility(localRegistry);
    const util2 = new IDummyUtility(localRegistry2);

    expect(util).toBeInstanceOf(DummyUtility);
    expect(util2).toBeInstanceOf(UtilityNotFound);
  });

  it('no leaking to global registry', function () {
    const localRegistry = new LocalRegistry()

    @Interface
    class IDummyUtility extends UtilityInterface {
    }

    class DummyUtility extends Utility implements IDummyUtility {
      static __implements__ = IDummyUtility;
    }
    localRegistry.register(DummyUtility);

    const util = new IDummyUtility(localRegistry);
    const util2 = new IDummyUtility();

    expect(util).toBeInstanceOf(DummyUtility);
    expect(util2).toBeInstanceOf(UtilityNotFound);
  });
});
