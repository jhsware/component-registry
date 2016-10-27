'use strict';

/*

    Exceptions

*/

function UtilityRegistryException(message) {
   this.message = message;
   this.name = "AdapterRegistryException";
   this.stack = (new Error()).stack;
}

/*

    Utility Registry Code

*/



var UtilityRegistry = function () {
    this.utilities = {};
} 

UtilityRegistry.prototype.registerUtility = function (utility) {
    /*
        Add a utility to the registry
    
        implementsInterface -- the interface that the utility implements
        utility -- the prototype of the utility to instantiate on get
        name -- OPTIONAL add as named utility
    */
    var implementsInterface = utility.prototype._implements,  
        name = utility.prototype._name;
    
    // TODO: Check that the utility implements the interface
    // TODO: else throw InterfaceNotImplementedError
    
    // Register the utility
    if (typeof this.utilities[implementsInterface.interfaceId] === 'undefined') {
        this.utilities[implementsInterface.interfaceId] = {
            implementsInterface: implementsInterface,
            unnamedUtility: undefined,
            namedUtility: {}
        }
    }
    
    var utilities = this.utilities[implementsInterface.interfaceId];
    
    if (name) {
        // Register as a named utility
        if (utilities.namedUtility[name]) {
            // TODO: Utility already registered, throw RegistrationError
            return
        }
        utilities.namedUtility[name] = {
            utility: utility,
            name: name
        }
    } else {
        // Register as an unnamed utility
        if (utilities.unnamedUtility) {
            // TODO: Utility already registered, throw RegistrationError
            return
        }
        
        utilities.unnamedUtility = {
            utility: utility
        }
    }
};

// TODO: Implement hasUtility (return true/false), look at getUtility

UtilityRegistry.prototype.getUtility = function (implementsInterface, name, fallbackReturnValue) {
    /*
        Return an instance of a utility that implements the given interface
        and optionally has provided name.
    */
    var utilities = this.utilities[implementsInterface.interfaceId];
    
    if (typeof utilities === "undefined") {
        if (arguments.length === 3) {
            return fallbackReturnValue;
        } else {
            throw new UtilityRegistryException(
                "Lookup Error: There is no utility registered for: " + implementsInterface.name + ". Check that you have registered it! :)"
            );
        }
    }
    
    if (name) {
        if (utilities.namedUtility[name]) {
            var Utility = new utilities.namedUtility[name].utility();
            return Utility;
        } else {
            if (arguments.length === 3) {
                return fallbackReturnValue;
            } else {
                throw new UtilityRegistryException(
                    "Lookup Error: There is no utility registered for: (" + implementsInterface.name + ", '" + name + "'). Check that you have registered it!"
                );                
            }
        }
    } else {
        if (utilities.unnamedUtility) {
            var Utility = new utilities.unnamedUtility.utility();
            return Utility;
        } else {
            if (arguments.length === 3) {
                return fallbackReturnValue;
            } else {
                throw new UtilityRegistryException(
                    "Lookup Error: There is no unnamed utility registered for: " + implementsInterface.name + ". Check that you have registered it!"
                );
            };
        }
    }
}

UtilityRegistry.prototype.getUtilities = function (implementsInterface) {
    /*
        Return a list of objects with utilities implementing the given interface. The name
        of named utilities is included.
            { name: 'whatever', utility: obj }
    */
    var utilities = this.utilities[implementsInterface.interfaceId];
    
    // We can find any utilities so we return an empty list
    if (!utilities) {
        return []
    }
    
    var outp = [];

    // Add the unnamed utility
    if (utilities.unnamedUtility) {
        outp.push(new utilities.unnamedUtility.utility());
    }
    
    // Add named utilities
    for (var key in utilities.namedUtility) {
        outp.push(new utilities.namedUtility[key].utility());
    }
    return outp;
}

module.exports = UtilityRegistry;