import { UtilityInterface } from './interfaceFactory';
import { TUtilityRegistry } from './utilityRegistry';

export type TUtilityProps = {
  name?: string,
  registry?: TUtilityRegistry,
}

export class Utility {
  static __implements__: UtilityInterface;
  static __name__?: string;
}

export class UtilityNotFound { }
