# component-registry #
[![Build Status](https://travis-ci.org/jhsware/component-registry.svg?branch=master)](https://travis-ci.org/jhsware/component-registry)

The purpose of component-registry is to help you create reusable components that are easy to extend and customise. It is heavily inspired by battle proven concepts that have been available for many years in the Python community through the Zope Toolkit(ZTK).

### The Global Registry ##
The brain of the component-registry is the `globalRegistry` which keeps track of all the components you have available in your application. These are normally registered at startup, but can be added at any time during your application lifecycle.

### Adapters, Utilities and ObjectPrototypes ##
There are three main object types that are available in component-registry. Adapters, Utilities and ObjectPrototypes.

**ObjectPrototypes** are basially entity objects. They contain data and often nothing more. ObjectPrototypes will look a lot like the JSON you would send between subsystems. 

An **Adapter** most of the time works in concert with an ObjectPrototype. You would ask the registry to find an adapter that has certain capabilities, perhaps methods that can convert the ObjectPrototype to JSON or HTML markup. The most obvious use of Adapters is to implement UI-widgets, but you can also use it for business logic that operates on an entity object. Basically you can move any methods you would otherwise place on an entity object to the adapter. This keeps the ObjectPrototypes lean and data centric.

**Utilities** are stateless components. They provide you with utility methods or system settings. You could get DB-credentials through a Utility, or you could provide methods for i18n-translations in a Utility. Just like Adapters you would ask the registry to find a Utility with the capabilities you require.

### Interfaces ##
The capabilities of your Adapters and Utilities are identified by **Interfaces**. These are marker objects with human readable names that you use to tell the `globalRegistry` what kind of Adapter or Utility you are looking for.

By using Interfaes you decouple your code. When asking the globalRegistry for an Adapter or Utility that implements a specific Interface you have no idea where or how it has been implemented. All you know is that it should be registered with the globalRegistry. In your application the benefit might not be obvious, but if you create an NPM package that requires your application to perform certain tasks, such as providing application specific i18n-translations, all the package needs to know is that it should ask for a Utility that implements a certain interface, say ITranslationUtil. Then it is up to your application to provide that utility so the package can access it at runtime.

This is a two way street, because if you want to change the package that consume ITranslationUtil, you won't have to worry about ripping out initialisation code etc. You only make sure the new package you have created asks for the same Interface and it is automatically hooked up with your existing Utility.

This becomes even more powerful when you have several NPM-packages that need to consume the same ITranslationUtil. You could create a meta-package that literally only contains Interfaces and then have both consuming packages and your application use those common Interfaces as glue.

Why is this good? Well it forces you to think about the architecture of your application. And it will automatically make you write reusable code without any added effort.

Another brilliant side-effect is that you can move your implementation code around, and also split it into it's own NPM-packages at any time, and as long as you don't move the Interface all the components will still find what it is looking without changing a single line of code. And if you need to move an Interface, it is easy to change the imports. This makes refactoring simple, fun and helps in agile development.  

### More on ObjectPrototypes and Adapters ##
ObjectPrototypes contain a bit more than just data. They also have a property called `implements` that contains an array of Interfaces that describe the capabilities of that object. The order is important, the first Interface in this array tells us what this ObjectPrototype is. The rest tell us what other things this ObjectPrototype contains or can be used for. This could be a list of implemented Interfaces:

```JavaScript
const Employee = createObjectPrototype({
    implements: [IEmployee, IUser, IHasAvatar],
    ...
})
```

The ObjectPrototype should be called Employee, which corresponds to the most significant Interface it implements. When you instantiate an object of type Employee you will find the Interfaces as the property `_implements`.

The `globalRegistry` uses these interfaces in order to find Adapters for you that can be used with your Employee objects. Say that you want to render a directory listing of your employees. You decide you want each row to be rendered by using an Adapter that you find with the interface `IDirectoryListEntryWidget`, you can call the Interface what ever you want. Now you need to implement that Adapter so it can render your Employee object. It would look something like this:

```JavaScript
const DirectoryListEntryWidget = createAdapter({
    implements: IDirectoryListEntryWidget,
    adapts: IEmployee,
    render: function () { ... }
}).registerWith(globalRegistry) // globalRegistry has been required from component-registry
```

The property **implements** tells the globalRegistry what the Adapter can do. The property **adapts** tells the globalRegistry what kind of object it can do this with.

So when you want to render the list you would write something like this:

```JavaScript
function renderList (entries) {
    var outp = entries.map((entry) => {
        const widget = globalRegistry.getAdapter(entry, IDirectoryListEntryWidget)
        return widget.render()
    })
    return outp.join('\n)
}
```

Your list rendering code has no idea how the individual widgets are rendered, it is done by the widget. All it knows is that it should get the IDirectoryListEntryWidget that adapts the entry object we passed to the `globalRegistry.getAdapter` call.

In the most simple case with only a single object type this still makes the code compact and readable. But the power becomes more apparent if we have more object types in our entries list. There could be ten different object types, each with their own registered Adapter that implements IDirectoryListEntryWidget and they would all be rendered by the same code which is blissfully unaware of how different the implementations are.

### The Power of Inheritance ##
The ObjectPrototype doesn't only have Interfaces, it can also extend other Object Prototypes. When you inherit another ObjectPrototype, you will also inherit all the interfaces it implements. This allows us to gradually refine the capabilities of our entity objects. Employee could inherit from BaseObject. SalesRep and Manager could inherit from Employee. This is done by adding an `extends` property when creating your ObjectPrototype:

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
var registry = require('component-registry').globalRegistry;
```
Use the global registry to register you adapters and utilities.

WARNING! The registry is also available as a global variable. You should not make
your code dependent on using the global variable, it is mainly intended for
debugging purposes. Always require the registry for proper use. The global variable
might be removed when run in production mode.

You will also use these extensively:

```JavaScript
var createInterface = require('component-registry').createInterface;

var createAdapter = require('component-registry').createAdapter

var createUtility = require('component-registry').createUtility

var createObjectPrototype = require('component-registry').createObjectPrototype
```

For advanced use, you can create your own adapter and/or utility registry. The use
case could be to create a sub system that can't be accessed by the rest of your app.
```JavaScript
var AdapterRegistry = require('component-registry').AdapterRegistry;

var UtilityRegistry = require('component-registry').UtilityRegistry;
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

In stead you should use Interfaces to figure out what the obj is:

```JavaScript
INewsProto.providedBy(obj) == true
IBaseProto.providedBy(obj) == true
```

Bascially you aren't asking what type the object is, you ask what capabilities (i.e. Interfaces) it provides.

## Adapters ##

Adapters provide functionality for objects. When you get an adapter from the adapter registry it matches registered adapters with the interface and object you are passing. This is what the registry does:

    registry.getAdapter(obj, ICoolAdapter)

    1 Find a set of registered adapters that claim to implement ICoolAdapter
     
    2a Check if any of these adapt the given object type
    
    2b If not, check if any of these adapt any of the interfaces that
      the object states that it implements
      
    3 Return an instance of the adapter with this.context set to obj
    
Now that you have the adapter you can start using it for a variety of scenarios:

    - Render the object to HTML
    
    - Manipulate the properties of the object
    
    - Persist the object to a backend
    
Adapters are basically a nice way of creating reusable business logic and render components that are loosly coupled (by interfaces) to the objects they manipulate. 

## Utilities ##

A utilitiy is a stateless object that provides a set of functions in your code. You create a utility and register it in the utility registry. To identify the capabilities of the utility you define an interface. This can optionally declare what methods attributes you can call on the utility or just be a marker interface. Declaring the interface is a good way to architect your api before implementation.

The point of using utilities is that you can define the interface in a general component but leave the implementation up to the application that uses the component. An example would be a database connection. The component needs a database connection but doesn't know what authorisation credentials to use, so it asks for these by calling the utility registry and requesting say a IDatabaseCredentials utility. It is then up to the application developer to create this utility and register it as an implementation of IDatabaseCredentials.

This is a nice way to decouple and organise your code.

### Named Utilities ###

Another example of how to use a utility could be if you want to provide internationalisation features. In which case you could give each utility a name that corresponds to the region it implements. So basically you would ask for (ILocalization, "us") for the United States and (ILocalization, "se") for Sweden. You can then query for all named utilities that implement ILocalization and get them as a list.

# API Docs #

### Object Prototypes ###

**createObjectPrototype(params)**

Create an object prototype that you can instantiate objects with

```JavaScript
    var ObjectPrototype = createObjectPrototype({
        implements: [IObject],
        sayHi: function () {
            return "Hi!"
        }
    })
```

The object implements the provided list of interfaces and the method sayHi will be added to the object.prototype and available to instantiated objects.

The first interface in the list is significant. It should be a unique interface describing the object. The name of this interface is used for inheritance.

Create an object instance

```JavaScript
    var obj = new ObjectPrototype();
```
Create an instance that inherits methods and implemented interfaces from other object prototypes

```JavaScript
    var AnotherObjectPrototype = createObjectPrototype({
        extends: [ObjectPrototype],
        implements: [IAnotherObject],
        sayHo: function () {
            return "Ho!"
        }
    })
```

This object prototype inherits the method *sayHi* and will implement *another_interface* and *interface*. Inherited methods are accessed by their method name on an instance of the object. If you want to access the overridden method you can access it through the _[interfaceNname] but you must use the .call-syntax to set the this variable:

```JavaScript
    var OverridingPrototype = createObjectPrototype({
        extends: [UserPrototype],
        implements: [IOverriding],
        sayHi: function () {
            return "Ho! " + this._IObject.sayHi.call(this);
        }
    })
```

The method sayHi() returns "Ho! Hi!".


### Interfaces ###

**createInterface()**

Create an interface without a provided schema

```JavaScript
    var IInterface = createInterface();
```

We use the convention of prefixing interfaces with "I" to improve readability.

### Adapters ###

**new AdapterRegistry()**

Create a new adapter registry

```JavaScript
    var registry = new AdapterRegistry();
```

**createAdapter(params)**

Create and adapter that adapts an interface or an object prototype

```JavaScript
    var MyAdapter = createAdapter({
        implements: IInterface,
        adapts: IInterface || ObjectPrototype
    })
```

**registerAdapter(Adapter)**

Register the created adapter with the adapter registry

```JavaScript
    registry.registerAdapter(MyAdapter);
```

**getAdapter(object, interface)**

Get an adapter for an object

```JavaScript
    var adapter = registry.getAdapter(obj, IInterface);
```

### Utilities ###

**new UtilityRegistry()**

Create a utility registry

```JavaScript
    var registry = new UtilityRegistry();
```

**createUtility(params)**

Create an unamed utility that implements a given interface

```JavaScript
    var utility = createUtility({
        implements: IInterface,
    });
```

Create a named utility that implements a given interface and has a variation name

```JavaScript
    var utility = createUtility({
        implements: IInterface,
        name: 'name'
    });
```

**registerUtility(Utility)**

Register the cerated utility with the utility registry

```JavaScript
    registry.registerUtility(utility);
```

**getUtility(Interface [, name])**

Get a utility that implements a given interface (pass name to get a named utility)

```JavaScript
    var util = registry.getUtility(Interface, 'name');
```

**getUtilities(Interface)**

Get a list of utilities that implement a given interface (returns list of objects that contain the utility and name (if it is a named utility))

```JavaScript
    var utils = registry.getUtilities(IInterface);
    
    /*
        [
            {
                utility: [Object object],
                name: 'name'    // optional
            }
        ]
    
    */
```

# Some Random Doodles During Development #

BaseObject implements IBaseObject

RenderBaseAdapter adapts IBaseObject and implements IRenderObject

UserObject inherits from BaseObject and implements IUserObject

RenderUserAdapter adapts IUserObject and implements IRenderObjectAdapter

AnotherObject inherits from BaseObject and implements IAnotherObject but has no specific IRenderObjectAdapter

When you get a list of UserObjects and AnotherObjects you can get the render adapters by IRenderObjectAdapter and the correct implementation will be returned.

In other words, I need to create a list of implemented interfaces for the object including those implemented by the parent

```JavaScript
IBaseObject = createInterface({
    extends: [],    // Optional
    schemaName: '', // Optional
    schemaDef: {    // Optional
    }
});

BaseObject = createObject({
    implementsInterfaces: [IBaseObject]
});

UserObject = createObject({
    extends: [BaseObject],
    implementsInterfaces: [IUserObject]
});

RenderBaseObjectAdapter = createAdapter({
    extends: [],    // optional
    implementsInterfaces: [IRenderObjectAdapter]
});
```

/* IMPLEMENTATION NOTES */
```JavaScript
registry.registerUtility(interface, name, object)
register.getUtility(interface, name)
    # Returns instance of utility


registry.registerAdapter(interface, name, object)
registry.getAdapter(interface, obj)

obj.implements = [Interface1, Interface2]

IInterface(obj)
    # Returns instance of adapter with provided object as context (this.context)
    
    
var Interface = function (schema) {
    this.schema = schema;
    this.interfaceId = randomId();
}    
    
var IUser = new Interface(schema)
    
var IChangeName = new Interface(schema)
    
var User = {
    implements: [IUser, IChangeName]
}

var theUser = new User();

IChangeName(theUser).update('New Name')

registry.getAdapter(theUser, IChangeName)
```

## HOWTO DEBUG TESTS ##

Run the tests with the mocha command with the debug option 

```
    $ node_modules/mocha/bin/mocha --debug-brk
```

Open a second shell and run node-inspector

```
    $ node-inspector
```

When you open the inspector in a browser, just set the breakpoint in your code
and resume the execution (play button)



## TODO ##
- DONE: Added Travis CI-support
- TODO: Throw an better error if we try to create an adapter or utility with out proper interfaces or objects provided
- TODO: Helper to debug registered components (when they aren't found)
- DONE: Create Node project
- TODO: Write document explaining how this works and then implement in code, if it can't be explained, it can't be understood...
- STARTED: Add tests with mocha
- STARTED: Implement Interface
    - I want it to handle inheritance so I can override interfaces but perhaps this is on the adapter
    - Need to implement inheritance in registry lookup, perhaps use chaining?
- TODO: Should I do this with ES6 classes?

