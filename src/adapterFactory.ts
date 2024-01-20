import { ObjectInterface, MarkerInterface, AdapterInterface } from './interfaceFactory';
import { ObjectPrototype } from './objectFactory';

type TAdapts<IObj = any> = ObjectPrototype<IObj> | ObjectInterface | MarkerInterface;
export abstract class Adapter<IContext extends TAdapts> {
  static __implements__: AdapterInterface;
  static __adapts__: TAdapts;

  context: ObjectPrototype<IContext> | ObjectInterface | MarkerInterface;

  constructor(context: TAdapts<IContext>) {
    this.context = context;
  }
}

export class AdapterNotFound {
  context: undefined;
}
