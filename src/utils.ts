export function hasPropRegistry (inp: any): boolean {
  return typeof inp === 'object' && typeof inp.registry === 'object'
}

export function isUndefined (inp: any): boolean {
  return inp === undefined && inp !== null;
}

export function notNullOrUndef (inp: any): boolean {
  return inp !== undefined && inp !== null
}

export function hasPropImplements (inp: any): boolean {
  return notNullOrUndef(inp) && notNullOrUndef(inp.__implements__)
}

export function hasArrayPropImplements (inp: any): boolean {
  return notNullOrUndef(inp) && Array.isArray(inp.__implements__)
}

export function isString (inp: any): boolean {
  return typeof inp === 'string'
}

export function isWildcard (inp: any): boolean {
  return inp === '*'
}

export function isFunc (inp: any): boolean {
  return typeof inp === 'function'
}

export function isObject (inp: any): boolean {
  return typeof inp === 'object' && inp !== null && !Array.isArray(inp);
}

export function getInterfaceId(intrfc) {
  return intrfc.constructor?.interfaceId ?? intrfc.interfaceId
}