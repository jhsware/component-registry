# Documentation #

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

## Named Utilities ##

Another example of how to use a utility could be if you want to provide internationalisation features. In which case you could give each utility a name that corresponds to the region it implements. So basically you would ask for (ILocalization, "us") for the United States and (ILocalization, "se") for Sweden. You can then query for all named utilities that implement ILocalization and get them as a list.

Or perhaps you want to use

## API ##

### Object Prototypes ###

**createObjectPrototype**

Create an object prototype that you can instantiate objects with

    var UserPrototype = createObjectPrototype({
        implements: [interface],
        sayHi: function () {
            return "Hi!"
        }
    })

The object implements the provided list of interfaces and the method sayHi will be added to the object.prototype and available to instantiated objects.

Create an object instance

    var obj = new ObjectPrototype();

Create an instance that inherits methods and implemented interfaces from other object prototypes

    var AnotherObjectPrototype = createObjectPrototype({
        extends: [UserPrototype],
        implements: [another_interface],
        sayHo: function () {
            return "Ho!"
        }
    })

This object prototype inherits the method *sayHi* and will implement *another_interface* and *interface*.

### Interfaces ###

**createInterface()**

Create an interface without a provided schema

    var IInterface = createInterface();

We use the convention of prefixing interfaces with "I" to improve readability.

### Adapters ###

**new AdapterRegistry()**

Create a new adapter registry

    var registry = new AdapterRegistry();

**createAdapter(params)**

Create and adapter that adapts an interface or an object prototype

    var MyAdapter = createAdapter({
        implements: IInterface,
        adapts: interface || objPrototype
    })

**registerAdapter(Adapter)**

Register the created adapter with the adapter registry

    registry.registerAdapter(MyAdapter);

**getAdapter(object, interface)**

Get an adapter for an object

    var adapter = registry.getAdapter(obj, IInterface);

### Utilities ###

**new UtilityRegistry()**

Create a utility registry

    var registry = new UtilityRegistry();

**createUtility(params)**

Create an unamed utility that implements a given interface

    var utility = createUtility({
        implements: IInterface,
    });

Create a named utility that implements a given interface and has a variation name

    var utility = createUtility({
        implements: interface,
        name: name
    });

**registerUtility(Utility)**

Register the cerated utility with the utility registry

    registry.registerUtility(utility);

**getUtility(Interface [, name])**

Get a utility that implements a given interface (pass name to get a named utility)

    var util = registry.getUtility(Interface, 'name');

**getUtilities(Interface)**

Get a list of utilities that implement a given interface (returns list of objects that contain the utility and name (if it is a named utility))

    var utils = registry.getUtilities(IInterface);

# Some Random Doodles During Development #

BaseObject implements IBaseObject

RenderBaseAdapter adapts IBaseObject and implements IRenderObject

UserObject inherits from BaseObject and implements IUserObject

RenderUserAdapter adapts IUserObject and implements IRenderObjectAdapter

AnotherObject inherits from BaseObject and implements IAnotherObject but has no specific IRenderObjectAdapter

When you get a list of UserObjects and AnotherObjects you can get the render adapters by IRenderObjectAdapter and the correct implementation will be returned.

In other words, I need to create a list of implemented interfaces for the object including those implemented by the parent

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


/* IMPLEMENTATION NOTES */

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


## TO DEBUG TESTS ##

Run the tests with the mocha command with the debug option 

    $ node_modules/mocha/bin/mocha --debug-brk
    
Open a second shell and run node-inspector

    $ node-inspector
    
When you open the inspector in a browser, just set the breakpoint in your code
and resume the execution (play button)

## TODO ##
- DONE: Create Node project
- TODO: Write document explaining how this works and then implement in code, if it can't be explained, it can't be understood...
- STARTED: Add tests with mocha
- STARTED: Implement Interface
    - I want it to handle inheritance so I can override interfaces but perhaps this is on the adapter
    - Need to implement inheritance in registry lookup, perhaps use chaining?
- TODO: Should I do this with ES6 classes?

