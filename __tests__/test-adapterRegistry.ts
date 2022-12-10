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
    type TUser = Omit<IUser, 'interfaceId' | 'providedBy'>;
    class User extends ObjectPrototype<TUser> implements TUser {
      readonly __implements__ = [IUser];
      name: string;
      constructor({ name }: TUser) {
        super({ name });
      }
    }

    class INameAdapter extends AdapterInterface {
      get interfaceId() { return id('INameAdapter') };
      Component(): string { return '' };
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

    const user = new User({ name: 'Julia' });

    const outp = new INameAdapter(user, registry).Component();

    expect(outp).toBe('Julia');
  });

  it('can get an adapter registered by ObjectPrototype', function () {
    const registry = new AdapterRegistry();
    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };
      name: string;
    }
    type TUser = Omit<IUser, 'interfaceId' | 'providedBy'>;

    class User extends ObjectPrototype<TUser> implements TUser {
      readonly __implements__ = [IUser];
      name: string;
      constructor({ name }: TUser) {
        super({ name });
      }
    }

    class INameAdapter extends AdapterInterface {
      get interfaceId() { return id('INameAdapter') };
      Component(): string { return '' };
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

    const user = new User({ name: 'Julia' });

    const outp = new INameAdapter(user, registry).Component();

    expect(outp).toBe('Julia');
  });

  // it("returns an error when registering an adapter that doesn't implement interface", function() {});
  // it("returns an error when trying to get an adapter that doesn't exist", function() {});
});