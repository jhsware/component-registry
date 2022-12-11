import { describe, expect, it } from "@jest/globals";
import { createIdFactory, Utility, UtilityInterface } from '../src/index'
const id = createIdFactory('test');

describe('Utility Factory', function () {
  it('can create a utility', function () {
    class ITranslateUtil extends UtilityInterface {
      get interfaceId() { return id('INameAdapter') };
      translate: (inp: string) => string;
    }
    class TranslateUtil extends Utility<ITranslateUtil> {
      get __implements__() { return ITranslateUtil };
      translate(inp: string) {
        return inp;
      }
      
    }

    const util = new TranslateUtil({});

    expect(util).not.toBe(undefined);
  });

  it('can create a named utility', function () {
    class ITranslateUtil extends UtilityInterface {
      get interfaceId() { return id('INameAdapter') };
      translate: (inp: string) => string;
    }

    class TranslateUtil extends Utility<ITranslateUtil> {
      get __implements__() { return ITranslateUtil };

      translate(inp: string) {
        return inp;
      }
    }

    const util = new TranslateUtil({ name: 'sv'})

    expect(util).not.toBe(undefined);
    expect(typeof util.translate).toEqual('function');
    // expect(TranslateUtil.__name__).toEqual('TranslateUtil');
  });
});