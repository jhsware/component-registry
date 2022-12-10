import { describe, expect, it } from "@jest/globals";
import { Utility } from "../src";
import { Adapter, TAdapter } from "../src/adapterFactory";
import {
  ObjectInterface,
  UtilityInterface,
  AdapterInterface,
  createIdFactory,
 } from "../src/interfaceFactory";
import { ObjectPrototype } from "../src/objectFactory";
import { TUtility } from "../src/utilityFactory";

const id = createIdFactory('namespace');

describe('Lookup gets correct type', function() {
  it('for adapter', async function() {
    class IUser extends ObjectInterface {
      get interfaceId() { return id('IUser') };
      name: string;
    }

    type TUser = Omit<IUser, 'interfaceId' | 'providedBy'>;
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
      Component(): string {return ''};
    }
    // We don't need implements because adapter is looked up using the interface
    class NameAdapter extends Adapter {
      get __implements__() { return INameAdapter };
      constructor({ adapts, Component, registry}: Omit<INameAdapter, 'interfaceId'> & TAdapter) {
        super({adapts, Component, registry});
      }
    }

    new NameAdapter({
      adapts: IUser,
      Component() {
        return this.context.name;
      }
    });

    const nameAdapter = new INameAdapter(user);
    nameAdapter.Component
  });

  it('for utility', function () {
    // Define the utility
    class ITranslateUtil extends UtilityInterface {
      get interfaceId() { return id('ITranslateUtil') };
      translate(inp: string): string {return ''};
    }
    class TranslateUtil extends Utility {
      get __implements__() { return ITranslateUtil };
      constructor({ name, translate, registry}: Omit<ITranslateUtil, 'interfaceId'> & TUtility) {
        super({name, translate, registry});
      }
    }

    // Implement the utility
    new TranslateUtil({
      name: "sv",
      translate(inp: string) {
        return inp;
      }
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
    type TUser = Omit<IUser, 'interfaceId' | 'providedBy'>;
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




