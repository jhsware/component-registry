const Interface = require('./interfaceFactory').createInterfaceClass('compat')
const { Adapter } = require('./adapterFactory')
const { Utility } = require('./utilityFactory')

let deprecateWarning = true

function warn () {
  if (process.env.NODE_ENV === 'production') return

  console.warn('[component-registry] USe of createInterface, createAdapter and createUtility is deprecated. Please update your code it is pretty easy! Check instructions at https://github.com/jhsware/component-registry')
  deprecateWarning = false
}

module.exports.createInterface = function (params) {
  if (deprecateWarning) warn()
  return new Interface(params, true)
}

function registerAdapterHelper (registry) {
  registry.registerAdapter(this);
  return this;
}

module.exports.createAdapter = function (params) {
  if (deprecateWarning) warn()
  const adapter = new Adapter(params, true)
  
  // Convenience method to simplify code to register
  adapter.registerWith = registerAdapterHelper

  return adapter
}

function registerUtilityHelper (registry) {
  registry.registerUtility(this);
  return this;
}

module.exports.createUtility = function (params) {
  if (deprecateWarning) warn()
  const util = new Utility(params, true)

  // Convenience method to simplify code to register
  util.registerWith = registerUtilityHelper

  return util
}
