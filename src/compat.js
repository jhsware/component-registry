import { createInterfaceClass } from './interfaceFactory'
const Interface = createInterfaceClass('compat')
import { Adapter } from './adapterFactory'
import { Utility } from './utilityFactory'

let deprecateWarning = true

function warn () {
  if (process.env.NODE_ENV === 'production') return

  console.warn('[component-registry] USe of createInterface, createAdapter and createUtility is deprecated. Please update your code it is pretty easy! Check instructions at https://github.com/jhsware/component-registry')
  deprecateWarning = false
}

export function createInterface(params) {
  if (deprecateWarning) warn()
  return new Interface(params, true)
}

function registerAdapterHelper (registry) {
  registry.registerAdapter(this);
  return this;
}

export function createAdapter(params) {
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

export function createUtility(params) {
  if (deprecateWarning) warn()
  const util = new Utility(params, true)

  // Convenience method to simplify code to register
  util.registerWith = registerUtilityHelper

  return util
}
