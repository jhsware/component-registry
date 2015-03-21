'use strict';

var AdapterRegistry = function () {
    this.adapters = {};
} 

AdapterRegistry.prototype.registerAdapter = function (adapter) {
    /*
        Add an adapter to the registry
    
        adapts -- interface or object prototype that the adapter decorates
        implementsInterface -- the interface that the adapter implements
        adapter -- the prototype of the adapter to instantiate on get
    */
    var adapts = adapter.prototype._adapts, 
        implementsInterfaces = adapter.prototype._implements;
        
    // TODO: Check that the adapter implements the interface
    // TODO: else throw InterfaceNotImplementedError
    
    // Register the adapter
    var tmpInterfaceId = implementsInterfaces[0].interfaceId;
    if (typeof this.adapters[tmpInterfaceId] === 'undefined') {
        this.adapters[tmpInterfaceId] = {
            implementsInterface: implementsInterfaces[0],
            interfaceAdapters: [],
            objectAdapters: []
        }
    }
    
    var adapters = this.adapters[tmpInterfaceId];
    
    if (adapts.interfaceId) {
        // This should be registered as an interface
        adapters.interfaceAdapters.push({
            adapts: adapts,
            adapter: adapter
        });
    } else {
        // This should be registered as an object adaptor
        adapters.objectAdapters.push({
            adapts: adapts,
            adapter: adapter
        });
        
    }    
}

// TODO: implement hasAdapter (returns true or false), look at getAdapter

AdapterRegistry.prototype.getAdapter = function (obj, implementsInterface) {
    /*
        Return an instance of an adapter for the provided object which implements
        the provided interface.
    */
    var adapters = this.adapters[implementsInterface.interfaceId];
    
    if (adapters) {
        // First check if an object adapter matches
        for (var i = 0, imax = adapters.objectAdapters.length; i < imax; i++) {
            var tmp = adapters.objectAdapters[i];
            if (obj.interfaceId === tmp.adapts.interfaceId) {
                // Found the adapter, instansiate and return (adapter should set obj as context on creation)
                var outp = new tmp.adapter(obj);
                return outp;
            }
            
        } 
        // Then check if an interface adapter matches, iterate over each interface implemented by the
        // passed object to find the first match.
        for (var j = 0, jmax = obj._implements.length; j < jmax; j++) {
            var tmpInterface = obj._implements[j];
            for (var i = 0, imax = adapters.interfaceAdapters.length; i < imax; i++) {
                var tmp = adapters.interfaceAdapters[i];
                if (tmpInterface.interfaceId === tmp.adapts.interfaceId) {
                    // Found the adapter, instansiate and return (adapter should set obj as context on creation)
                    var outp = new tmp.adapter(obj);
                    return outp;
                }
                
            }
        }
        // TODO: If we get this far, throw AdapterNotFoundError
    } else {
        // TODO: Throw AdapterNotFoundError
    }
}

module.exports = AdapterRegistry;