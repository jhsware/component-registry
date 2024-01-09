import { ObjectInterface, MarkerInterface, AdapterInterface } from './interfaceFactory';
import { ObjectPrototype } from './objectFactory';

type TAdapter<T> = {
  context: T;
}

export abstract class Adapter<IContext = ObjectPrototype<any>> implements TAdapter<IContext> {
  static __implements__: typeof AdapterInterface;
  static __adapts__: typeof ObjectPrototype<any> | ObjectInterface | MarkerInterface;

  context: IContext;

  constructor(context: IContext) {
    this.context = context;
  }
}

export class AdapterNotFound {}
