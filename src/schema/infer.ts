import { Schema } from "./Schema";

export type InferType<T extends Schema<any, any, any, any, any>> = T["__type"];
export type InferPublicType<T extends Schema<any, any, any, any, any>> =
  T["__publicType"];
export type InferNotDerivedType<T extends Schema<any, any, any, any, any>> =
  T["__notDerivedType"];
export type InferAutoType<T extends Schema<any, any, any, any, any>> =
  T["__autoType"];
export type InferHasDefaultType<T extends Schema<any, any, any, any, any>> =
  T["__defaultType"];
