import { ObjectInterface, MarkerInterface, AdapterInterface, TypeFromInterface } from './interfaceFactory';
import { ObjectPrototype } from './objectFactory';

type TAdapts<IObj = any> = ObjectPrototype<IObj> | ObjectInterface | MarkerInterface;
export abstract class Adapter<IContext extends TAdapts> {
  static __implements__: AdapterInterface;
  static __adapts__: TAdapts;

  context: TypeFromInterface<IContext> & TAdapts<IContext>;

  constructor(context: TypeFromInterface<IContext> & TAdapts<IContext>) {
    this.context = context;
  }
}

export class AdapterNotFound {
  context: undefined;
}
