import { Schema } from "./utilTypes";

export type InferType<T extends Schema<any, any>> = T["__type"];

export * from "./int";
export * from "./bool";
export * from "./obj";
