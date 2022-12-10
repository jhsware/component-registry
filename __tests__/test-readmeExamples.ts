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

  it('Sample Code', async function() {
    let console = new consoleMock()

    // We need an id factory for the interfaces
    const id = createIdFactory('test');

    // Entity object interface and class
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

    // Adapter interface and class
    class IDisplayWidget extends AdapterInterface {
      get interfaceId() { return id('IDisplayWidget') };
      render(): void { return };
    }

    class DisplayWidget extends Adapter {
      get __implements__() { return IDisplayWidget };
      constructor({ adapts, render, registry }: Omit<IDisplayWidget, 'interfaceId'> & TAdapter) {
        super({ adapts, render, registry });
      }
    }

    // Adapter instance that can operate on objects implementing IUser
    new DisplayWidget({
      adapts: IUser,
      render () {
        console.log(`My name is ${this.context.name}`)
      }
    })


    // Create our entity object instance
    const user = new User({ name: 'Julia' })

    // Look up the DisplayWidget adapter instance and invoke the render method
    new IDisplayWidget(user).render()
    // [console]$ I am a User
    
    expect(console.logResult).toBe('My name is Julia');
  });
})

