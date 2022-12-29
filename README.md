# component-registry #
[![Build Status](https://travis-ci.org/jhsware/component-registry.svg?branch=master)](https://travis-ci.org/jhsware/component-registry)
[![gzip size](http://img.badgesize.io/https://unpkg.com/component-registry/dist/index.cjs.js?compression=gzip)](https://unpkg.com/component-registry/dist/index.cjs.js)

The purpose of component-registry is to help you create reusable components that are easy to extend and customise. It is heavily inspired by battle proven concepts that have been available for many years in the Python community through the Zope Toolkit(ZTK).

Think of it as decoupled imports and elegant composition.

### v3 Rewrite for Typescript
This is a rewrite of component-registry for Typescript. All the typechecking can now be done by Typescript which shrinks this package from ~20KB to ~6KB. As you would expect, typing incurs an overhead when defining you object, adapter and utility classes. The end result is excellent coding hints and type safety.

Features that have been removed in the Typescript version:
- multiple inheritance -- although very useful it brings magic which makes application code harder to understand
- type checking -- this now done by Typescript

### v2 for Javascript
The Javascript version of component-registry is [available on the v2-branch](https://github.com/jhsware/component-registry/tree/v2-javascript).

### Sample Code ###
```typescript
import {
  Adapter,
  AdapterInterface,
  createInterfaceDecorator,
  ObjectInterface,
  ObjectPrototype,
  TAdapter,
 } from 'component-registry'
// We need an id factory for the interfaces
const Interface = createInterfaceDecorator('test');

// Entity object interface and class
@Interface
        class  IUser extends ObjectInterface {
    name: string;
  providedBy(obj: ObjectPrototype<any>) {
    return super.providedBy(obj);
  };
}

type TUser = TypeFromInterface<IUser>;
class User extends ObjectPrototype<TUser> implements TUser {
  readonly __implements__ = [IUser];
  name: string;
  constructor({ name }: TUser) {
      super({ name });
  }
}

// Adapter interface and class
class IDisplayWidget extends AdapterInterface {
    render(): void { return };
}

class DisplayWidget extends Adapter {
  static __implements__ = IDisplayWidget;
  constructor({ adapts, render, registry }: Omit<IDisplayWidget, 'interfaceId'> & TAdapter) {
    super({ adapts, render, registry });
  }
}

// Adapter instance that can operate on objects implementing IUser
new DisplayWidget({
  adapts: IUser,
  render () {
  console.log(`My name is ${this.context.name}`)
  }
})


// Create our entity object instance
const user = new User({ name: 'Julia' })

// Look up the DisplayWidget adapter instance and invoke the render method
new IDisplayWidget(user).render()
// [console]$ I am a User
```

### The Global Registry ##
The brain of the component-registry is the `globalRegistry` which keeps track of all the components you have available in your application. These are normally registered at startup, but can be added at any time during your application lifecycle.

### Adapters, Utilities and ObjectPrototypes ##
There are three main object types that are available in component-registry. Adapters, Utilities and ObjectPrototypes.

**ObjectPrototypes** are basially entity objects. They contain data and often nothing more. ObjectPrototypes will normally look a lot like the JSON you would send between subsystems. 

An **Adapter** most of the time works in concert with an ObjectPrototype. You would ask the registry to find an adapter that has certain capabilities, perhaps methods that can convert the ObjectPrototype to JSON or HTML markup. The most obvious use of Adapters is to implement UI-widgets, but you can also use it for business logic that operates on an entity object. Basically you can move any methods you would otherwise place on an entity object to the adapter. This keeps the ObjectPrototypes lean and data centric.

**Utilities** are stateless components. They provide you with utility methods or services. You could get DB-credentials through a Utility, or you could provide methods for i18n-translations. Similar to Adapters you would ask the registry to find a Utility with the capabilities you require.

### Interfaces ##
The capabilities of your Adapters and Utilities are specified by **Interfaces**. Interfaces are what some would call developer contracts, literally a promise to implement a given set of methods and properties. When doing a lookup of adapters or utilities, the `globalRegistry` uses interfaces to find what you are looking for.

By using Interfaces you decouple your code. When asking the globalRegistry for an Adapter or Utility that implements a specific Interface you have no idea where or how it has been implemented. All you know is that it should be registered with the globalRegistry. In your application the benefit might not be obvious. However, if you create an NPM package that requires your application to perform certain tasks, such as providing application specific i18n-translations, all that package needs to know is that it should ask for a Utility that implements a certain interface, say ITranslationUtil. Your application can provide that utility through the globalRegistry so the package can access it at runtime.

This is a two way street. If you want to change the package that consume ITranslationUtil, you won't have to worry about ripping out initialisation code etc. All you have to do is make sure the new package you have created asks for the same Interface and it is automatically hooked up with your existing Utility.

This becomes even more powerful when you have several NPM-packages that need to consume the same ITranslationUtil. You could create a meta-package that literally only contains Interfaces and then have both consuming packages and your application use those common Interfaces as glue.

Why is this good? Well it forces you to think about the architecture of your application. And it will automatically makes you write reusable code with next to no added effort.

Another brilliant side-effect is that you can move your implementation code around, and also split it into it's own NPM-packages at any time. As long as you don't move the Interface, all the components can still do their lookups without changing a single line of code. This makes refactoring simple, fun and helps in agile development.  

### More on ObjectPrototypes and Adapters ##
ObjectPrototypes contain a bit more than just data. They provide a property `__implements__` that contains an array of Interfaces that describe the capabilities of that object. The order is important, the first Interface in this array tells us what this ObjectPrototype is. The rest tell us what other things this ObjectPrototype contains or can be used for. This could be a list of implemented Interfaces:

```typescript
import { ObjectPrototype } from 'component-registry';
type TEmployee = Omit<IEmployee & IUser & IHasAvatar, 'interfaceId' | 'providedBy'>;
class Employee extends ObjectPrototype<TEmployee> implements TEmployee {
  readonly __implements__ = [IEmployee, IUser, IHasAvatar];
  ...
}
```
The ObjectPrototype should be called Employee, which corresponds to the most significant Interface it implements. When you instantiate an object of type Employee you will find the Interfaces as the property `__implements__`.

The `globalRegistry` uses these interfaces in order to find Adapters for you that can be used with your Employee objects. Say that you want to render a directory listing of your employees. You decide you want each row to be rendered by using an Adapter that you find with the interface `IDirectoryListEntryWidget`, you can call the Interface what ever you want. Now you need to implement that Adapter so it can render your Employee object. It would look something like this:

```typescript
import { Adapter, TAdapter } from 'component-registry'

class DirectoryListEntryWidget extends Adapter {
  static __implements__ = IDirectoryListEntryWidget;
  constructor({ adapts, render, registry }: Omit<IDirectoryListEntryWidget, 'interfaceId'> & TAdapter) {
    super({ adapts, render, registry });
  }
}
new DirectoryListEntryWidget({
  adapts: IEmployee,
  render () { ... }
})
```
The parameter **__implements__** tells the globalRegistry what the Adapter can do. The parameter **adapts** tells the globalRegistry what kind of object it can do this with.

So when you want to render the list you would write something like this:

```typescript
import { IDirectoryListEntryWidget } from './myAppInterfaces'
function renderList (entries) {
  const outp = entries.map((entry) => new IDirectoryListEntryWidget(entry).render())
  return outp.join('\n')
}
```
Your list rendering code has no idea how the individual widgets are rendered, it is all done by the widget. All it knows is that it should get the `IDirectoryListEntryWidget` adapter that adapts the `entry` object.

In a simple case with only a single object type this still makes the code compact and readable. But the power becomes more apparent if we have more object types in our entries list. There could be ten different object types, each with their own registered Adapter that implements IDirectoryListEntryWidget. These list items can all be rendered by the same code which is blissfully unaware of how different the implementations are.

## Public API ##

```javascript
import { globalRegistry } from 'component-registry'
```
Use the global registry to register you adapters and utilities.

WARNING! The registry is also available as a global variable. You should not make
your code dependent on using the global variable, it is mainly intended for
debugging purposes. Always require the registry for proper use. The global variable
might be removed when run in production mode.

You will also use these extensively:

```javascript
// To ceate interfaces
import { createInterfaceDecorator } from 'component-registry'
const Interface = createInterfaceDecorator('test');

// To create adapters
import { Adapter } from 'component-registry'

// To create utilities
import { Utility } from 'component-registry'

// To create object prototypes
import { createObjectPrototype } from 'component-registry'
```

For advanced use, you can create your own adapter and/or utility registry. The use
case could be to create a sub system that can't be accessed by the rest of your app.
```javascript
import { Registry, AdapterRegistry, UtilityRegistry } from 'component-registry'
```

## Object Prototypes ##

Object Prototypes can implement interfaces. This declares what capabilities they support. Interfaces are used for looking up Adapters among other things. You can use the `.prototype.providedBy(obj)` method on interfaces to check if it is implemented by an object.

```typescript
INews.prototype.providedBy(obj) === true;
INotImplemented.prototype.providedBy(obj) === false;
```

Interfaces also provide a convenient way of looking up adapters and utilities.

## Adapters ##

Adapters provide functionality for objects. It literally adapts an object for use in a specific context, such as rendering UI-widgets. When you ask for an adapter from the adapter registry it finds an adapter that implements the interface you are asking for the specific object you are working with. A look can be done in two ways:

```javascript
import { IPermissions } from './interfaces'
import { globalRegistry } from 'component-registry'

// The pretext here is that we have registered adapters somewhere
// wich adapt userObj that was also created somehow

const userObj = new User(...);

const permissionsByShorthand =  new IPermissions(userObj).getPermissions();
```

So this is what happens during a lookup:

    1 Find a set of registered adapters that claim to implement ICoolAdapter
     
    2a Check if any of these adapt the given object type
    
    2b If not, check if any of these adapt any of the interfaces that
      the object states that it implements
      
    3 Return an instance of the adapter with this.context set to obj
    
Now that you have the adapter you can start using it for a variety of scenarios:

    - Render the object to HTML
    
    - Manipulate the properties of the object
    
    - Persist the object to a backend
    
Adapters are basically a nice way of creating reusable business logic and render components that are loosly coupled (by interface) to the objects they manipulate. 

## Utilities ##

A utilitiy is a stateless object that provides a set of functions in your code. You create a utility and register it in the utility registry. To identify the capabilities of the utility you define an interface. This can optionally declare what methods attributes you can call on the utility or just be a marker interface. Declaring the interface is a good way to architect your api before implementation.


```javascript
import { IDatabaseService } from './interfaces'
import { globalRegistry } from 'component-registry'

// The pretext here is that we have registered utilities somewhere

const connection =  new IDatabaseService().connect()
const otherConnection =  new IDatabaseService('mongodb').connect()
```

The point of using utilities is that you can define the interface in a general component but leave the implementation up to the application that uses the component. An example would be a database connection. The component needs a database connection but doesn't know what authorisation credentials to use, so it asks for these by calling the utility registry and requesting say a IDatabaseCredentials utility. It is then up to the application developer to create this utility and register it as an implementation of IDatabaseCredentials.

This is a nice way to decouple and organise your code.

### About Named Utilities ###

Another example of how to use a utility could be if you want to provide internationalisation features. In which case you could give each utility a name that corresponds to the region it implements. So basically you would ask for `new ILocalization('us')` for the United States and `new ILocalization('se')` for Sweden. You can also query for all named utilities that implement ILocalization and get them as a list `new ILocalization('*')`.

# API Docs #

### Object Prototypes ###

```typescript
import { ObjectPrototype } from 'component-registry'

type TUser = TypeFromInterface<IUser>;
class User extends ObjectPrototype<TUser> implements TUser {
    readonly __implements__ = [IUser];
    name: string;
    constructor({ name }: TUser) {
        super({ name });
    }
    sayHi() {
        return "Hi!"
    }
}
```
The object implements the provided list of interfaces and the method sayHi will be added to the object.prototype and available to instantiated objects.

The first interface in the list is significant. It should be a unique interface describing the object. The name of this interface is used for inheritance.

```typescript
const obj = new User();
```
Creates an instance of the object prototype you created above.

### Interfaces ###
First you need an id factory. Ids are in fact GUID style strings created with the UUID-package. The id is memoised by the returned id function to reduce the overhead of id generation.

```typescript
import { createInterfaceDecorator } from 'component-registry'
const Interface = createInterfaceDecorator('my-namespace'); // Use the name of your module as namespace
```

Create the Interface class with a getter method to set the interface. The id of the interface is a UUID built from namespace and name. The id will be the same regardless of when you create it.

```typescript
// We need the Interface created above
@Interface
        class  IUser extends ObjectInterface {
    providedBy(obj: ObjectPrototype<any>) {
    return super.providedBy(obj);
  };
}
```
Creates a simple object interface. You have four different kinds of interfaces:

- MarkerInterface -- when all you want is to use `.prototype.providedBy(obj)` method in your application code
- ObjectInterface -- define your entity objects. Allows adding an `.init(...)` property that you can call from your object constructor. This allows sharing functionality through composition.
- AdapterInterface -- define your adapters. Allows looking up the adapter using shorthand `new IMyAdapter(obj)`
- UtilityInterface -- define you utilities. Allows looking up the utility using shorthand `new IMyUtility()`

Use the convention of prefixing interfaces with "I" to improve readability.

You can add dummy functions to your interface prototype to show what methods are required for an adapter, utility or object prototype that implements that interface. Note: object prototypes will in most cases be simple data objects with no or few methods.

```typescript
@Interface
        class  IUser extends ObjectInterface {
    sayHi(): string { return };
  providedBy(obj: ObjectPrototype<any>) {
    return super.providedBy(obj);
  };
}
```

Don't forget to omit function members from your constructor props type.

TODO: Add example

### Adapters ###

**new Adapter(params)**

Create and adapter that adapts an interface or an object prototype. It is automatically registered with the `globalRegistry` available in component-registry.

```typescript
import { Adapter, TAdapter } from 'component-registry'

const MyAdapter = new Adapter({
    __implements__ IInterface,
    adapts: IInterface || ObjectPrototype
})

class MyAdapter extends Adapter {
  static __implements__ = IMyAdapter;
  constructor({ adapts, registry }: Omit<IMyAdapter, 'interfaceId'> & TAdapter) {
    super({ adapts, registry });
  }
}

// Adapter instance that can operate on objects implementing IUser
new MyAdapter({
  adapts: IUser,
})
```

If you want to register the created adapter with a scoped registry instead of `globalRegistry` you pass it as a parameter. This is useful in tests to make sure you have a known set adapters registered.

```typescript
new MyAdapter({
  adapts: IUser,
  registry: myOwnRegistry
})
```

### Utilities ###

Create an unamed utility that implements a given interface. It is automatically registered with the `globalRegistry` available in component-registry.

```typescript
class utility extends Utility<> {
    __implements__ IInterface
});
```

Create a named utility that implements a given interface and has a variation name. It is automatically registered with the `globalRegistry` available in component-registry.

```typescript
import { Utility, TUtility } from 'component-registry';
// The pretext is that we already have created the UtilityInterface ITranslateUtil
class TranslateUtil extends Utility implements Omit<ITranslateUtil, 'interfaceId'> {
  static __implements__ = ITranslateUtil;
  constructor({ name, translate, registry }: Omit<ITranslateUtil, 'interfaceId'> & TUtility) {
    super({ name, translate, registry });
  }
  translate(inp: string): string { return };
}

const util = new TranslateUtil({
  name: "sv",
  translate(inp: string) {
    return inp;
  }
})
```

Just like an adapter you can pass a scoped registry to register the utility there.

```typescript
const util = new TranslateUtil({
  name: "sv",
  translate(inp: string) {
    return inp;
  },
  registry: myRegistry
})
```

Find all registered utilities (named and unnamed) that implement the given interface.

```javascript
const utils = new IMyInterface('*');
const utilsAltSyntax = registry.getUtilities(IMyInterface);
const utilsFromScopedRegistry = new IMyInterface('*', myRegistry);
```

## Creating a scoped registry ##

You can create a scoped registry if you want to have an alternative set of utilities or adapters available for a task. This feature is useful for tests.

```javascript
import { AdapterRegistry, UtilityRegistry, LocalRegistry } from 'comonent-registry'
const myAdapterRegistry = new AdapterRegistry();
const myUtilityRegistry = new UtilityRegistry();
const myRegistry = new LocalRegistry(); // Combines an adapter and utility registry
```

If you have created a scoped registry in application code you might want to register some of your existing adapters. In this case you would use the registration API:

```typescript
  myRegistry.registerAdapter(MyAdapter);
  myRegistry.registerUtility(utility);
```

Good luck!

## Migrating to 2.0 ##
The Typescript version of component-registry is a complete rewrite to leverage the typing features of Typescript. The main hurdle is to restructure your code to remove inheritance, and especially multiple inheritance. In v3 you need to be explicit, but this also makes the code more readable since inheritance can feel like magic and magic can be hard to understand.
