import { describe, expect, it } from "@jest/globals";
import { createInterfaceDecorator, globalRegistry, Utility, UtilityInterface } from '../src/index'
const Interface = createInterfaceDecorator('test');
const { register } = globalRegistry;

describe('Utility Factory', function () {
  it('can create a utility', function () {
    @Interface
    class ITranslateUtil extends UtilityInterface {
      translate: (inp: string) => string;
    }


    class TranslateUtil extends Utility<ITranslateUtil> {
      static __implements__ = ITranslateUtil;

      translate(inp: string) {
        return inp;
      }
    }

    const util = new TranslateUtil();

    expect(util).not.toBe(undefined);
  });

  it('can create a named utility', function () {
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

    // expect(util).not.toBe(undefined);
    // expect(typeof util.translate).toEqual('function');
    // // expect(TranslateUtil.__name__).toEqual('TranslateUtil');
  });
});