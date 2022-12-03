import { TAdapterRegistry } from './adapterRegistry';
import { globalRegistry } from './globalRegistry'
import { AdapterInterface, ObjectInterface, MarkerInterface } from './interfaceFactory';
import { ObjectPrototype } from './objectFactory';

export type TAdapter = {
  adapts: typeof MarkerInterface | typeof ObjectInterface | ObjectPrototype<any>,
  registry?: TAdapterRegistry,
  [index: string]: any;
}

export class Adapter {
  __implements__: typeof AdapterInterface;
  __adapts__: typeof MarkerInterface | typeof ObjectInterface | ObjectPrototype<any>;
  context: ObjectPrototype<any>;
  constructor({adapts, registry, ...props}: TAdapter) {
    this.__adapts__ = adapts;
    (registry ?? globalRegistry).registerAdapter(this);
    
    for (const k of Object.keys(props)) {
      this[k] = props[k];
    }
  }
}
