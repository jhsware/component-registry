import { describe, expect, it } from "@jest/globals";
import { globalRegistry, Utility } from "../src";
import { Adapter } from "../src/adapterFactory";
import {
  ObjectInterface,
  UtilityInterface,
  AdapterInterface,
  createInterfaceDecorator,
  TypeFromInterface,
} from "../src/interfaceFactory";
import { ObjectPrototype } from "../src/objectFactory";

const Interface = createInterfaceDecorator('namespace');

describe('Lookup gets correct type', function () {
  it('for adapter', async function () {
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

    const user = new User({
      name: 'Julia'
    });

    // Adapter
    @Interface
    class INameAdapter extends AdapterInterface {
      static __Component__: () => string;
    }

    // We don't need implements because adapter is looked up using the interface
    class NameAdapter extends Adapter<IUser> {
      static __implements__ = INameAdapter;
      static __adapts__ = IUser;

      static __Component__(obj) {
        return obj.name;
      }
    }
    globalRegistry.register(NameAdapter);

    const Component = new INameAdapter(user) as unknown as Function;
    expect(typeof Component).toEqual('function');
  });

  it('for utility', function () {
    // Define the utility
    @Interface
    class ITranslateUtil extends UtilityInterface {
      translate: (inp: string) => string;
    }

    class TranslateUtil extends Utility<ITranslateUtil> {
      static __implements__ = ITranslateUtil;
      static __name__ = 'sv';

      translate(inp: string) {
        return inp;
      }
    }
    globalRegistry.register(TranslateUtil);

    // Fetch the utility
    const trans = new ITranslateUtil('sv');
    trans.translate('hej');
  })
});



describe('ObjectPrototype gets type safety', function () {
  it('basic', async function () {
    // Define an object
    @Interface
    class IUser extends ObjectInterface {
      name: string;
    }

    // An object prototype can be a mix of interfaces so we need to create
    // a type for it that can be used to provide typing in various places
    type TUser = TypeFromInterface<IUser>;
    class User extends ObjectPrototype<IUser> implements TUser {
      readonly __implements__ = [IUser];
      name: string;
      // Named params provides hints during use
      constructor({ name }: TUser) {
        // Setting data with super call enforces setting all the required props
        super({ name });
      }
    }

    const user = new User({
      name: 'Julia'
    });

    user.name

    let name: string;
    name = user.name;
    
    expect(typeof user.name).toEqual('string');
  });
});




