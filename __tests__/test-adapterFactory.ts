import { describe, expect, it } from "@jest/globals";
import {
  AdapterInterface,
  createIdFactory,
  Adapter,
  AdapterRegistry,
  Interface,
  ObjectInterface,
  ObjectPrototype
} from '../src/index'
import type { TAdapter, TAdapterRegistry } from "../src/index";
const id = createIdFactory('test');

describe('Adapter Factory', function () {
  it('can create an adapter interface', function () {
    class INameAdapter extends AdapterInterface {
      get interfaceId() { return id('INameAdapter') };
      Component(): string { return };
    }

    expect(INameAdapter.prototype.interfaceId).not.toBe(undefined);
  });

  it('can create an adapter class', function () {
    class INameAdapter extends AdapterInterface {
      get interfaceId() { return id('INameAdapter') };
      Component(): string { return };
    }

    // We don't need implements because adapter is looked up using the interface
    class NameAdapter extends Adapter {
      get __implements__() { return INameAdapter };
      constructor({ adapts, Component, registry }: Omit<INameAdapter, 'interfaceId'> & TAdapter) {
        super({ adapts, Component, registry });
      }
    }

    expect(NameAdapter.prototype.__implements__.prototype.interfaceId).toBe(INameAdapter.prototype.interfaceId);
  });

  it('we can create an adapter that adapts interface', function () {
    const registry = new AdapterRegistry() as TAdapterRegistry;
    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };
      name: string;
    }

    class INameAdapter extends AdapterInterface {
      get interfaceId() { return id('INameAdapter') };
      Component(): string { return };
    }
    // We don't need implements because adapter is looked up using the interface
    class NameAdapter extends Adapter {
      get __implements__() { return INameAdapter };
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

    expect(adapter).toBeInstanceOf(NameAdapter);
  });

  it('we can create an adapter that adapts object prototype', function () {
    const registry = new AdapterRegistry() as TAdapterRegistry;
    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };
      name: string;
    }
    type TUser = Omit<IUser, 'interfaceId' | 'providedBy'>;
    class User extends ObjectPrototype<TUser> implements TUser {
      __implements__ = [IUser];
      name: string;
      constructor({ name }: TUser) {
        super({ name });
      }
    }

    class INameAdapter extends AdapterInterface {
      get interfaceId() { return id('INameAdapter') };
      Component(): string { return };
    }
    // We don't need implements because adapter is looked up using the interface
    class NameAdapter extends Adapter {
      get __implements__() { return INameAdapter };
      constructor({ adapts, Component, registry }: Omit<INameAdapter, 'interfaceId'> & TAdapter) {
        super({ adapts, Component, registry });
      }
    }

    const adapter = new NameAdapter({
      adapts: User,
      Component() {
        return this.context.name;
      },
      registry,
    })

    expect(adapter).toBeInstanceOf(NameAdapter);
  });
});