'use strict';

import Registry from './globalRegistry';
export var globalRegistry = new Registry();

import AdapterRegistry from './adapterRegistry';
import UtilityRegistry from './utilityRegistry';

import { createInterfaceClass } from './interfaceFactory';

import { Adapter } from './adapterFactory';

import { Utility } from './utilityFactory';

import { createObjectPrototype } from './objectFactory';

// Compat, deprecate for 2.0
import { createInterface, createAdapter, createUtility } from './compat';

export default {
  Registry: Registry,
  AdapterRegistry: AdapterRegistry,
  UtilityRegistry: UtilityRegistry,

  createObjectPrototype: createObjectPrototype,
  createInterfaceClass: createInterfaceClass,

  Adapter: Adapter,
  Utility: Utility,

  // Compat, deprecate for 2.0
  createInterface: createInterface,
  createAdapter: createAdapter,
  createUtility: createUtility

};
//# sourceMappingURL=index.js.map