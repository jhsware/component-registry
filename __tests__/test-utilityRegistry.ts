import { describe, expect, it } from "@jest/globals";
import { UtilityRegistry, Utility, UtilityInterface, createIdFactory, TUtility } from "../src/index";
const id = createIdFactory('test');

describe('Utility Registry', function () {
  it('can be created', function () {
    const registry = new UtilityRegistry();

    expect(registry).not.toBe(undefined);
    expect(registry.utilities).not.toBe(undefined);
    expect(typeof registry.registerUtility).toBe('function');
    expect(typeof registry.getUtility).toBe('function');
    expect(typeof registry.getUtilities).toBe('function');
  });

  it('can get with registry.getUtility', function () {
    const registry = new UtilityRegistry();

    class ITranslateUtil extends UtilityInterface {
      get interfaceId() { return id('INameAdapter') };
      translate(inp: string): string { return };
    }
    class TranslateUtil extends Utility implements Omit<ITranslateUtil, 'interfaceId'> {
      get __implements__() { return ITranslateUtil };
      constructor({ name, translate, registry }: Omit<ITranslateUtil, 'interfaceId'> & TUtility) {
        super({ name, translate, registry });
      }
      translate(inp: string): string { return };
    }

    new TranslateUtil({
      translate(inp: string) {
        return inp;
      },
      registry,
    })
    const util = registry.getUtility(ITranslateUtil);

    expect(util).toBeInstanceOf(TranslateUtil);
  });

  it('can get an unnamed utility', function () {
    const registry = new UtilityRegistry();

    class ITranslateUtil extends UtilityInterface {
      get interfaceId() { return id('INameAdapter') };
      translate(inp: string): string { return };
    }
    class TranslateUtil extends Utility implements Omit<ITranslateUtil, 'interfaceId'> {
      get __implements__() { return ITranslateUtil };
      constructor({ name, translate, registry }: Omit<ITranslateUtil, 'interfaceId'> & TUtility) {
        super({ name, translate, registry });
      }
      translate(inp: string): string { return };
    }

    new TranslateUtil({
      translate(inp: string) {
        return inp;
      },
      registry,
    });

    const util = new ITranslateUtil(registry);

    expect(util).toBeInstanceOf(TranslateUtil);
  });

  it('can get a named utility', function () {
    const registry = new UtilityRegistry();

    class ITranslateUtil extends UtilityInterface {
      get interfaceId() { return id('INameAdapter') };
      translate(inp: string): string { return };
    }
    class TranslateUtil extends Utility implements Omit<ITranslateUtil, 'interfaceId'> {
      get __implements__() { return ITranslateUtil };
      constructor({ name, translate, registry }: Omit<ITranslateUtil, 'interfaceId'> & TUtility) {
        super({ name, translate, registry });
      }
      translate(inp: string): string { return };
    }

    new TranslateUtil({
      name: 'sv',
      translate(inp: string) {
        return inp;
      },
      registry,
    });

    const util = new ITranslateUtil('sv', registry);

    expect(util).toBeInstanceOf(TranslateUtil);
  });

  it('can get the correct named utility', function () {
    const registry = new UtilityRegistry();

    class ITranslateUtil extends UtilityInterface {
      get interfaceId() { return id('INameAdapter') };
      translate(inp: string): string { return };
    }
    class TranslateUtil extends Utility implements Omit<ITranslateUtil, 'interfaceId'> {
      get __implements__() { return ITranslateUtil };
      constructor({ name, translate, registry }: Omit<ITranslateUtil, 'interfaceId'> & TUtility) {
        super({ name, translate, registry });
      }
      translate(inp: string): string { return };
    }

    const correctUtil = new TranslateUtil({
      name: 'sv',
      translate(inp: string) {
        return inp;
      },
      registry,
    });

    const wrongUtil = new TranslateUtil({
      name: 'en',
      translate(inp: string) {
        return inp;
      },
      registry,
    });

    const util = new ITranslateUtil('sv', registry);

    expect(util).toBe(correctUtil);
    expect(util).not.toBe(wrongUtil);
  });

  it('can get a list of named utilities', function () {
    const registry = new UtilityRegistry();

    class ITranslateUtil extends UtilityInterface {
      get interfaceId() { return id('INameAdapter') };
      translate(inp: string): string { return };
    }
    class TranslateUtil extends Utility implements Omit<ITranslateUtil, 'interfaceId'> {
      get __implements__() { return ITranslateUtil };
      constructor({ name, translate, registry }: Omit<ITranslateUtil, 'interfaceId'> & TUtility) {
        super({ name, translate, registry });
      }
      translate(inp: string): string { return };
    }

    const utilSv = new TranslateUtil({
      name: 'sv',
      translate(inp: string) {
        return inp;
      },
      registry,
    });

    const utilEn = new TranslateUtil({
      name: 'en',
      translate(inp: string) {
        return inp;
      },
      registry,
    });


    const utils = registry.getUtilities(ITranslateUtil);

    expect(utils[0]).toBeInstanceOf(TranslateUtil);
    expect(utils[1]).toBeInstanceOf(TranslateUtil);
    expect(utils[0] !== utils[1]).toBe(true);
    expect(utils.length).toBe(2);
  });

  it('can get a list of named utilities and an unnamed utility', function () {
    const registry = new UtilityRegistry();

    class ITranslateUtil extends UtilityInterface {
      get interfaceId() { return id('INameAdapter') };
      translate(inp: string): string { return };
    }
    class TranslateUtil extends Utility implements Omit<ITranslateUtil, 'interfaceId'> {
      get __implements__() { return ITranslateUtil };
      constructor({ name, translate, registry }: Omit<ITranslateUtil, 'interfaceId'> & TUtility) {
        super({ name, translate, registry });
      }
      translate(inp: string): string { return };
    }

    const utilSv = new TranslateUtil({
      name: 'sv',
      translate(inp: string) {
        return inp;
      },
      registry,
    });

    const utilEn = new TranslateUtil({
      name: 'en',
      translate(inp: string) {
        return inp;
      },
      registry,
    });

    const utilUnnamed = new TranslateUtil({
      translate(inp: string) {
        return inp;
      },
      registry,
    });


    const utils = registry.getUtilities(ITranslateUtil);

    expect(utils[0]).toBeInstanceOf(TranslateUtil);
    expect(utils[1]).toBeInstanceOf(TranslateUtil);
    expect(utils[2]).toBeInstanceOf(TranslateUtil);
    expect(utils.length).toBe(3);
  });

  it('can get a list of named utilities and an unnamed utility using "*"', function () {
    const registry = new UtilityRegistry();

    class ITranslateUtil extends UtilityInterface {
      get interfaceId() { return id('INameAdapter') };
      translate(inp: string): string { return };
    }
    class TranslateUtil extends Utility implements Omit<ITranslateUtil, 'interfaceId'> {
      get __implements__() { return ITranslateUtil };
      constructor({ name, translate, registry }: Omit<ITranslateUtil, 'interfaceId'> & TUtility) {
        super({ name, translate, registry });
      }
      translate(inp: string): string { return };
    }

    const utilSv = new TranslateUtil({
      name: 'sv',
      translate(inp: string) {
        return inp;
      },
      registry,
    });

    const utilEn = new TranslateUtil({
      name: 'en',
      translate(inp: string) {
        return inp;
      },
      registry,
    });

    const utilUnnamed = new TranslateUtil({
      translate(inp: string) {
        return inp;
      },
      registry,
    });


    const utils = new ITranslateUtil('*', registry);

    expect(utils[0]).toBeInstanceOf(TranslateUtil);
    expect(utils[1]).toBeInstanceOf(TranslateUtil);
    expect(utils[2]).toBeInstanceOf(TranslateUtil);
    // TODO: How do we fix this type error, instantiating a UtilityInterface
    // can return Utility or Utility[]
    expect((utils as any).length).toBe(3);
  });

  it('returns an empty list if no utilities are registered', function () {
    const registry = new UtilityRegistry();

    class ITranslateUtil extends UtilityInterface {
      get interfaceId() { return id('INameAdapter') };
      translate(inp: string): string { return };
    }

    const utils = registry.getUtilities(ITranslateUtil);

    expect(utils.length).toBe(0);
  });

  // it("returns 'undefined' if named utility isn't found and we have passed undefined as default", function () {
  //     const registry = new UtilityRegistry();

  //     const IDummyUtility = new Interface({ name: "IDummyUtility" });

  //     const DummyUtility_1 = new Utility({
  //         registry: registry,
  //         implements: IDummyUtility,
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