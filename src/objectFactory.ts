import { MarkerInterface, ObjectInterface } from './interfaceFactory'

import {
  isFunc,
  isObject,
  isUndefined
} from './utils'

export class ObjectPrototype<T> {
  readonly __implements__: (typeof MarkerInterface | typeof ObjectInterface)[] = [];

  constructor(data?: T) {
    if (isObject(data)) {
      for (const key of Object.keys(data)) {
        if (isUndefined(this[key]) && key !== '__implements__') {
          this[key] = data[key];
        }
      }
    }
  }

  toJSON(): T {
    const data = {} as T;
    for (const key of Object.keys(this)) {
      if (key === '__implements__') continue; // Skip __implements__ (it is set by the class)
      
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

/**
 * Call this at the end of your class constructor to seal the object
 * and set __implements__ as a non-enumerable property
 * @param self Pass `this`
 * @param cls Pass the class
 * @param target Pass `new.target`
 * @returns 
 */
export function seal(self: any, cls: any, target: any) {
  if (cls === target) {
    Object.defineProperty(self, '__implements__', {
      value: self.__implements__ ?? [],
      enumerable: false,
      configurable: false,
      writable: false,
    });
    Object.seal(self);
  }
  return self;
}