import { describe, expect, it } from "@jest/globals";
import {
  AdapterInterface,
  createInterfaceDecorator,
  Adapter,
  AdapterRegistry,
  ObjectInterface,
  ObjectPrototype,
  TypeFromInterface,
} from '../src/index'
import type { TAdapterRegistry } from "../src/index";
const Interface = createInterfaceDecorator('test');

describe('Adapter Factory', function () {
  it('can create an adapter interface', function () {

    @Interface
    class INameAdapter extends AdapterInterface {
      Component(): string { return '' };
    }

    expect(INameAdapter.interfaceId).not.toBe(undefined);
  });

  it('can create an adapter class', function () {
    // class INameAdapter extends AdapterInterface {
    //       //   Component(): string { return ''};
    // }

    @Interface
    class INameAdapter extends AdapterInterface { }

    class NameAdapter extends Adapter {
      static __implements__ = INameAdapter;
    }

    expect(NameAdapter).toBeDefined();
  });

  it('we can create an adapter that adapts interface', function () {
    const registry = new AdapterRegistry() as TAdapterRegistry;
    const { register } = registry;

    @Interface
    class IUser extends ObjectInterface {
      name: string;
    }

    @Interface
    class INameAdapter extends AdapterInterface { }

    class NameAdapter extends Adapter<IUser> {
      static __implements__ = INameAdapter;
      static __adapts__ = IUser;
    }
    register(NameAdapter);

    type TUser = TypeFromInterface<IUser>;
    class User extends ObjectPrototype<TUser> implements TUser {
      readonly __implements__ = [IUser];
      name: string;
    }

    const adapter = new INameAdapter(new User({ name: 'test' }), registry);

    expect(adapter).toBeInstanceOf(NameAdapter);
  });

  it('we can create an adapter that adapts object prototype', function () {
    const registry = new AdapterRegistry() as TAdapterRegistry;
    const { register } = registry;

    @Interface
    class IUser extends ObjectInterface {
      name: string;
    }

    type TUser = TypeFromInterface<IUser>;
    class User extends ObjectPrototype<TUser> implements TUser {
      __implements__ = [IUser];
      name: string;
    }


    @Interface
    class INameAdapter extends AdapterInterface { }

    class NameAdapter extends Adapter<IUser> {
      static __implements__ = INameAdapter;
      static __adapts__ = User;
    }
    register(NameAdapter);

    const adapter = new INameAdapter(new User({ name: 'test' }), registry);

    expect(adapter).toBeInstanceOf(NameAdapter);
  });
});