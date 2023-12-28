import { ObjectInterface, MarkerInterface, AdapterInterface } from './interfaceFactory';
import { ObjectPrototype } from './objectFactory';

type TAdapter<T> = {
  context: T;
}

export abstract class Adapter<TContext = ObjectPrototype<any>> implements TAdapter<TContext> {
  //__implements__: typeof AdapterInterface;
  static __implements__: typeof AdapterInterface;
  static __adapts__: typeof ObjectPrototype<any> | ObjectInterface | MarkerInterface;

  context: TContext;

  constructor(context: TContext) {
    this.context = context;
  }
}

export class AdapterNotFound {}
