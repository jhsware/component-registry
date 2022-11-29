export function hasPropRegistry (inp) {
  return typeof inp === 'object' && typeof inp.registry === 'object'
}

export function notNullOrUndef (inp) {
  return inp !== undefined && inp !== null
}

export function hasPropImplements (inp) {
  return notNullOrUndef(inp) && notNullOrUndef(inp._implements)
}

export function hasArrayPropImplements (inp) {
  return notNullOrUndef(inp) && Array.isArray(inp._implements)
}

export function isString (inp) {
  return typeof inp === 'string'
}

export function isWildcard (inp) {
  return inp === '*'
}

export function isFunc (inp) {
  return typeof inp === 'function'
}