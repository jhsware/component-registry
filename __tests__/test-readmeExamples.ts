import { describe, expect, it, beforeEach } from "@jest/globals";
import { Adapter, AdapterInterface, createIdFactory, globalRegistry, ObjectInterface, ObjectPrototype, TAdapter } from "../src";

class consoleMock {
  logResult;

  log(inp) {
    this.logResult = inp
  }
}

describe('Readme Examples', function() {
  beforeEach(function () {
    globalRegistry.adapters = {}
  })

  it('Sample Code', function() {
    let console = new consoleMock()

    const id = createIdFactory('test');

    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };
      name: string;
    }

    class IDisplayWidget extends AdapterInterface {
      get interfaceId() { return id('IDisplayWidget') };
      render(): void { return };
    }
    // We don't need implements because adapter is looked up using the interface
    class DisplayWidget extends Adapter {
      get __implements__() { return IDisplayWidget };
      constructor({ adapts, render, registry }: Omit<IDisplayWidget, 'interfaceId'> & TAdapter) {
        super({ adapts, render, registry });
      }
    }

    // Create an adapter for IUser
    new DisplayWidget({
      adapts: IUser,
      render () {
        console.log(`My name is ${this.context.name}`)
      }
    })

    type TUser = Omit<IUser, 'interfaceId' | 'providedBy'>;
    class User extends ObjectPrototype<Omit<TUser, 'sayHi'>> implements TUser {
        readonly __implements__ = [IUser];
        name: string;
        constructor({ name }: Omit<TUser, 'sayHi'>) {
            super({ name });
        }
    }

    const user = new User({ name: 'Julia' })

    new IDisplayWidget(user).render()
    // [console]$ I am a User
    
    expect(console.logResult).toBe('My name is Julia');
  });
})

