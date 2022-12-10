import { describe, expect, it } from "@jest/globals";
import {
  createIdFactory,
  Adapter,
  AdapterInterface,
  AdapterRegistry,
  ObjectInterface,
  ObjectPrototype,
  TypeFromInterface,

} from "../src/index";
const id = createIdFactory('test');

describe('Adapter Registry', function () {

  it('can be created', function () {
    const registry = new AdapterRegistry();

    expect(registry).not.toBe(undefined);
    expect(registry.adapters).not.toBe(undefined);
    expect(typeof registry.registerAdapter).toBe('function');
    expect(typeof registry.getAdapter).toBe('function');
  });

  it("can register adapter by interface", function () {
    const registry = new AdapterRegistry();
    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };
      name: string;
    }
    type TUser = TypeFromInterface<IUser>;
    class User extends ObjectPrototype<TUser> implements TUser {
      readonly __implements__ = [IUser];
      name: string;
      constructor({ name }: TUser) {
        super({ name });
      }
    }

    class INameAdapter extends AdapterInterface {
      get interfaceId() { return id('INameAdapter') };
      Component: () => string;
    }

    class NameAdapter extends Adapter<INameAdapter, IUser> {
      get __implements__() { return INameAdapter };

      __Component__() {
        return this.context.name;
      }
    }
    new NameAdapter({ adapts: IUser, registry });

    const user = new User({ name: 'Julia' });

    const Component = NameAdapter.prototype.for(user, registry) as Function;

    expect(Component()).toBe('Julia');
  });

  it('can get an adapter registered by ObjectPrototype', function () {
    const registry = new AdapterRegistry();
    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };
      name: string;
    }

    type TUser = TypeFromInterface<IUser>;
    class User extends ObjectPrototype<TUser> implements TUser {
      readonly __implements__ = [IUser];
      name: string;
      constructor({ name }: TUser) {
        super({ name });
      }
    }

    class INameAdapter extends AdapterInterface {
      get interfaceId() { return id('INameAdapter') };
      Component: () => string;
    }

    class NameAdapter extends Adapter<INameAdapter, IUser> {
      get __implements__() { return INameAdapter };

      __Component__() {
        return this.context.name;
      }
    }
    new NameAdapter({ adapts: User, registry });

    const user = new User({ name: 'Julia' });

    const Component = NameAdapter.prototype.for(user, registry) as Function;

    expect(Component()).toBe('Julia');
  });

  // it("returns an error when registering an adapter that doesn't implement interface", function() {});
  // it("returns an error when trying to get an adapter that doesn't exist", function() {});
});