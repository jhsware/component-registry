import { describe, expect, it } from "@jest/globals";
import {
  createInterfaceDecorator,
  Adapter,
  AdapterInterface,
  AdapterRegistry,
  ObjectInterface,
  ObjectPrototype,
  TypeFromInterface,
  TAdapterRegistry,

} from "../src/index";
const Interface = createInterfaceDecorator('test');

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
    const { register } = registry;

    @Interface
    class IUser extends ObjectInterface {
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

    @Interface
    class INameAdapter extends AdapterInterface {
      Component: () => string;
    }

    @register
    class NameAdapter extends Adapter<IUser> {
      static __implements__ = INameAdapter;
      static __adapts__ = IUser;

      __Component__(user: IUser) {
        return user.name;
      }
    }

    const user = new User({ name: 'Julia' });

    const Component = new INameAdapter(user, registry);

    expect((Component as any)(user)).toBe('Julia');
    expect(Component).toEqual(NameAdapter.prototype.__Component__);
  });

  it('can get an adapter registered by ObjectPrototype', function () {
    const registry = new AdapterRegistry();
    const { register } = registry;

    @Interface
    class IUser extends ObjectInterface {
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

    @Interface
    class INameAdapter extends AdapterInterface {
      Component: () => string;
    }

    @register
    class NameAdapter extends Adapter<User> {
      static __implements__ = INameAdapter;
      static __adapts__ = User;

      __Component__(user: IUser) {
        return user.name;
      }
    }

    const user = new User({ name: 'Julia' });

    const Component = new INameAdapter(user, registry);

    expect((Component as any)(user)).toBe('Julia');
  });

  // it("returns an error when registering an adapter that doesn't implement interface", function() {});
  // it("returns an error when trying to get an adapter that doesn't exist", function() {});

  it('adapter registry sets context', function () {
    const registry = new AdapterRegistry() as TAdapterRegistry;
    const { register } = registry;

    @Interface
    class IUser extends ObjectInterface {
      name: string;
    }

    @Interface
    class INameAdapter extends AdapterInterface { }

    @register
    class NameAdapter extends Adapter<IUser> {
      static __implements__ = INameAdapter;
      static __adapts__ = IUser;
    }

    type TUser = TypeFromInterface<IUser>;
    class User extends ObjectPrototype<TUser> implements TUser {
      __implements__ = [IUser];
      name: string;
    }

    const user = new User({ name: 'test' });
    const adapter = new INameAdapter(user, registry);

    expect(adapter.context).toEqual(user);
  });
});