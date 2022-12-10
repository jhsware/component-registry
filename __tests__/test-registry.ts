import { describe, expect, it, beforeEach } from "@jest/globals";

import {
  globalRegistry as registry,
  LocalRegistry,
  AdapterInterface, createIdFactory, ObjectInterface, TUtility, UtilityInterface, Utility, Adapter, ObjectPrototype, UtilityNotFound
} from "../src";

const id = createIdFactory('test');

describe('Global Registry', function () {
  beforeEach(function () {
    registry.utilities = {}
    registry.adapters = {}
  })

  it('can be created', function () {
    expect(registry).not.toBe(undefined);
  });

  it('can get an unnamed utility', function () {
    class IDummyUtility extends UtilityInterface {
      get interfaceId() { return id('IDummyUtility') };
    }

    class DummyUtility extends Utility {
      get __implements__() { return IDummyUtility };
      constructor({ name, registry }: TUtility) {
        super({ name, registry });
      }
    }

    new DummyUtility({})

    const util = new IDummyUtility();

    expect(util).toBeInstanceOf(DummyUtility);
  });

  it('can get a named utility', function () {
    class IDummyUtility extends UtilityInterface {
      get interfaceId() { return id('IDummyUtility') };
    }

    class DummyUtility extends Utility {
      get __implements__() { return IDummyUtility };
      constructor({ name, registry }: TUtility) {
        super({ name, registry });
      }
    }

    new DummyUtility({ name: 'basic' });

    const util = new IDummyUtility('basic');

    expect(util).toBeInstanceOf(DummyUtility);
  });

  it('can get the correct named utility', function () {
    class IDummyUtility extends UtilityInterface {
      get interfaceId() { return id('IDummyUtility') };
    }

    class DummyUtility extends Utility {
      get __implements__() { return IDummyUtility };
      constructor({ name, registry }: TUtility) {
        super({ name, registry });
      }
    }

    const me = new DummyUtility({ name: 'basic' });
    const notMe = new DummyUtility({ name: 'not me' });

    const util = new IDummyUtility('basic');

    expect(util).toBe(me);
    expect(util).not.toBe(notMe);
  });

  // it("returns 'undefined' if named utility isn't found and we have passed true at end", function() {
  //             class IDummyUtility extends ObjectInterface {
  //     get interfaceId() { return id('IDummyUtility') };
  // }

  //     const DummyUtility_1 = new Utility({
  //         __implements__ IDummyUtility,
  //         name: 'one'
  //     });

  //     const utils = registry.getUtility(IDummyUtility, 'two', undefined);

  //     expect(utils).toBe(undefined);
  // });

  it('can register adapter with convenience method', function () {
    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };
    }


    class IUserAdapter extends AdapterInterface {
      get interfaceId() { return id('IUserAdapter') };
    }

    class UserAdapter extends Adapter<IUserAdapter, IUser> {
      get __implements__() { return IUserAdapter };
    }

    new UserAdapter({ adapts: IUser })

    class User extends ObjectPrototype<any> {
      readonly __implements__ = [IUser];
    }

    const theUser = new User();

    const ua = new IUserAdapter(theUser);

    expect(ua).toBeInstanceOf(UserAdapter);
  });

  it('can get an adapter registered by interface', function () {
    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };

    }

    class IUserAdapter extends AdapterInterface {
      get interfaceId() { return id('IUserAdapter') };
    }

    class UserAdapter extends Adapter<IUserAdapter, IUser> {
      get __implements__() { return IUserAdapter };
    }

    new UserAdapter({ adapts: IUser })

    class User extends ObjectPrototype<any> {
      __implements__ = [IUser];
    }
    const theUser = new User();

    const ua = new IUserAdapter(theUser);

    expect(ua).toBeInstanceOf(UserAdapter);
  });

  it('can get an adapter by specifying the adaptsInterface param', function () {
    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };
    }

    class IStrong extends ObjectInterface {
      get interfaceId() { return id('IStrong') };
    }

    class User extends ObjectPrototype<any> {
      __implements__ = [IUser, IStrong];
    }

    class IUserAdapter extends AdapterInterface {
      get interfaceId() { return id('IUserAdapter') };
    }
    class UserAdapter extends Adapter<IUserAdapter, IUser> {
      get __implements__() { return IUserAdapter };
    }
    new UserAdapter({ adapts: IStrong })

    const theUser = new User();

    const ua = registry.getAdapter(theUser, IUserAdapter);

    expect(ua).toBeInstanceOf(UserAdapter);
  });

  it('can get an adapter registered by object', function () {
    class User extends ObjectPrototype<any> {

    }

    class IUserAdapter extends AdapterInterface {
      get interfaceId() { return id('IUserAdapter') };
    }

    class UserAdapter extends Adapter<IUserAdapter, User> {
      get __implements__() { return IUserAdapter };
    }
    new UserAdapter({ adapts: User, registry })

    const theUser = new User();

    const ua = new IUserAdapter(theUser, registry);

    expect(ua).toBeInstanceOf(UserAdapter);
  });


  it('can get an adapter registered by interface by providing interface', function () {
    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };
    }

    class IUserAdapter extends AdapterInterface {
      get interfaceId() { return id('IUserAdapter') };
    }

    class UserAdapter extends Adapter<IUserAdapter, IUser> {
      get __implements__() { return IUserAdapter };
    }
    new UserAdapter({ adapts: IUser, registry })

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
    class IDummyUtility extends UtilityInterface {
      get interfaceId() { return id('IDummyUtility') };
    }

    class DummyUtility extends Utility implements Omit<IDummyUtility, 'interfaceId'> {
      get __implements__() { return IDummyUtility };
      constructor({ name, registry }: TUtility) {
        super({ name, registry });
      }
    }

    const util = new DummyUtility({ registry });

    expect(util).toBeInstanceOf(DummyUtility);
  });

  it('no leaking to second registry', function () {
    const localRegistry = new LocalRegistry();
    const localRegistry2 = new LocalRegistry();

    class IDummyUtility extends UtilityInterface {
      get interfaceId() { return id('IDummyUtility') };
    }

    class DummyUtility extends Utility implements Omit<IDummyUtility, 'interfaceId'> {
      get __implements__() { return IDummyUtility };
      constructor({ name, registry }: TUtility) {
        super({ name, registry });
      }
    }
    new DummyUtility({ registry: localRegistry });

    const util = new IDummyUtility(localRegistry);
    const util2 = new IDummyUtility(localRegistry2);

    expect(util).toBeInstanceOf(DummyUtility);
    expect(util2).toBeInstanceOf(UtilityNotFound);
  });

  it('no leaking to global registry', function () {
    const localRegistry = new LocalRegistry()
    class IDummyUtility extends UtilityInterface {
      get interfaceId() { return id('IDummyUtility') };
    }

    class DummyUtility extends Utility implements Omit<IDummyUtility, 'interfaceId'> {
      get __implements__() { return IDummyUtility };
      constructor({ name, registry }: TUtility) {
        super({ name, registry });
      }
    }
    new DummyUtility({ registry: localRegistry });

    const util = new IDummyUtility(localRegistry);
    const util2 = new IDummyUtility();

    expect(util).toBeInstanceOf(DummyUtility);
    expect(util2).toBeInstanceOf(UtilityNotFound);
  });
});
