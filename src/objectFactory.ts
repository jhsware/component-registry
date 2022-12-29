import { MarkerInterface, ObjectInterface } from './interfaceFactory'

import {
  isFunc,
  isObject,
  isUndefined
} from './utils'

export class ObjectPrototype<T> {
  __implements__: (typeof MarkerInterface | typeof ObjectInterface)[] = [];

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
      if (isFunc(prop?.toJSON)) {
        // Recursively prepare objects for stringify, skipping member objects that don't have a toJSON method
        data[key] = prop.toJSON();
      } else if (!isFunc(prop)) {
        data[key] = prop;
      }
    }
    return data;
  };
}