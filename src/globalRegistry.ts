import { AdapterRegistry, TAdapterRegistry } from './adapterRegistry'
import { TUtilityRegistry, UtilityRegistry } from './utilityRegistry'
import { isTest } from './common';
import { LocalRegistry } from './localRegistry';
// TODO: This type def should be in LocalRegistry
export type TRegistry = TUtilityRegistry & TAdapterRegistry;

global.registry ??= new LocalRegistry();

export const globalRegistry = global.registry;