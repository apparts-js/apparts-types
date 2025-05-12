import { Schema, InferType, Type } from "../schema";
import { recursiveCheck } from "../types/recursiveCheck";

export const deepCloneSchema = <S extends Schema<any, any>>(
  value: InferType<S>,
  schema: S
): InferType<S> => {
  return deepClone(value, schema.getType());
};

export const deepClone = <S extends Schema<any, any>>(
  value: InferType<S>,
  type: Type
) => {
  if ((value === undefined || value === null) && type.optional) {
    return value;
  }
  if ("value" in type) {
    return value;
  }
  if (type.type === "object") {
    const result = {} as Record<string, any>;
    if ("keys" in type) {
      for (const key in type.keys) {
        result[key] = deepClone(value[key], type.keys[key]);
      }
    } else {
      for (const key in value) {
        result[key] = deepClone(value[key], type.values);
      }
    }
    return result;
  }
  if (type.type === "array") {
    const result = [] as any[];
    for (let i = 0; i < value.length; i++) {
      result.push(deepClone(value[i], type.items));
    }
    return result;
  }
  if (type.type === "oneOf") {
    for (const alt of type.alternatives) {
      if (recursiveCheck(alt, value) === true) {
        return deepClone(value, alt);
      }
    }
  }
  return value;
};
