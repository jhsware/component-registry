import { describe, expect, it } from "@jest/globals";
// import { TUtilityRegistry } from "../dist/types";
import { AdapterRegistry, createInterfaceClass, Adapter } from '../src/index'
import { TAdapterInterface } from "../src/interfaceFactory";
import { ObjectPrototype } from "../src/objectFactory";
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



      // export var Blog = createObjectPrototype({
      //   implements: [IBlog, IObject],
      //   extends: [RoleManager, Permissions, PublishWorkflow],
      //     this._IRoleManager.constructor.call(this, params)
      //   }
      // })


      interface TPermissions {
        permissions?: string[];
      }

      class Permissions extends ObjectPrototype<TPermissions> implements TPermissions {
        permissions: [];
      }
      

      const IPermissions = new Interface({
        name: "IPermissions",
        init(obj, data?: any) {
          obj.permissions = data?.permissions ?? ["all"];
        }
      });


      
      interface TUser {
        name: string;
      }

      class User extends ObjectPrototype<TUser & TPermissions> implements TUser, TPermissions {
        readonly __implements__ = [IUser, IPermissions];
        name: string;
        permissions = [];

        constructor(data: TUser & TPermissions) {
          super(data);
          IPermissions.init(this, data);
        }
      }

      // How do I get the type TUser instead of ObjectPrototype

      const theUser = new User({
        name: "Jenson"
      });

      const clara = new User({
        name: "Clara"
      });
      
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
      class User extends ObjectPrototype<TUser & TNameable> implements TUser, TNameable {
        static implements = [IUser, INameable];
        height;
        firstName;
        lastName;
        
      }

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