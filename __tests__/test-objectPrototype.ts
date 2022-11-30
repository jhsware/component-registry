import { describe, expect, it } from "@jest/globals";
import { createObjectPrototype, createInterfaceClass } from '../dist/index.cjs.js'
import { Schema } from '../__mocks__/mock-schema'

const Interface = createInterfaceClass('test')

describe('Object Prototypes', function() {
    it('can be created', function() {
        const IUser = new Interface({name: 'IUser'});
        
        const userPrototype = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        const user = new userPrototype();
        
        expect(user).toBeInstanceOf(userPrototype);
        expect(user.sayHi()).toBe("Hi!");
    });

    it('can clone other Object Prototype', function() {
        const IUser = new Interface({name: 'IUser'});
        
        const userPrototype = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        const user = new userPrototype({ test: 'dummy' });
        const clone = new userPrototype(user);
        
        expect(clone).toBeInstanceOf(userPrototype);
        expect(clone.sayHi()).toBe("Hi!");

        const jsonUser = JSON.stringify(user.toJSON());
        const jsonClone = JSON.stringify(clone.toJSON());
        expect(jsonClone).toEqual(jsonUser);
        
        // console.log(
        //   jsonUser,
        //   jsonClone,
        //   Object.keys(user),
        //   Object.keys(clone),
        // )
        const propsUser = Object.keys(user).toString();
        const propsClone = Object.keys(clone).toString();
        expect(propsClone).toEqual(propsUser);
    });
    
    it("can inherit from other object prototypes", function() {
        const IUser = new Interface({name: 'IUser'});
        
        const userProto = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        const ISpecialUser = new Interface({name: 'ISpecialUser'});
        
        const specialUserProto = createObjectPrototype({
            extends: [userProto],
            implements: [ISpecialUser],
            sayHo: function () {
                return "Ho!"
            }
        })
        
        const user = new specialUserProto();
        
        expect(user).toBeInstanceOf(specialUserProto);
        expect(user.sayHi()).toBe("Hi!");
        expect(user.sayHo()).toBe("Ho!");
    });

    it("can inherit from other object prototypes and maintain this", function() {
        const IUser = new Interface({name: 'IUser'});
        
        const userProto = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return this.sayHo()
            },
            sayHo: function () {
                return "Wrong ho!"
            }
        })
        
        const ISpecialUser = new Interface({name: 'ISpecialUser'});
        
        const specialUserProto = createObjectPrototype({
            extends: [userProto],
            implements: [ISpecialUser],
            sayHo: function () {
                return "Ho!"
            }
        })
        
        const user = new specialUserProto();
        
        expect(user.sayHi()).toBe("Ho!");
    });
    
    it("can inherit from other object prototypes two levels deep", function() {
        const IUser = new Interface({name: 'IUser'});
        
        const userProto = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return "Hi!"
            }
        })
        
        const ISpecialUser = new Interface({name: 'ISpecialUser'});
        
        const specialUserProto = createObjectPrototype({
            extends: [userProto],
            implements: [ISpecialUser],
            sayHo: function () {
                return "Ho!"
            }
        })
        
        const ISuperSpecialUser = new Interface({name: 'ISuperSpecialUser'});
        
        const superSpecialUserProto = createObjectPrototype({
            extends: [specialUserProto],
            implements: [ISuperSpecialUser],
            sayYay: function () {
                return "Yay!"
            }
        })
        
        const user = new superSpecialUserProto();
        
        expect(user).toBeInstanceOf(superSpecialUserProto);
        expect(user.sayHi()).toBe("Hi!");
        expect(user.sayHo()).toBe("Ho!");
        expect(user.sayYay()).toBe("Yay!");
    });

    it("can inherit from other object prototypes two levels deep and maintain this", function() {
        const IUser = new Interface({name: 'IUser'});
        
        const userProto = createObjectPrototype({
            implements: [IUser],
            sayHi: function () {
                return this.sayHo()
            },
            sayHo: function () {
                return "Wrong ho!"
            }
        })
        
        const ISpecialUser = new Interface({name: 'ISpecialUser'});
        
        const specialUserProto = createObjectPrototype({
            extends: [userProto],
            implements: [ISpecialUser],
            sayHo: function () {
                return "Wrong ho!"
            }
        })
        
        const ISuperSpecialUser = new Interface({name: 'ISuperSpecialUser'});
        
        const superSpecialUserProto = createObjectPrototype({
            extends: [specialUserProto],
            implements: [ISuperSpecialUser],
            sayHo: function () {
                return "Ho!"
            }
        })
        
        const user = new superSpecialUserProto();
        
        expect(user.sayHi()).toBe("Ho!");
    });
    
    it("can inherit from other object prototypes two levels deep and call all constructors", function() {
        const IUser = new Interface({name: 'IUser'});
        
        const User = createObjectPrototype({
            implements: [IUser],
            constructor: function () {
                this.storedVal = (this.storedVal || '') + '1';
            },
            getStoredVal: function () {
                return this.storedVal;
            }
        })
        
        const ISpecialUser = new Interface({name: 'ISpecialUser'});
        
        const SpecialUser = createObjectPrototype({
            extends: [User],
            implements: [ISpecialUser],
            constructor: function (data) {
                this._IUser.constructor.call(this, data);
                this.storedVal = (this.storedVal || '') + '2';
            },
        })
                
        const ISuperSpecialUser = new Interface({name: 'ISuperSpecialUser'});
        
        const SuperSpecialUser = createObjectPrototype({
            extends: [SpecialUser],
            implements: [ISuperSpecialUser],
            constructor: function (data) {
                this._ISpecialUser.constructor.call(this, data);
                this.storedVal = (this.storedVal || '') + '3';
            },
        })
        
        const user = new SuperSpecialUser();
        
        expect(user).toBeInstanceOf(SuperSpecialUser);
        expect(user.getStoredVal()).toEqual("123");
        expect(user._IUser.getStoredVal.call(user)).toEqual("123");
    });
    
    it("can inherit from several other object prototypes call all constructors", function() {
        const IUser = new Interface({name: 'IUser'});
        
        const User = createObjectPrototype({
            implements: [IUser],
            constructor: function () {
                this.userVal = 1;
            }
        })
        
        const ISpecial = new Interface({name: 'ISpecial'});
        
        const Special = createObjectPrototype({
            implements: [ISpecial],
            constructor: function (data) {
                this.specialVal = 2;
            },
        })
                
        const ISuperSpecialUser = new Interface({name: 'ISuperSpecialUser'});
        
        const SuperSpecialUser = createObjectPrototype({
            extends: [Special, User],
            implements: [ISuperSpecialUser],
            constructor: function (data) {
                this._ISpecial.constructor.call(this, data);
                this._IUser.constructor.call(this, data);
                this.superSpecialVal = 3;
            },
        })
        
        const user = new SuperSpecialUser();
        
        expect(user).toBeInstanceOf(SuperSpecialUser);
        expect(user.userVal).toEqual(1);
        expect(user.specialVal).toEqual(2);
        expect(user.superSpecialVal).toEqual(3);
    });

    it("can inherit from other object prototype and calls inherited constructor if none is specified", function() {
        const IUser = new Interface({name: 'IUser'});
        
        const userProto = createObjectPrototype({
            implements: [IUser],
            constructor: function () {
                this.constructorCalled = true
            }
        })
        
        const ISpecialUser = new Interface({name: 'ISpecialUser'});
        
        const specialUserProto = createObjectPrototype({
            extends: [userProto],
            implements: [ISpecialUser]
        })
        
        const user = new specialUserProto();
        
        expect(user).toBeInstanceOf(specialUserProto);
        expect(user.constructorCalled).toBe(true);
    });

    it("can convert simple object to JSON", function() {
        const IUser = new Interface({name: 'IUser'});
        
        const User = createObjectPrototype({
            implements: [IUser],
            constructor: function () {
                this._userVal = 1;
                this.title = "title"
            }
        })
                
        const user = new User();
        
        const data = user.toJSON();
        
        expect(data).not.toBe(undefined);
        expect(data._userVal).toEqual(1);
        expect(data.title).toEqual("title");
        expect(JSON.stringify(user)).not.toBe(undefined);
    });
    
    it("can convert nested objects to JSON", function() {
        const IUser = new Interface({name: 'IUser'});
        
        const User = createObjectPrototype({
            implements: [IUser],
        })
                
        const user = new User({
            _userVal: 1,
            title: "parent"
        });
        
        const child = new User({
            title: "child"
        });
        
        user.child = child;
        
        const data = user.toJSON();
        
        expect(data).not.toBe(undefined);
        expect(data._userVal).toEqual(1);
        expect(data.title).toEqual("parent");
        expect(data.child.title).toBe("child");
        expect(JSON.stringify(user)).not.toBe(undefined);
    });
    
    it("can convert object with null values to JSON", function() {
        const IUser = new Interface({name: 'IUser'});
        
        const User = createObjectPrototype({
            implements: [IUser],
        })
                
        const user = new User({
            _userVal: 1,
            title: "parent",
            empty: null
        });
                
        const data = user.toJSON();
        
        expect(data).not.toBe(undefined);
        expect(data._userVal).toEqual(1);
        expect(JSON.stringify(user)).not.toBe(undefined);
    });
    
    it("can update value of properties", function() {
        const IUser = new Interface({
            name: 'IUser',
            schema: new Schema({
                title: "",
                empty: ""                    
            })
        });
        
        const User = createObjectPrototype({
            implements: [IUser],
        })
                
        const user = new User({
          _userVal: 1,
          title: "parent",
          empty: null
        });
        user.title = "updated";
        user.empty = "nope";
        
        expect(user.title).toEqual("updated");
        expect(user.empty).toEqual("nope");
    });

    it("can be created with an interface as property", function() {
      const IUser = new Interface({
          name: 'IUser',
          schema: new Schema({
              title: "",
              empty: ""                    
          })
      });

      const IAsProp = new Interface({})
      
      const User = createObjectPrototype({
          implements: [IUser],
      })
           
      const user = new User({
          myIProp: IAsProp
      });
      
      expect(user.myIProp.interfaceId).toEqual(IAsProp.interfaceId);
    });

    it("can convert object with function JSON", function() {
      const IUser = new Interface({
        name: 'IUser',
      });

      const IAsProp = new Interface({})
      
      const User = createObjectPrototype({
          implements: [IUser],
      })
              
      const user = new User({
          myIProp: IAsProp
      });
      
      const data = user.toJSON();
      
      expect(data.myIProp).toBe(undefined);
    });
  
    
    it("can remove schema field property", function() {
        const IUser = new Interface({
            name: 'IUser',
            schema: new Schema({
                title: "",
                empty: ""                    
            })
        });
        
        const User = createObjectPrototype({
            implements: [IUser],
        })
                
        const user = new User({
            _userVal: 1,
            title: "parent",
            empty: null
        });
        
        delete user.title;
        
        expect(user.title).toBe(undefined);
    });
    
    
    it("won't overwrite prototype properties", function() {
        const IUser = new Interface({
            name: 'IUser',
            schema: new Schema({
                title: "",
                empty: ""                    
            })
        });
        
        const User = createObjectPrototype({
            implements: [IUser],
        })
                
        const user = new User({
            _userVal: 1,
            title: "parent",
            empty: null
        });
        
        const data = user.toJSON();
        
        const newUser = new User(data);
        
        expect(newUser.hasOwnProperty('_implements')).toEqual(false);
    });

    it("adds schema fields for all implemented interfaces", function() {
        const IUser = new Interface({name: 'IUser', schema: new Schema({ name: '', age: '' })});
        const ILooks = new Interface({name: 'ILooks', schema: new Schema({ eyes: '', height: ''})});
        
        const userProto = createObjectPrototype({
            implements: [IUser, ILooks]
        })
        const user = new userProto();

        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('age');
        expect(user).toHaveProperty('eyes');
        expect(user).toHaveProperty('height');
    });

    it("checks for existence of all members in all interfaces", function() {
        const ITalker = new Interface({name: 'ITalker'});
        ITalker.prototype.talk = function () {};
        
        const IFlexer = new Interface({name: 'IFlexer'});
        IFlexer.prototype.flex = function () {};
        
        const userProto = createObjectPrototype({
            implements: [ITalker, IFlexer],
            talk: function () {},
            flex: function () {}
        })
        expect(userProto).not.toBe(undefined);

        let failed
        try {
            const userProto = createObjectPrototype({
                implements: [ITalker, IFlexer],
                flex: function () {}
            })
        } catch (e) {
            failed = true
        }
        expect(failed).toEqual(true);
    });
});