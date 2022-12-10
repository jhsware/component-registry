import { describe, expect, it } from "@jest/globals";
import { createIdFactory, Utility, UtilityInterface, UtilityRegistry } from '../src/index'
import { TUtility } from "../dist/types";
const id = createIdFactory('test');

describe('Utility Factory', function () {
  it('can create a utility', function () {
    class ITranslateUtil extends UtilityInterface {
      get interfaceId() { return id('INameAdapter') };
      translate(inp: string): string { return '' };
    }
    class TranslateUtil extends Utility {
      get __implements__() { return ITranslateUtil };
      constructor({ translate, registry }: Omit<ITranslateUtil, 'interfaceId'> & TUtility) {
        super({ translate, registry });
      }
    }

    const util = new TranslateUtil({
      translate(inp: string) {
        return inp;
      }
    })

    expect(util).not.toBe(undefined);
  });

  it('can create a named utility', function () {
    class ITranslateUtil extends UtilityInterface {
      get interfaceId() { return id('INameAdapter') };
      translate(inp: string): string { return '' };
    }
    class TranslateUtil extends Utility implements Omit<ITranslateUtil, 'interfaceId'> {
      get __implements__() { return ITranslateUtil };
      constructor({ name, translate, registry }: Omit<ITranslateUtil, 'interfaceId'> & TUtility) {
        super({ name, translate, registry });
      }
      translate(inp: string): string { return '' };
    }

    const util = new TranslateUtil({
      name: "sv",
      translate(inp: string) {
        return inp;
      }
    })

    expect(util).not.toBe(undefined);
    expect(typeof util.translate).toEqual('function');
    expect(TranslateUtil.name).toEqual('TranslateUtil');
  });
});