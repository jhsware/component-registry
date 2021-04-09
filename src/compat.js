import { 
  isDevelopment,
  throwDeprecatedCompat
} from './common'

export function createInterface(params) {
  if (isDevelopment) {
    throwDeprecatedCompat();
  }
}

export function createAdapter(params) {
  if (isDevelopment) {
    throwDeprecatedCompat();
  }
}

export function createUtility(params) {
  if (isDevelopment) {
    throwDeprecatedCompat();
  }
}
