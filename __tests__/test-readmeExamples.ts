import { describe, expect, it, beforeEach } from "@jest/globals";
import { Adapter, AdapterInterface, createInterfaceDecorator, globalRegistry, ObjectInterface, ObjectPrototype, TypeFromInterface } from "../src";

class consoleMock {
  logResult;

  log(inp) {
    this.logResult = inp
  }
}

describe('Readme Examples', function () {
  beforeEach(function () {
    globalRegistry.adapters = {}
  })

  it('Sample Code', async function () {
    let console = new consoleMock()

    // We need an interface decorator for the interfaces
    const Interface = createInterfaceDecorator('test');

    // Entity object interface and class
    @Interface
    class IUser extends ObjectInterface {
      name: string;
    }

    type TUser = TypeFromInterface<IUser>;
    class User extends ObjectPrototype<IUser> implements TUser {
      readonly __implements__ = [IUser];
      name: string;
      constructor({ name }: TUser) {
        super({ name });
      }
    }

    // Adapter interface and class
    @Interface
    class IDisplayWidget extends AdapterInterface {
      render(): void { return };
    }

    // Create and register the actual adapter
    class DisplayWidget extends Adapter<IUser> {
      static __implements__ = IDisplayWidget;
      static __adapts__ = IUser;

      render() {
        console.log(`My name is ${this.context.name}`)
      }
    }
    globalRegistry.register(DisplayWidget);


    // Create our entity object instance
    const user = new User({ name: 'Julia' })

    // Look up the DisplayWidget adapter instance and invoke the render method
    new IDisplayWidget(user).render()
    // [console]$ I am a User

    expect(console.logResult).toBe('My name is Julia');
  });
})

