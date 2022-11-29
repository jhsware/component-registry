
import { isDevelopment } from './common'

/*

    Exceptions

*/

function UtilityRegistryException(message) {
   this.message = message;
   this.name = "UtilityRegistryException";
   this.stack = (new Error()).stack;
}

/*

    Utility Registry Code

*/



export const UtilityRegistry = function () {
    this.utilities = {};
} 

UtilityRegistry.prototype.registerUtility = function (utility) {
    /*
        Add a utility to the registry
    
        implementsInterface -- the interface that the utility implements
        utility -- the prototype of the utility to instantiate on get
        name -- OPTIONAL add as named utility
    */
    const implementsInterface = utility.prototype._implements,  
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
    
    const utilities = this.utilities[implementsInterface.interfaceId];
    
    if (name) {
        // Register as a named utility
        if (utilities.namedUtility[name]) {
            // Utility already registered, just skip it
            // "There is a utility already registered for: (" + implementsInterface.name + ", '" + name + "'). Check that you have registered it!")
            // Since this is literally the same component, it should be okay. This can happen when running code on server with several variations of
            // the same app
            return 
        }
        utilities.namedUtility[name] = {
            utility: utility,
            name: name
        }
    } else {
        // Register as an unnamed utility
        if (utilities.unnamedUtility) {
            // Utility already registered, just skip it
            // "There is a utility already registered for: (" + implementsInterface.name + ", '" + name + "'). Check that you have registered it!")
            // Since this is literally the same component, it should be okay. This can happen when running code on server with several variations of
            // the same app
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
    const utilities = this.utilities[implementsInterface.interfaceId];
    
    if (utilities && name) {
        if (utilities.namedUtility[name]) {
            const Utility = new utilities.namedUtility[name].utility();
            return Utility;
        } else {
            if (arguments.length === 3) {
                return fallbackReturnValue;
            } else {
                const message = ["Lookup Error: There is no utility registered for: (" + implementsInterface.name + ", '" + name + "'). Check that you have registered it!"];

                if (isDevelopment) {
                    message.push("Available named utilities that match the provided interface:")
                    Object.keys(utilities.namedUtility).forEach((key) => {
                        const intrfc = utilities.implementsInterface
                        message.push("[" + intrfc.name + "." + key + "] " + intrfc.interfaceId);
                    });
                }

                throw new UtilityRegistryException(message.join('\n'));                
            }
        }
    } else if (utilities && utilities.unnamedUtility) {
        const Utility = new utilities.unnamedUtility.utility();
        return Utility;
    } else {
        if (arguments.length === 3) {
            return fallbackReturnValue;
        } else {
            const message = ["Lookup Error: There is no utility registered for: " + implementsInterface.name + ". Check that you have registered it! :)"];

            if (isDevelopment) {
                message.push("Registered utilities implement the follwing interfaces:")
                Object.keys(this.utilities).forEach((key) => {
                    const util = this.utilities[key]
                    message.push("[" + util.implementsInterface.name + "] " + util.implementsInterface.interfaceId);
                });
            }

            throw new UtilityRegistryException(message.join('\n'));
        }
    }
}

UtilityRegistry.prototype.getUtilities = function (implementsInterface) {
    /*
        Return a list of objects with utilities implementing the given interface. The name
        of named utilities is included.
            { name: 'whatever', utility: obj }
    */
    const utilities = this.utilities[implementsInterface.interfaceId];
    
    // We can find any utilities so we return an empty list
    if (!utilities) {
        return []
    }
    
    const outp = [];

    // Add the unnamed utility
    if (utilities.unnamedUtility) {
        outp.push(new utilities.unnamedUtility.utility());
    }
    
    // Add named utilities
    for (const key in utilities.namedUtility) {
        outp.push(new utilities.namedUtility[key].utility());
    }
    return outp;
}
