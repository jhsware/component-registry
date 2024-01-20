import { LocalRegistry, TRegistry } from './localRegistry';
import { Adapter } from './adapterFactory';
import { Utility, UtilityNotFound } from './utilityFactory';
import { UtilityInterface, AdapterInterface, MarkerInterface, ObjectInterface } from './interfaceFactory';
import { ObjectPrototype } from './objectFactory';
import { isWildcard } from './utils';

global.registry ??= new LocalRegistry();

export const globalRegistry: TRegistry & {
  register: Function
  lookup: Function
} = global.registry;

globalRegistry.register = (target: any, context: any = undefined) => {
  if (target.prototype instanceof Utility) {
    globalRegistry.registerUtility(target);
  } else if (target.prototype instanceof Adapter) {
    globalRegistry.registerAdapter(target);
  } else {
      throw new Error('You can only register utilities or adapters');
  }

  return target;
}

globalRegistry.lookup = (intrfc: UtilityInterface | AdapterInterface, objOrName?: string | typeof ObjectPrototype<any> | ObjectInterface | MarkerInterface | undefined) => {
  if (intrfc instanceof UtilityInterface) {
    // TODO: Implement
    if (isWildcard(objOrName)) {
      return globalRegistry.getUtilities(intrfc);
    } else if (typeof objOrName === 'string' || objOrName === undefined) {
      return (globalRegistry.getUtility(intrfc, objOrName as string | undefined) ?? new UtilityNotFound()) as any;;
    } else {
      throw new Error('The second param should be a string or undefined');
    }
  } else if (intrfc instanceof AdapterInterface) {
    // TODO: Implement
    if (typeof objOrName === 'object' && objOrName !== null) {
      return globalRegistry.getAdapter(objOrName, intrfc);
    } else {
      throw new Error('The second param should be an ObjectPrototype, ObjectInterface or MarkerInterface');
    }
  } else {
      throw new Error('The first param should be an utility or adapter interface');
  }
}
