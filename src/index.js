
import {
  Registry,
  globalRegistry } from './globalRegistry'

import AdapterRegistry from  './adapterRegistry'
import UtilityRegistry from  './utilityRegistry'

import { createInterfaceClass } from  './interfaceFactory'

import { Adapter } from  './adapterFactory'

import { Utility } from  './utilityFactory'

import { createObjectPrototype } from  './objectFactory'

// Compat, deprecate for 2.0
import {
  createInterface,
  createAdapter,
  createUtility } from  './compat'

export default {
  globalRegistry,
  
  Registry,
  AdapterRegistry,
  UtilityRegistry,

  createObjectPrototype,
  createInterfaceClass,

  Adapter,
  Utility,

  // Compat, deprecate for 2.0
  createInterface,
  createAdapter,
  createUtility

}