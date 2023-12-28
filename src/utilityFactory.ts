import { UtilityInterface } from './interfaceFactory';
import { TUtilityRegistry } from './utilityRegistry';

export type TUtilityProps = {
  name?: string,
  registry?: TUtilityRegistry,
}

export class Utility<TUtility> {
  static __implements__: typeof UtilityInterface;
  static __name__: string;
}

export class UtilityNotFound { }
