import { describe, expect, it } from "@jest/globals";
import { UtilityRegistry, Utility, UtilityInterface, createInterfaceDecorator } from "../src/index";
const Interface = createInterfaceDecorator('test');

describe('Utility Registry', function () {
  it('can return __Component__', function () {
    // TODO: implement
  });
  it('can be created', function () {
    const registry = new UtilityRegistry();
    const { register } = registry;

    expect(registry).not.toBe(undefined);
    expect(registry.utilities).not.toBe(undefined);
    expect(typeof register).toBe('function');
    expect(typeof registry.registerUtility).toBe('function');
    expect(typeof registry.getUtility).toBe('function');
    expect(typeof registry.getUtilities).toBe('function');
  });

  it('can get with registry.getUtility', function () {
    const registry = new UtilityRegistry();
    const { register } = registry;

    @Interface
    class ITranslateUtil extends UtilityInterface {
      translate(inp: string): string { return '' };
    }

    @register
    class TranslateUtil extends Utility<ITranslateUtil> {
      static __implements__ = ITranslateUtil;
      translate(inp: string) {
        return inp;
      }
    }

    const util = registry.getUtility(ITranslateUtil);

    expect(util).toBeInstanceOf(TranslateUtil);
  });

  it('can get an unnamed utility', function () {
    const registry = new UtilityRegistry();
    const { register } = registry;

    @Interface
    class ITranslateUtil extends UtilityInterface {
      translate: (inp: string) => string;
    }

    @register
    class TranslateUtil extends Utility<ITranslateUtil> {
      static __implements__ = ITranslateUtil;

      translate(inp: string) {
        return inp;
      }
    }

    const util = new ITranslateUtil(registry);
    
    expect(util).toBeInstanceOf(TranslateUtil);
  });

  it('can get a named utility', function () {
    const registry = new UtilityRegistry();
    const { register } = registry;

    @Interface
    class ITranslateUtil extends UtilityInterface {
      translate: (inp: string) => string;
    }

    @register
    class TranslateUtil extends Utility<ITranslateUtil> {
      static __implements__ = ITranslateUtil;
      static __name__ = 'sv';

      translate(inp: string) {
        return inp;
      }
    }

    const util = new ITranslateUtil('sv', registry);

    expect(util).toBeInstanceOf(TranslateUtil);
  });

  it('can get the correct named utility', function () {
    const registry = new UtilityRegistry();
    const { register } = registry;

    @Interface
    class ITranslateUtil extends UtilityInterface {
      translate: (inp: string) => string;
    }

    @register
    class TranslateUtil extends Utility<ITranslateUtil> {
      static __implements__ = ITranslateUtil;
      static __name__ = 'sv';

      translate(inp: string) {
        return inp;
      }
    }

    const util = new ITranslateUtil('sv', registry);

    expect(util).toBeInstanceOf(TranslateUtil);
    expect((util.constructor as any).__name__).toEqual('sv');
  });

  it('can get a list of named utilities', function () {
    const registry = new UtilityRegistry();
    const { register } = registry;

    @Interface
    class ITranslateUtil extends UtilityInterface {
      translate: (inp: string) => string;
    }

    @register
    class TranslateUtilSv extends Utility<ITranslateUtil> {
      static __implements__ = ITranslateUtil;
      static __name__ = 'sv';
      translate(inp: string) {
        return inp;
      }

    }

    @register
    class TranslateUtilEn extends Utility<ITranslateUtil> {
      static __implements__ = ITranslateUtil;
      static __name__ = 'en';
      translate(inp: string) {
        return inp;
      }

    }

    const utils = registry.getUtilities(ITranslateUtil);

    expect(utils[0]).toBeInstanceOf(TranslateUtilSv);
    expect(utils[1]).toBeInstanceOf(TranslateUtilEn);
    expect(utils[0] !== utils[1]).toBe(true);
    expect(utils.length).toBe(2);
  });

  it('can get a list of named utilities and an unnamed utility', function () {
    const registry = new UtilityRegistry();
    const { register } = registry;

    @Interface
    class ITranslateUtil extends UtilityInterface {
      translate(inp: string): string { return '' };
    }

    @register
    class TranslateUtil extends Utility<any> implements Omit<ITranslateUtil, 'interfaceId'> {
      static __implements__ = ITranslateUtil;
      translate(inp: string) {
        return inp;
      }
    }

    @register
    class TranslateUtilSv extends Utility<any> implements Omit<ITranslateUtil, 'interfaceId'> {
      static __implements__ = ITranslateUtil;
      static __name__ = 'sv';
      translate(inp: string) {
        return inp;
      }
    }

    @register
    class TranslateUtilEn extends Utility<any> implements Omit<ITranslateUtil, 'interfaceId'> {
      static __implements__ = ITranslateUtil;
      static __name__ = 'en';
      translate(inp: string) {
        return inp;
      }
    }

    const utils = registry.getUtilities(ITranslateUtil);

    expect(utils[0]).toBeInstanceOf(TranslateUtil);
    expect(utils[1]).toBeInstanceOf(TranslateUtilSv);
    expect(utils[2]).toBeInstanceOf(TranslateUtilEn);
    expect(utils.length).toBe(3);
  });

  it('can get a list of named utilities and an unnamed utility using "*"', function () {
    const registry = new UtilityRegistry();
    const { register } = registry;

    @Interface
    class ITranslateUtil extends UtilityInterface {
      translate: (inp: string) => string;
    }


    @register
    class TranslateUtil extends Utility<ITranslateUtil> {
      static __implements__ = ITranslateUtil;

      translate(inp: string) {
        return inp;
      }
    }
    
    @register
    class TranslateUtilSv extends Utility<ITranslateUtil> {
      static __implements__ = ITranslateUtil;
      static __name__ = 'sv';

      translate(inp: string) {
        return inp;
      }
    }
    
    @register
    class TranslateUtilEn extends Utility<ITranslateUtil> {
      static __implements__ = ITranslateUtil;
      static __name__ = 'en';

      translate(inp: string) {
        return inp;
      }
    }

    // We need a type conversion to allow manipulating results as list
    const utils = new ITranslateUtil('*', registry) as unknown as TranslateUtil[];

    // Check that type marks as array
    utils.forEach((u) => true);

    expect(utils[0]).toBeInstanceOf(TranslateUtil);
    expect(utils[1]).toBeInstanceOf(TranslateUtilSv);
    expect(utils[2]).toBeInstanceOf(TranslateUtilEn);
    // TODO: How do we fix this type error, instantiating a UtilityInterface
    // can return Utility or Utility[]
    expect((utils as any).length).toBe(3);
  });

  it('returns an empty list if no utilities are registered', function () {
    const registry = new UtilityRegistry();

    @Interface
    class ITranslateUtil extends UtilityInterface {
      translate(inp: string): string { return '' };
    }

    const utils = registry.getUtilities(ITranslateUtil);

    expect(utils.length).toBe(0);
  });

  // it("returns 'undefined' if named utility isn't found and we have passed undefined as default", function () {
  //     const registry = new UtilityRegistry();

  //     const IDummyUtility = new Interface({ name: "IDummyUtility" });

  //     class DummyUtility_1 extends Utility<> {
  //         registry: registry,
  //         __implements__ IDummyUtility,
  //         name: 'one'
  //     });

  //     const utils = registry.getUtility(IDummyUtility, 'two', undefined);

  //     expect(utils).toBe(undefined);
  // });

  // it("returns 'undefined' if UNNAMED utility isn't found and we have passed undefined as default", function () {
  //     const registry = new UtilityRegistry();

  //     const IDummyUtility = new Interface({ name: "IDummyUtility" });

  //     const utils = registry.getUtility(IDummyUtility, undefined, undefined);

  //     expect(utils).toBe(undefined);
  // });
});