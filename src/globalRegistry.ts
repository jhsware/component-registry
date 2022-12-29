import { LocalRegistry, TRegistry } from './localRegistry';
import { Adapter } from './adapterFactory';
import { Utility } from './utilityFactory';

global.registry ??= new LocalRegistry();

export const globalRegistry: TRegistry & { register: Function } = global.registry;

globalRegistry.register = (target: any) => {
  if (target.prototype instanceof Utility) {
    globalRegistry.registerUtility(target);
  } else if (target.prototype instanceof Adapter) {
    globalRegistry.registerAdapter(target);
  } else {
      throw new Error('You can only register utilities or adapters');
  }
}
