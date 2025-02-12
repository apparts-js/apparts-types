import { Schema, Type, InferType } from "../schema";
import { recursiveCheck } from "../types/recursiveCheck";

export const deepEqualSchema = <S extends Schema<any, any>>(
  value1: InferType<S>,
  value2: InferType<S>,
  schema: S
) => deepEqual(value1, value2, schema.getType());

export const deepEqual = <S extends Schema<any, any>>(
  value1: InferType<S>,
  value2: InferType<S>,
  type: Type
) => {
  if ("value" in type) {
    return value1 === value2;
  }
  if (type.type === "object") {
    if ("keys" in type) {
      for (const key in type.keys) {
        if (!deepEqual(value1[key], value2[key], type.keys[key])) {
          return false;
        }
      }
      return true;
    } else {
      const keys1 = Object.keys(value1);
      const keys2 = Object.keys(value2);
      if (keys1.length !== keys2.length) {
        return false;
      }
      for (const key of keys1) {
        if (!deepEqual(value1[key], value2[key], type.values)) {
          return false;
        }
      }
    }
    return true;
  }
  if (type.type === "array") {
    if (value1.length !== value2.length) {
      return false;
    }
    for (let i = 0; i < value1.length; i++) {
      if (!deepEqual(value1[i], value2[i], type.items)) {
        return false;
      }
    }
  }
  if (type.type === "oneOf") {
    for (const alt of type.alternatives) {
      if (recursiveCheck(alt, value1)) {
        if (deepEqual(value1, value2, alt)) {
          return true;
        }
      }
    }
    return false;
  }
  return value1 === value2;
};
