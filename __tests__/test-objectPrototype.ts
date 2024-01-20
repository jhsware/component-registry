import { describe, expect, it } from "@jest/globals";
import { createInterfaceDecorator, MarkerInterface, ObjectInterface, ObjectPrototype, TypeFromInterface } from "../src/index";
// import { Schema } from '../__mocks__/mock-schema'
const Interface = createInterfaceDecorator('test');

describe('Object Prototypes', function () {
    it('can be created', function () {
        @Interface
        class IUser extends ObjectInterface {
            name: string;
            sayHi(): string { return '' };
        }
        type TUser = TypeFromInterface<IUser>;
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
        @Interface
        class IUser extends ObjectInterface {
            name: string;
            sayHi(): string { return '' };
        }
        type TUser = TypeFromInterface<IUser>;
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

    it('can clone other Object Prototype with new props', function () {
        @Interface
        class IUser extends ObjectInterface {
            name: string;
            lastName: string;
            sayHi(): string { return '' };
        }
        type TUser = TypeFromInterface<IUser>;
        class User extends ObjectPrototype<Omit<TUser, 'sayHi'>> implements TUser {
            readonly __implements__ = [IUser];
            name: string;
            lastName: string;
            constructor({ name, lastName }: Omit<TUser, 'sayHi'>) {
                super({ name, lastName });
            }
            sayHi() {
                return 'Hi!';
            }
        }

        const user = new User({ name: 'Julia', lastName: 'S' });

        const clone = new User({ ...user, lastName: 'W' });

        expect(clone).toBeInstanceOf(User);
        expect(clone.sayHi()).toBe("Hi!");
        
        expect(clone.lastName).toEqual('W');

        const jsonUser = JSON.stringify(user.toJSON());
        const jsonClone = JSON.stringify(clone.toJSON());
        expect(jsonClone).not.toEqual(jsonUser);

        const propsUser = Object.keys(user).toString();
        const propsClone = Object.keys(clone).toString();
        expect(propsClone).toEqual(propsUser);
    });

    it("can convert simple object to JSON", function () {
        class IUser extends ObjectInterface {
            _userVal?: number;
            title: string;
        }
        type TUser = TypeFromInterface<IUser>;

        class User extends ObjectPrototype<IUser> implements TUser {
            readonly __implements__ = [IUser];
            _userVal = 1;
            title: string;

            constructor({ title, ...params }: TUser) {
                super({ title, ...params });
            }
        }

        const user = new User({ title: "title" });

        const data = user.toJSON();

        expect(data).not.toBe(undefined);
        expect(data._userVal).toEqual(1);
        expect(data.title).toEqual("title");
        expect(JSON.stringify(user)).not.toBe(undefined);
    });

    it("can convert nested objects to JSON", function () {
        class IUser extends ObjectInterface {
            title: string;
            child?: TypeFromInterface<IUser>;
        };
        type TUser = TypeFromInterface<IUser>;

        class User extends ObjectPrototype<IUser> implements TUser {
            readonly __implements__ = [IUser];
            title: string;
            child?: User;
        }

        const user = new User({
            title: "parent"
        });

        const child = new User({
            title: "child"
        });

        user.child = child;

        const data = user.toJSON();

        expect(data).not.toBe(undefined);
        expect(data.title).toEqual("parent");
        expect(data.child.title).toBe("child");
        expect(JSON.stringify(user)).not.toBe(undefined);
    });

    it("can convert object with null values to JSON", function () {
        class IUser extends ObjectInterface {
            title: string;
            empty?: string;
        }
        type TUser = TypeFromInterface<IUser>;

        class User extends ObjectPrototype<IUser> implements TUser {
            readonly __implements__ = [IUser];
            title: string;
            empty?: string;
        }

        const user = new User({
            title: "parent",
            empty: null
        });

        const data = user.toJSON();

        expect(data).not.toBe(undefined);
        expect(JSON.stringify(user)).not.toBe(undefined);
    });

    it("can update value of properties", function () {
        class IUser extends ObjectInterface {
            title: string;
            empty: string | null;
        };
        type TUser = TypeFromInterface<IUser>;

        class User extends ObjectPrototype<IUser> implements TUser{
            readonly __implements__ = [IUser];
            title: string;
            empty: string | null;
        }

        const user = new User({
            title: "parent",
            empty: null
        });
        user.title = "updated";
        user.empty = "nope";

        expect(user.title).toEqual("updated");
        expect(user.empty).toEqual("nope");
    });

    // it("can be created with an interface as property", function () {
    //     const IUser = new Interface({
    //             //         schema: new Schema({
    //             title: "",
    //             empty: ""
    //         })
    //     });

    //     const IAsProp = new Interface({})

    //     const User = createObjectPrototype({
    //         __implements__ [IUser],
    //     })

    //     const user = new User({
    //         myIProp: IAsProp
    //     });

    //     expect(user.myIProp.interfaceId).toEqual(IAsProp.interfaceId);
    // });

    it("can convert object with function JSON", function () {
        class IAsProp extends MarkerInterface{};
        type TAsProp = TypeFromInterface<IAsProp>;

        class IUser extends ObjectInterface {
            myIProp?: TAsProp;
        }
        type TUser = TypeFromInterface<IUser>;


        class User extends ObjectPrototype<IUser> implements TUser {
            readonly __implements__ = [IUser];
            myIProp?: IAsProp;
        }

        const user = new User({
            myIProp: IAsProp
        });

        const data = user.toJSON();

        expect(data.myIProp).toBe(undefined);
    });


    // it("can remove schema field property", function () {
    //     const IUser = new Interface({
    //             //         schema: new Schema({
    //             title: "",
    //             empty: ""
    //         })
    //     });

    //     const User = createObjectPrototype({
    //         __implements__ [IUser],
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
    //             //         schema: new Schema({
    //             title: "",
    //             empty: ""
    //         })
    //     });

    //     const User = createObjectPrototype({
    //         __implements__ [IUser],
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

});