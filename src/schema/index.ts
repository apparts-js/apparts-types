import { Schema } from "./Schema";

export type InferType<T extends Schema<any, any, any, any>> = T["__type"];
export type InferPublicType<T extends Schema<any, any, any, any>> =
  T["__publicType"];
export type InferNotDerivedType<T extends Schema<any, any, any, any>> =
  T["__notDerivedType"];

export * from "./obj";
//export * from "./array";
//export * from "./oneOf";
//export * from "./value";
export * from "./baseType";
export * from "./utilTypes";
export * from "./Schema";
