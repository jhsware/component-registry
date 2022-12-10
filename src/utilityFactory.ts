
import { globalRegistry } from './globalRegistry'
import { UtilityInterface } from './interfaceFactory';
import { TUtilityRegistry } from './utilityRegistry';
import { isUndefined } from './utils';

export type TUtilityProps = {
  name?: string,
  registry?: TUtilityRegistry,
}

export class Utility<TUtility> {
  get __implements__(): typeof UtilityInterface { return };
  __name__: string;
  constructor({ name, registry }: TUtilityProps) {
    this.__name__ = name;
    (registry ?? globalRegistry).registerUtility(this);
  }

  for(name?: string, registry?: TUtilityRegistry): Omit<TUtility, 'interfaceId'> & { __name__?: string } {
    const r = registry ?? globalRegistry;
    return (r.getUtility(this.__implements__, this.__name__) ?? new UtilityNotFound());
  }
}

export class UtilityNotFound { }
