import { Adapter } from "./adapterFactory";
import { Utility } from "./utilityFactory";

export const isDevelopment = process?.env.NODE_ENV !== 'production';
export const isTest = process?.env.NODE_ENV === 'test';

// ClassMethodDecoratorContext
export type TRegister = (target: Adapter<any> | Utility<any> ) => any;

export function assert(isValid, msg): void {
    if (!isValid) throw new Error(msg)
}
