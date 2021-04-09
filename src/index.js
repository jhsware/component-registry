
import {
  Registry,
  globalRegistry } from './globalRegistry'

import { LocalRegistry } from './localRegistry'

import AdapterRegistry from  './adapterRegistry'
import UtilityRegistry from  './utilityRegistry'

import { createInterfaceClass } from  './interfaceFactory'

import { Adapter } from  './adapterFactory'

import { Utility } from  './utilityFactory'

import { createObjectPrototype } from  './objectFactory'

// Compat, deprecated as of 2.0 (throws error)
import {
  createInterface,
  createAdapter,
  createUtility } from  './compat'

export {
  globalRegistry,
  
  Registry,
  LocalRegistry,
  AdapterRegistry,
  UtilityRegistry,

  createObjectPrototype,
  createInterfaceClass,

  Adapter,
  Utility,

  // Compat, deprecated as of 2.0 (throws error)
  createInterface,
  createAdapter,
  createUtility

}