import { describe, expect, it } from "@jest/globals";
import { Utility } from "../src";
import { Adapter } from "../src/adapterFactory";
import {
  ObjectInterface,
  UtilityInterface,
  AdapterInterface,
  createIdFactory,
  TypeFromInterface,
 } from "../src/interfaceFactory";
import { ObjectPrototype } from "../src/objectFactory";

const id = createIdFactory('namespace');

describe('Lookup gets correct type', function() {
  it('for adapter', async function() {
    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };
      name: string;
    }

    type TUser = TypeFromInterface<IUser>;
    class User extends ObjectPrototype<TUser> implements TUser {
      readonly __implements__ = [IUser];
      name: string;
      constructor ({ name }: TUser) {
        super({ name });
      }
    }

    const user = new User({
      name: 'Julia'
    });

    // Adapter
    class INameAdapter extends AdapterInterface {
      get interfaceId() { return id('INameAdapter') };
      __Component__: () => string;
    }
    // We don't need implements because adapter is looked up using the interface
    class NameAdapter extends Adapter<INameAdapter, IUser> {
      get __implements__() { return INameAdapter };
      __Component__() {
        return this.context.name;
      }
    }

    new NameAdapter({
      adapts: IUser,
    });

    const Component = new INameAdapter(user) as unknown as Function;
    Component();
  });

  it('for utility', function () {
    // Define the utility
    class ITranslateUtil extends UtilityInterface {
      get interfaceId() { return id('ITranslateUtil') };
      translate: (inp: string) => string;
    }
    class TranslateUtil extends Utility<ITranslateUtil> {
      get __implements__() { return ITranslateUtil };
      
      translate(inp: string) {
        return inp;
      }
    }

    // Implement the utility
    new TranslateUtil({
      name: "sv",
    })

    // Fetch the utility
    const trans = new ITranslateUtil('sv');
    trans.translate('hej');
  })
});



describe('ObjectPrototype gets type safety', function() {
  it('basic', async function() {
    // Define an object
    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };
      name: string;
    }

    // An object prototype can be a mix of interfaces so we need to create
    // a type for it that can be used to provide typing in various places
    type TUser = TypeFromInterface<IUser>;
    class User extends ObjectPrototype<TUser> implements TUser {
      readonly __implements__ = [IUser];
      name: string;
      // Named params provides hints during use
      constructor ({ name }: TUser) {
        // Setting data with super call enforces setting all the required props
        super({ name });
      }
    }

    const user = new User({
      name: 'Julia'
    });

    user.name

    const name = user.name;
  });
});




