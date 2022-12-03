import { describe, expect, it } from "@jest/globals";
import { createIdFactory, ObjectInterface, ObjectPrototype } from "../src/index";
import { Schema } from '../__mocks__/mock-schema'

const id = createIdFactory('test');

describe('Object Prototypes', function () {
    it('can be created', function () {
        class IUser extends ObjectInterface {
            get interfaceId() { return id('IUser') };
            name: string;
            sayHi(): string { return };
        }
        type TUser = Omit<IUser, 'interfaceId' | 'providedBy'>;
        class User extends ObjectPrototype<Omit<TUser, 'sayHi'>> implements TUser {
            readonly __implements__ = [IUser];
            name: string;
            constructor({ name }: Omit<TUser, 'sayHi'>) {
                super({ name });
            }
            sayHi() {
                return 'Hi!';
            }
        }

        const user = new User({ name: 'Julia' });

        expect(user).toBeInstanceOf(User);
        expect(user.name).toBe('Julia');
        expect(user.sayHi()).toBe("Hi!");
    });

    it('can clone other Object Prototype', function () {
        class IUser extends ObjectInterface {
            get interfaceId() { return id('IUser') };
            name: string;
            sayHi(): string { return };
        }
        type TUser = Omit<IUser, 'interfaceId' | 'providedBy'>;
        class User extends ObjectPrototype<Omit<TUser, 'sayHi'>> implements TUser {
            readonly __implements__ = [IUser];
            name: string;
            constructor({ name }: Omit<TUser, 'sayHi'>) {
                super({ name });
            }
            sayHi() {
                return 'Hi!';
            }
        }

        const user = new User({ name: 'Julia' });

        const clone = new User(user);

        expect(clone).toBeInstanceOf(User);
        expect(clone.sayHi()).toBe("Hi!");

        const jsonUser = JSON.stringify(user.toJSON());
        const jsonClone = JSON.stringify(clone.toJSON());
        expect(jsonClone).toEqual(jsonUser);

        const propsUser = Object.keys(user).toString();
        const propsClone = Object.keys(clone).toString();
        expect(propsClone).toEqual(propsUser);
    });

    it("can call init on ObjectInterface for composition", function () {
        // TODO: Implement
    });


    // it("can convert simple object to JSON", function () {
    //     const IUser = new Interface({ name: 'IUser' });

    //     const User = createObjectPrototype({
    //         implements: [IUser],
    //         constructor: function () {
    //             this._userVal = 1;
    //             this.title = "title"
    //         }
    //     })

    //     const user = new User();

    //     const data = user.toJSON();

    //     expect(data).not.toBe(undefined);
    //     expect(data._userVal).toEqual(1);
    //     expect(data.title).toEqual("title");
    //     expect(JSON.stringify(user)).not.toBe(undefined);
    // });

    // it("can convert nested objects to JSON", function () {
    //     const IUser = new Interface({ name: 'IUser' });

    //     const User = createObjectPrototype({
    //         implements: [IUser],
    //     })

    //     const user = new User({
    //         _userVal: 1,
    //         title: "parent"
    //     });

    //     const child = new User({
    //         title: "child"
    //     });

    //     user.child = child;

    //     const data = user.toJSON();

    //     expect(data).not.toBe(undefined);
    //     expect(data._userVal).toEqual(1);
    //     expect(data.title).toEqual("parent");
    //     expect(data.child.title).toBe("child");
    //     expect(JSON.stringify(user)).not.toBe(undefined);
    // });

    // it("can convert object with null values to JSON", function () {
    //     const IUser = new Interface({ name: 'IUser' });

    //     const User = createObjectPrototype({
    //         implements: [IUser],
    //     })

    //     const user = new User({
    //         _userVal: 1,
    //         title: "parent",
    //         empty: null
    //     });

    //     const data = user.toJSON();

    //     expect(data).not.toBe(undefined);
    //     expect(data._userVal).toEqual(1);
    //     expect(JSON.stringify(user)).not.toBe(undefined);
    // });

    // it("can update value of properties", function () {
    //     const IUser = new Interface({
    //         name: 'IUser',
    //         schema: new Schema({
    //             title: "",
    //             empty: ""
    //         })
    //     });

    //     const User = createObjectPrototype({
    //         implements: [IUser],
    //     })

    //     const user = new User({
    //         _userVal: 1,
    //         title: "parent",
    //         empty: null
    //     });
    //     user.title = "updated";
    //     user.empty = "nope";

    //     expect(user.title).toEqual("updated");
    //     expect(user.empty).toEqual("nope");
    // });

    // it("can be created with an interface as property", function () {
    //     const IUser = new Interface({
    //         name: 'IUser',
    //         schema: new Schema({
    //             title: "",
    //             empty: ""
    //         })
    //     });

    //     const IAsProp = new Interface({})

    //     const User = createObjectPrototype({
    //         implements: [IUser],
    //     })

    //     const user = new User({
    //         myIProp: IAsProp
    //     });

    //     expect(user.myIProp.interfaceId).toEqual(IAsProp.interfaceId);
    // });

    // it("can convert object with function JSON", function () {
    //     const IUser = new Interface({
    //         name: 'IUser',
    //     });

    //     const IAsProp = new Interface({})

    //     const User = createObjectPrototype({
    //         implements: [IUser],
    //     })

    //     const user = new User({
    //         myIProp: IAsProp
    //     });

    //     const data = user.toJSON();

    //     expect(data.myIProp).toBe(undefined);
    // });


    // it("can remove schema field property", function () {
    //     const IUser = new Interface({
    //         name: 'IUser',
    //         schema: new Schema({
    //             title: "",
    //             empty: ""
    //         })
    //     });

    //     const User = createObjectPrototype({
    //         implements: [IUser],
    //     })

    //     const user = new User({
    //         _userVal: 1,
    //         title: "parent",
    //         empty: null
    //     });

    //     delete user.title;

    //     expect(user.title).toBe(undefined);
    // });


    // it("won't overwrite prototype properties", function () {
    //     const IUser = new Interface({
    //         name: 'IUser',
    //         schema: new Schema({
    //             title: "",
    //             empty: ""
    //         })
    //     });

    //     const User = createObjectPrototype({
    //         implements: [IUser],
    //     })

    //     const user = new User({
    //         _userVal: 1,
    //         title: "parent",
    //         empty: null
    //     });

    //     const data = user.toJSON();

    //     const newUser = new User(data);

    //     expect(newUser.hasOwnProperty('__implements__')).toEqual(false);
    // });

    // it("adds schema fields for all implemented interfaces", function () {
    //     const IUser = new Interface({ name: 'IUser', schema: new Schema({ name: '', age: '' }) });
    //     const ILooks = new Interface({ name: 'ILooks', schema: new Schema({ eyes: '', height: '' }) });

    //     const userProto = createObjectPrototype({
    //         implements: [IUser, ILooks]
    //     })
    //     const user = new userProto();

    //     expect(user).toHaveProperty('name');
    //     expect(user).toHaveProperty('age');
    //     expect(user).toHaveProperty('eyes');
    //     expect(user).toHaveProperty('height');
    // });

    // it("checks for existence of all members in all interfaces", function () {
    //     const ITalker = new Interface({ name: 'ITalker' });
    //     ITalker.prototype.talk = function () { };

    //     const IFlexer = new Interface({ name: 'IFlexer' });
    //     IFlexer.prototype.flex = function () { };

    //     const userProto = createObjectPrototype({
    //         implements: [ITalker, IFlexer],
    //         talk: function () { },
    //         flex: function () { }
    //     })
    //     expect(userProto).not.toBe(undefined);

    //     let failed
    //     try {
    //         const userProto = createObjectPrototype({
    //             implements: [ITalker, IFlexer],
    //             flex: function () { }
    //         })
    //     } catch (e) {
    //         failed = true
    //     }
    //     expect(failed).toEqual(true);
    // });
});