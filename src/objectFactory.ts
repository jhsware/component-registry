

import { TInterface } from './interfaceFactory'

import {
  isObject
} from './utils'

export class ObjectPrototype<T> {
  readonly __implements__: TInterface[] = [];
  readonly __extends__: typeof ObjectPrototype<any>[] = [];

  constructor(data?: T) {
    if (isObject(data)) {
      for (const key of Object.keys(data)) {
        this[key] = data[key];
      }
    }
  }

  toJSON(): T {
    const data = {} as T;
    for (const key of Object.keys(this)) {
      const prop = this[key];
      if (prop && typeof prop.toJSON === 'function') {
        // Recursively prepare objects for stringify, skipping member objects that don't have a toJSON method
        data[key] = prop.toJSON();
      } else if (typeof prop !== 'function') {
        data[key] = prop;
      }
    }
    return data;
  };
}