'use strict'

var AdapterRegistry = require('./adapterRegistry');
var UtilityRegistry = require('./utilityRegistry');

module.exports = (function () {
  /*

    Creates both utility and adapter registry, both mounted on global.registry
    You can access these like this:

      global.registry.registerAdapter()
      global.registry.registerUtility()
      ...

  */

    if (typeof global.registry === 'undefined') {
        console.log('[component-registry] Creating component utility registry');
        global.registry = new UtilityRegistry();

        console.log('[component-registry] Creating component adapter registry');
        var tmp = new AdapterRegistry();
        
        Object.keys(tmp).forEach(function (key) {
            if (tmp.hasOwnProperty(key)) {
                global.registry[key] = tmp[key];
            }
        })

        global.registry['registerAdapter'] = tmp.registerAdapter;
        global.registry['getAdapter'] = tmp.getAdapter;
    }

    return global.registry;
})()
