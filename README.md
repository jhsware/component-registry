# component-registry #
[![Build Status](https://travis-ci.org/jhsware/component-registry.svg?branch=master)](https://travis-ci.org/jhsware/component-registry)

The purpose of component-registry is to help you create reusable components that are easy to extend and customise. It is heavily inspired by battle proven concepts that have been available for many years in the Python community through the Zope Toolkit(ZTK).

Think of it as decoupled imports and a straightforward way of doing composition.

### Migration to 1.0 ###
Check the end of this document for a migration guide!

Version 1.0 should be a drop in replacement for 0.2.x and 0.3.x. All tests from 0.3 have been moved to the refactored 1.0 release.

### Sample Code ###
```JavaScript
import { createInterfaceClass, Adapter, createObjectPrototype } from 'component-registry'
const Interface = createInterfaceClass('test')

const IUser = new Interface({name: 'IUser'})

const IDisplayWidget = new Interface({name: 'IDisplayWidget'})
IDisplayWidget.prototype.render = function () {}

const adapter = new Adapter({
    implements: IDisplayWidget,
    adapts: IUser,
    render: function () {
        console.log(`I am a ${this.context._type}`)
    }
})

const User = createObjectPrototype({
    implements: [IUser],
    constructor(params) {
        this._type = 'User'
    }
})

const oneUser = new User()

new IDisplay(oneUser).render()
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
ObjectPrototypes contain a bit more than just data. They are passed `implements` that contains an array of Interfaces that describe the capabilities of that object. The order is important, the first Interface in this array tells us what this ObjectPrototype is. The rest tell us what other things this ObjectPrototype contains or can be used for. This could be a list of implemented Interfaces:

```JavaScript
import { createObjectPrototype } from 'component-registry'
const Employee = createObjectPrototype({
    implements: [IEmployee, IUser, IHasAvatar],
    ...
})
```
The ObjectPrototype should be called Employee, which corresponds to the most significant Interface it implements. When you instantiate an object of type Employee you will find the Interfaces as the property `_implements`.

The `globalRegistry` uses these interfaces in order to find Adapters for you that can be used with your Employee objects. Say that you want to render a directory listing of your employees. You decide you want each row to be rendered by using an Adapter that you find with the interface `IDirectoryListEntryWidget`, you can call the Interface what ever you want. Now you need to implement that Adapter so it can render your Employee object. It would look something like this:

```JavaScript
import { Adapter } from 'component-registry'

const DirectoryListEntryWidget = new Adapter({
    implements: IDirectoryListEntryWidget,
    adapts: IEmployee,
    render: function () { ... }
})
```
The parameter **implements** tells the globalRegistry what the Adapter can do. The parameter **adapts** tells the globalRegistry what kind of object it can do this with.

So when you want to render the list you would write something like this:

```JavaScript
import { IDirectoryListEntryWidget } from './myAppInterfaces'
function renderList (entries) {
    var outp = entries.map((entry) => new IDirectoryListEntryWidget(entry).render())
    return outp.join('\n')
}
```
Your list rendering code has no idea how the individual widgets are rendered, it is all done by the widget. All it knows is that it should get the `IDirectoryListEntryWidget` adapter that adapts the `entry` object.

In a simple case with only a single object type this still makes the code compact and readable. But the power becomes more apparent if we have more object types in our entries list. There could be ten different object types, each with their own registered Adapter that implements IDirectoryListEntryWidget. These list items can all be rendered by the same code which is blissfully unaware of how different the implementations are.

### The Power of Inheritance ##
The ObjectPrototype doesn't only have Interfaces, it can also inherit interfaces and methods from other ObjectPrototypes. This allows us to gradually refine the capabilities of our entity objects. Employee could inherit from BaseObject. SalesRep and Manager could inherit from Employee. This is done by adding an `extends` property when creating your ObjectPrototype:

```JavaScript
const Manager = createObjectPrototype({
    implements: [IManager],
    extends: [Employee],
    constructor: function (data) {
        ...
    }
}) 
```
The cool thing with Adapters is that since we have extended Employee, our new Manager object will also implement IEmployee. This means that if we ask for IDirectoryListEntryWidget it will return the Adapter we created to render the Employee (i.e. which adapts IEmployee). In other words, by extending Employee we get everything available to Employee objects out of the box. However, once we create a specialised Adapter which implements IManager, this will take precedence during the lookup process in `globalRegistry`. In order words we will be able to render our Manager object out of the box, but we can create a specialised widget at any time.

This is super powerful when creating a CMS. There will be a ton of Employee widgets that you can and want to share with Manager objects. You only need to create special widgets in the few cases where you want Manager objects to be rendered differently.

SIDE NOTE: Since Javascript is a dynamicly typed language and all lookups can be resolved at run-time which means you can also use composition-style inheritance. All you need to do is add the Interfaces you want your object to implement, and also any inherited methods, during the execution of your contructor method. If you are really into that stuff you'll probably figure it out. But I suggest using the existing inheritance mechanism to start with, it is very powerful.

## Public API ##

```JavaScript
import { globalRegistry } from 'component-registry'
```
Use the global registry to register you adapters and utilities.

WARNING! The registry is also available as a global variable. You should not make
your code dependent on using the global variable, it is mainly intended for
debugging purposes. Always require the registry for proper use. The global variable
might be removed when run in production mode.

You will also use these extensively:

```JavaScript
// To ceate interfaces
import { createInterfaceClass } from 'component-registry'
const Interface = createInterfaceClass('my-namespace') 

// To create adapters
import { Adapter } from 'component-registry'

// To create utilities
import { Utility } from 'component-registry'

// To create object prototypes
import { createObjectPrototype } from 'component-registry'
```

For advanced use, you can create your own adapter and/or utility registry. The use
case could be to create a sub system that can't be accessed by the rest of your app.
```JavaScript
import { Registry, AdapterRegistry, UtilityRegistry } from 'component-registry'
```

## Object Prototypes ##

We implement Object Prototypes as a means of creating base prototypes with support for inheritance. These support multiple inheritance so you can organise your code in a flexible way. The order of inheritance decides overloading, first in line is most important. You can create inheritance graphs like this (left to right)

    BaseProto
            |- UserProto
            |          |- AdminUserProto
            |- ProductProto
                          |- ProductWithVariantsProto
                          |- VariableLengthProductProto
                          
But also (left to right)

    BaseProto ---|
                 |- NewsProto
    SocialProto -|

Object Prototypes can implement interfaces. This declares what capabilities they are supposed to support. Interfaces are used for looking up Adapters among other things. An Object Prototype will inherit all interfaces from it's inherited Object Prototypes.

NOTE: A prototype object that extends other prototype objects won't pass an instaceof check on the inherited prototype. Provided the above inheritance graph we get:

    var obj = new NewsProto();
    obj instanceof NewsProto == true;
    obj instanceof BaseProto == false;

For type checking you should use Interfaces, which also is more predictable when doing composition (multiple inheritance).

```JavaScript
INewsProto.providedBy(obj) == true
IBaseProto.providedBy(obj) == true
```

Bascially you aren't asking what type the object is, you ask what capabilities (i.e. Interfaces) it provides.

Interfaces also provide a convenient way of looking up adapters and utilities.

## Adapters ##

Adapters provide functionality for objects. It literally adapts an object for use in a specific context, such as rendering UI-widgets. When you ask for an adapter from the adapter registry it finds an adapter that implements the interface you are asking for the specific object you are working with. A look can be done in two ways:

```JavaScript
import { IPermissions } from './interfaces'
import { globalRegistry } from 'component-registry'

// The pretext here is that we have registered adapters somewhere
// wich adapt userObj that was also created somehow

const userObj = ...

// New and more readable syntax
const permissionsByShorthand =  new IPermissions(userObj).getPermissions()

// Old syntax 
const permissionsTheOldWay = globalRegistry.getAdapter(userObj, IPermissions).getPermissions()
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


```JavaScript
import { IDatabaseService } from './interfaces'
import { globalRegistry } from 'component-registry'

// The pretext here is that we have registered utilities somewhere

// New and more readable syntax
const connectionByShorthand =  new IDatabaseService().connect()
const namedConnectionByShorthand =  new IDatabaseService('mongodb').connect()

// Old syntax 
const connectionTheOldWay = globalRegistry.getUtility(IDatabaseService).connect()
const namedConnectionTheOldWay = globalRegistry.getUtility(IDatabaseService, 'mongodb').connect()
```

The point of using utilities is that you can define the interface in a general component but leave the implementation up to the application that uses the component. An example would be a database connection. The component needs a database connection but doesn't know what authorisation credentials to use, so it asks for these by calling the utility registry and requesting say a IDatabaseCredentials utility. It is then up to the application developer to create this utility and register it as an implementation of IDatabaseCredentials.

This is a nice way to decouple and organise your code.

### About Named Utilities ###

Another example of how to use a utility could be if you want to provide internationalisation features. In which case you could give each utility a name that corresponds to the region it implements. So basically you would ask for `new ILocalization('us')` for the United States and `new ILocalization('se')` for Sweden. You can also query for all named utilities that implement ILocalization and get them as a list `globalRegistry.getUtilities(ILocalization)`.

# API Docs #

### Object Prototypes ###

```JavaScript
import { createObjectPrototype } from 'component-registry'
const MyObjectPrototype = createObjectPrototype({
    implements: [IObject],
    sayHi() {
        return "Hi!"
    }
})
```
The object implements the provided list of interfaces and the method sayHi will be added to the object.prototype and available to instantiated objects.

The first interface in the list is significant. It should be a unique interface describing the object. The name of this interface is used for inheritance.

```JavaScript
const obj = new MyObjectPrototype();
```
Creates an instance of the object prototype you created above.

### Object Prototypes and Inheritance ###
You can create an object prototype that inherits methods and interfaces from other object prototypes

```JavaScript
import { createObjectPrototype } from 'component-registry'
const AnotherObjectPrototype = createObjectPrototype({
    extends: [MyObjectPrototype],
    implements: [IAnotherObject],
    // Inherits IObject from MyObjectPrototype
    sayHo() {
        return "Ho!"
    }
    // Inherits sayHi() from MyObjectPrototype
})

import { createObjectPrototype } from 'component-registry'
const OverridingPrototype = createObjectPrototype({
    extends: [AnotherObjectPrototype],
    implements: [IOverriding],
    // Inherits IObject from MyObjectPrototype
    // Inherits IAnotherObject from AnotherObjectPrototype
    sayHi() {
        return "Ho! " + this._IObject.sayHi.call(this);
    }
    // Inherits sayHo() from AnotherObjectPrototype
    // Inherits sayHi() from MyObjectPrototype but overrides it
})
```
`OverridingPrototype` inherits the method *sayHi()* but it is overridden by the local implementation of *sayHi()*. It is still possible to access the original sayHi() method but it will be available like thos `this._IObject.sayHi.call(this)`, where `_IObject` is derived from the name of the first implemented interface of *MyObjectProtype*.

The method sayHi() returns "Ho! Hi!".

### Interfaces ###
```JavaScript
import { createInterfaceClass } from 'component-registry'
const Interface = createInterfaceClass('my-namespace') // Use the name of your module as namespace
```

Create the Interface class which in turn is used to create interfaces. It takes a single parameter, namespace, to prevent name and id conflicts. The id of the interface is a UUID built from namespace and name. The id should be the same regardless of when you create it.

```JavaScript
// We need the Interface created above
const IInterface = new Interface({ name: 'IInterface' });
```
Creates a simple marker interface.

Use the convention of prefixing interfaces with "I" to improve readability.

An interface will add any params you pass prefixed with underscore ('_'):

```JavaScript
// We need the Interface created above
const IInterface = new Interface({
    name: 'IInterface',
    schema: {...}
});
```
- name: Used to create the id
- schema: `isomorphic-schema` field definition that will add propper JS properties to object prototypes respecting `readOnly`

```JavaScript
import { Schema } from 'isomorphic-schema'
import { TextField } from 'isomorphic-schema/lib/field_validators/TextField'
const IUser = new Interface({
    name: 'IUser',
    schema: new Schema({
        schemaName: 'IUser Schema',
        fields: {
            name: new TextField({})
        }
    })
})

const User = createObjectPrototype({
    implements: [IUser]
})

const user = new User()
user.hasOwnProperty('name')
// true
user.name
// undefined
```

You can add dummy functions to your interface prototype to show what methods are required for an adapter, utility or object prototype that implements that interface. Note: object prototypes will in most cases be simple data objects with no or few methods.

```JavaScript
import { IUser } from './my/app/interfaces'

const IDisplayWidget = new Interface({
    name: 'IDisplayWidget'
})

IDisplayWidget.prototype.render = function () {}

const a = new Adapter({
    implements: IDisplayWidget,
    adapts: IUser,
    render() { /* do something */ }
})
// The render method exists so this completes without issues

const b = new Adapter({
    implements: IDisplayWidget,
    adapts: IUser
})
// The render method is missing and the Adapter constructor will throw an error
```

### Adapters ###




**new Adapter(params)**

Create and adapter that adapts an interface or an object prototype. It is automatically registered with the `globalRegistry` available in component-registry.

```JavaScript
import { Adapter } from 'component-registry'

const MyAdapter = new Adapter({
    implements: IInterface,
    adapts: IInterface || ObjectPrototype
})
```

If you want to register the created adapter with a custom registry instead of `globalRegistry` you pass it as a parameter.

```JavaScript
const MyAdapter = new Adapter({
    registry: myOwnRegistry,
    implements: IInterface,
    adapts: IInterface || ObjectPrototype
})
```

### Utilities ###
```JavaScript
const utility = new Utility({
    implements: IInterface
});
```
Create an unamed utility that implements a given interface. It is automatically registered with the `globalRegistry` available in component-registry.

```JavaScript
const utility = new Utility({
    implements: IInterface,
    name: 'name'
});
```
Create a named utility that implements a given interface and has a variation name. It is automatically registered with the `globalRegistry` available in component-registry.

```JavaScript
const utility = new Utility({
    registry: myRegistry,
    implements: IInterface
});
```
Just like an adapter you can pass a custom registry to register the utility there.

```JavaScript
const utils = registry.getUtilities(IInterface);
```
Find all registered utilities (named and unnamed) that implement the given interface.

## Registry ##
```JavaScript
import { AdapterRegistry, UtilityRegistry, Registry } from 'comonent-registry'
const myRegistry = new Registry();
const myAdapteregistry = new AdapterRegistry();
const myUtilityRegistry = new UtilityRegistry();
```

When you have created a scoped registry you might want to register some of your existing adapters. In this case you would use the registration API:

```JavaScript
    registry.registerAdapter(MyAdapter);
    registry.registerUtility(utility);
```
Get a list of utilities that implement a given interface (returns list of objects that contain the utility and name (if it is a named utility))

Good luck!

## Migrating to 1.0 ##

Migration is mostly about search and replace, all params are the same. Note, if you do introspection there might be a slight change of naming of props on the created objects. We have had ".schema" which now should be "._schema". If you rely on .schema you need to change this.

### Interface ###
```JavaScript
// Old syntax
import { createInterface } from 'component-registry'

const IDummy = createInterface({ name: 'IDummy' })

// New syntax
import { createInterfaceClass } from 'component-registry'
const Interface = createInterfaceClass('my-app-namespace')

const IDummy = new Interface({ name: 'IDummy' })
```

### Adapter ###
```JavaScript
// Old syntax
import { createAdapter } from 'component-registry'
createAdapter({
    implements: 'IWidget',
    adapts: 'IMyObject'
}).registerWith(globalRegistry)

// New syntax
import { Adapter } from 'component-registry'
new Adapter({
    implements: 'IWidget',
    adapts: 'IMyObject'
})
```

### Utility ###
```JavaScript
// Old syntax
import { createUtility } from 'component-registry'
createUtility({
    implements: 'IService'
}).registerWith(globalRegistry)

// New syntax
import { Utility } from 'component-registry'
new Utility({
    implements: 'IService'
})
```

### ObjectPrototype ###
No changes!
