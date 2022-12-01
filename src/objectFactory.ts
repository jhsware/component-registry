import { TInterface } from './interfaceFactory'

import {
  isObject,
  isUndefined
} from './utils'

export class ObjectPrototype<T> {
  readonly __implements__: TInterface[] = [];

  constructor(data?: T) {
    if (isObject(data)) {
      for (const key of Object.keys(data)) {
        if (isUndefined(this[key])) {
          this[key] = data[key];
        }
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