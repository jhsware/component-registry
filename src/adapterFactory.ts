import { TAdapterRegistry } from './adapterRegistry';
import { globalRegistry } from './globalRegistry'
import { ObjectInterface, MarkerInterface, AdapterInterface } from './interfaceFactory';
import { ObjectPrototype } from './objectFactory';

type TAdapts = typeof MarkerInterface | typeof ObjectInterface | typeof ObjectPrototype<any>;
type TAdapterProps = {
  adapts: TAdapts,
  registry?: TAdapterRegistry
}

export abstract class Adapter<TAdapter, TContext> {
  //__implements__: typeof AdapterInterface;
  get __implements__(): typeof AdapterInterface | undefined { return };
  __adapts__: TContext;
  context: TContext;
  constructor({
    adapts,
    registry = undefined
  }: TAdapterProps) {
    this.__adapts__ = adapts as TContext;
    (registry ?? globalRegistry).registerAdapter(this);
  }

  for(obj: ObjectPrototype<any>, registry?: TAdapterRegistry): Omit<TAdapter, 'interfaceId'> & { context: TContext } | Function {
    const r = registry ?? globalRegistry;
    return (r.getAdapter(obj, this.__implements__) ?? new AdapterNotFound());
  }
}

export class AdapterNotFound {}
