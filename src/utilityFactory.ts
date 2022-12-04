
import { globalRegistry } from './globalRegistry'
import { UtilityInterface } from './interfaceFactory';
import { TUtilityRegistry } from './utilityRegistry';
import { isUndefined } from './utils';

export type TUtility = {
    name?: string,
    registry?: TUtilityRegistry,
    [index: string]: any;
  }
  
  export class Utility {
    get __implements__(): typeof UtilityInterface { return };
    __name__: string;
    constructor({name, registry, ...props}: TUtility) {
      if (!isUndefined(name)) {
        this.__name__ = name;
      }
      (registry ?? globalRegistry).registerUtility(this);
      
      for (const k of Object.keys(props)) {
        this[k] = props[k];
      }
    }
  }

  export class UtilityNotFound {}
  