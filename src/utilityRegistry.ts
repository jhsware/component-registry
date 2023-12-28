
import { TRegister } from './common';
import { UtilityInterface } from './interfaceFactory';
import { Utility } from './utilityFactory';
import { getInterfaceId, isUndefined } from './utils';

/*

    Exceptions

*/

// function UtilityRegistryException(message) {
//   this.message = message;
//   this.name = "UtilityRegistryException";
//   this.stack = (new Error()).stack;
// }

/*

    Utility Registry Code

*/

type TUtilityEntry = {
  implementsInterface: UtilityInterface,
  unnamedUtility: Utility<any>[] | undefined,
  namedUtility: Record<string, Utility<any>>
}

export type TUtilityRegistry = {
  utilities: Record<string, TUtilityEntry>;
  registerUtility(utility: Utility<any>): void;
  getUtility<T = any>(implementsInterface: UtilityInterface, name?: string, fallbackReturnValue?: any): Utility<T>;
  getUtilities<T = any>(implementsInterface: UtilityInterface): Utility<T>[];
}

export class UtilityRegistry implements TUtilityRegistry {
  utilities;
  register: TRegister;

  constructor() {
    this.utilities = {};
    this.register = (target) => {
      this.registerUtility(target);
      return target;
    }
  }

  registerUtility(utility): void {
    /*
        Add a utility to the registry
    
        implementsInterface -- the interface that the utility implements
        utility -- the prototype of the utility to instantiate on get
        name -- OPTIONAL add as named utility
    */
    const implementsInterface = utility.__implements__,
      name = utility.__name__;

    // TODO: Check that the utility implements the interface
    // TODO: else throw InterfaceNotImplementedError

    // Register the utility
    if (isUndefined(this.utilities[getInterfaceId(implementsInterface)])) {
      this.utilities[getInterfaceId(implementsInterface)] = {
        implementsInterface: implementsInterface,
        unnamedUtility: undefined,
        namedUtility: {}
      }
    }

    const utilities = this.utilities[getInterfaceId(implementsInterface)];

    if (name) {
      // Register as a named utility
      // If named utility already registered, just skip it
      utilities.namedUtility[name] ??= utility;
    } else {
      // Register as an unnamed utility
      // If utility already registered, just skip it
      utilities.unnamedUtility ??= utility;
    }
  };

  // TODO: Implement hasUtility (return true/false), look at getUtility

  getUtility<T = any>(implementsInterface, name = undefined): Utility<T> {
    /*
        Return an instance of a utility that implements the given interface
        and optionally has provided name.
    */
    const utilities = this.utilities[getInterfaceId(implementsInterface)];

    if (isUndefined(name)) {
      const Util = utilities?.unnamedUtility;
      return Util && (Util.__Component__ ?? new Util());
    }

    const Util = utilities?.namedUtility[name];
    return Util && (Util.__Component__ ?? new Util());
  }

  getUtilities<T extends UtilityInterface = any>(implementsInterface): Utility<T>[] {
    /*
        Return a list of objects with utilities implementing the given interface. The name
        of named utilities is included.
            { name: 'whatever', utility: obj }
    */
    const utilities = this.utilities[getInterfaceId(implementsInterface)];

    // We can find any utilities so we return an empty list
    if (isUndefined(utilities)) {
      return []
    }

    let outp: Utility<T>[] = [];
    if (utilities.unnamedUtility) {
      outp.push(new utilities.unnamedUtility());
    }

    for (const Util of Object.values<Utility<T>>(utilities.namedUtility)) {
      outp.push(new (Util as any)());
    }

    return outp;
  }
}
