import { Schema } from "./Schema";

export type InferType<T extends Schema<any, any>> = T["__type"];

export * from "./obj";
export * from "./array";
export * from "./oneOf";
export * from "./value";
export * from "./baseType";
export * from "./utilTypes";
export * from "./Schema";
