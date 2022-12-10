import { describe, expect, it } from "@jest/globals";
import {
  AdapterInterface,
  createIdFactory,
  Adapter,
  AdapterRegistry,
  Interface,
  ObjectInterface,
  ObjectPrototype,
  TypeFromInterface
} from '../src/index'
import type { TAdapterRegistry } from "../src/index";
const id = createIdFactory('test');

describe('Adapter Factory', function () {
  it('can create an adapter interface', function () {
    class INameAdapter extends AdapterInterface {
      get interfaceId() { return id('INameAdapter') };
      Component(): string { return '' };
    }

    expect(INameAdapter.prototype.interfaceId).not.toBe(undefined);
  });

  it('can create an adapter class', function () {
    // class INameAdapter extends AdapterInterface {
    //   get interfaceId() { return id('INameAdapter') };
    //   Component(): string { return ''};
    // }

    class INameAdapter extends AdapterInterface {
      get interfaceId() { return id('INameAdapter') };
    }

    class NameAdapter extends Adapter<INameAdapter, any> {
      get __implements__() { return INameAdapter };
    }

    expect(NameAdapter).toBeDefined();
  });

  it('we can create an adapter that adapts interface', function () {
    const registry = new AdapterRegistry() as TAdapterRegistry;
    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };
      name: string;
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

    const adapter = new NameAdapter({ adapts: IUser, registry });

    expect(adapter).toBeInstanceOf(NameAdapter);
  });

  it('we can create an adapter that adapts object prototype', function () {
    const registry = new AdapterRegistry() as TAdapterRegistry;
    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };
      name: string;
    }
    // type TUser = TypeFromInterface<IUser>;
    // class User extends ObjectPrototype<TUser> implements TUser {
    //   __implements__ = [IUser];
    //   name: string;
    //   constructor({ name }: TUser) {
    //     super({ name });
    //   }
    // }

    class INameAdapter extends AdapterInterface {
      get interfaceId() { return id('INameAdapter') };
      __Component__: () => string;
    }

    class NameAdapter extends Adapter<INameAdapter, IUser> {
      get __implements__() { return INameAdapter };

      __Component__() {
        return this.context.name;
      }
    }
    const adapter = new NameAdapter({ adapts: IUser, registry });

    expect(adapter).toBeInstanceOf(NameAdapter);
  });
});