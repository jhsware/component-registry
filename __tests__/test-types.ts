import { describe, expect, it } from "@jest/globals";
// import { TUtilityRegistry } from "../dist/types";
import { AdapterRegistry, createInterfaceClass, createObjectPrototype, Adapter } from '../src/index'
import { TAdapterInterface } from "../src/interfaceFactory";
const Interface = createInterfaceClass('test')


describe('Lookup gets correct type', function() {
  it('for adapter', function() {
      const registry = new AdapterRegistry();
      

      const IUser = new Interface({
        name: "IUser"
      });

      type TUserAdapter = {
        prettyPrint(): string;
      }
      const IUserAdapter = new Interface({name: "IUserAdapter", type: "adapter"}) as unknown as TAdapterInterface;
      
      const UserAdapter = new Adapter({
          registry: registry,
          implements: IUserAdapter,
          adapts: IUser
      })

      abstract class TUser {
        constructor(data?) {};
        name: string;
      }

      
      const User = createObjectPrototype<TUser>({
          implements: [IUser],
      });
      
      // How do I get the type TUser instead of ObjectPrototype

      const theUser = new User();
      
      const ua = new IUserAdapter(theUser, { registry: registry });

      expect(ua).toBeInstanceOf(UserAdapter);
  });
});



describe('ObjectPrototype gets type safety', function() {
  it('for adapter', function() {
      const IUser = new Interface({
        name: "IUser"
      });

      abstract class TUser {
        constructor(data?) {};
        height: number;
        weight?: number;
      }
      
      const INameable = new Interface({
        name: "INameable"
      });

      type TNameable = {
        firstName: string;
        lastName: string;
      }

      // class User extends ObjectPrototype implements TUser, TNameable {
      //   implements = [IUser, INameable];
      //   extends = [];
      //   name: string;
      // }

      // TODO: Use same method of class returning a class as we do in interfaceFactory.
      const User = createObjectPrototype<TUser & TNameable>({
        extends: [],
        implements: [IUser, INameable],
        constructor(data?: TUser & TNameable) {

        }
      })

      // How do I get the type TUser instead of ObjectPrototype

      const theUser = new User({
        height: 200,
        weight: 100,
        firstName: "heidi",
        lastName: "plum"
      })

      function test(t: TUser) {
        return
      }

      // Should work
      test(theUser);
      
      // Should fail
      // test(IUser);

      const isTrue = IUser.providedBy(theUser);

      expect(theUser).toBeInstanceOf(User);
  });
});






(function test() {
  class ObjectPrototype {
    constructor(data) {
      // Do all the stuff here
    }
  
    toJSON() {
  
    }
  }

  class IUserCls extends Interface {
    name = "IUser";
    schema = {};
  }

  const IUserObj = new Interface({
    name: "IUser",
    schema: {}
  });

  class UserClass extends ObjectPrototype {
    implements = [IUserCls];
    extends = []
  }

  const UserPrototype = createObjectPrototype({

  })

  IUserCls.name



  
  class User extends ObjectPrototype {
    static extends = [User];
    static implement = [IUserCls, IUserObj];  
    name;
    age;
    height;
    constructor(data?) {
      super(data);
    }
  }
  
  const user = new User();
  
  
  const a = user instanceof User
  const b = user instanceof ObjectPrototype;
})()