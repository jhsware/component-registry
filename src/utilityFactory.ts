
import { globalRegistry } from './globalRegistry'
import { UtilityInterface } from './interfaceFactory';
import { TUtilityRegistry } from './utilityRegistry';

export type TUtility = {
    name: string,
    registry?: TUtilityRegistry,
    [index: string]: any;
  }
  
  export class Utility {
    __implements__: typeof UtilityInterface;
    __name__: string;
    constructor({name, registry, ...props}: TUtility) {
      this.__name__ = name;
      (registry ?? globalRegistry).registerUtility(this);
      
      for (const k of Object.keys(props)) {
        this[k] = props[k];
      }
    }
  }
  