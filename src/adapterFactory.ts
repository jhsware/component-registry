import { ObjectInterface, MarkerInterface, AdapterInterface } from './interfaceFactory';
import { ObjectPrototype } from './objectFactory';

type TAdapter<I> = {
  context: I;
}

type TImplements = AdapterInterface;
type TAdapts = typeof ObjectPrototype<any> | ObjectInterface | MarkerInterface;

export abstract class Adapter<IContext extends TAdapts> implements TAdapter<IContext> {
  static __implements__: TImplements;
  static __adapts__: TAdapts;

  context: IContext;

  constructor(context: IContext) {
    this.context = context;
  }
}

export class AdapterNotFound {
  context: undefined;
}
