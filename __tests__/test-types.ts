import { describe, expect, it } from "@jest/globals";
import { Utility } from "../src";
import { Adapter, TAdapter } from "../src/adapterFactory";
import {
  ObjectInterface,
  UtilityInterface,
  AdapterInterface,
  createNamespace,
 } from "../src/interfaceFactory";
import { ObjectPrototype } from "../src/objectFactory";
import { TUtility } from "../src/utilityFactory";

const id = createNamespace('namespace');

describe('Lookup gets correct type', function() {
  it('for adapter', function() {
    class IUser extends ObjectInterface {
      readonly interfaceId = id('IUser');
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
      readonly interfaceId = id('INameAdapter');
      Component(): string {return};
    }
    // We don't need implements because adapter is looked up using the interface
    class NameAdapter extends Adapter {
      readonly __implements__ = INameAdapter;
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
      readonly interfaceId = id('ITranslateUtil');
      translate(inp: string): string {return};
    }
    class TranslateUtil extends Utility {
      readonly __implements__ = ITranslateUtil;
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
  it('basic', function() {
    // Define an object
    class IUser extends ObjectInterface {
      readonly interfaceId = id('IUser');
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




