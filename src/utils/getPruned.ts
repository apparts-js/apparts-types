import { InferType, Required, Schema, Type } from "../schema";
import { checkType } from "../types/checkType";

export const getPrunedSchema = <TypeSchema extends Schema<any, any>>(
  schema: TypeSchema,
  content: InferType<TypeSchema>
): InferType<TypeSchema> => {
  return getPruned(schema.getType(), content);
};

export const getPruned = <TypeSchema extends Schema<Required, any>>(
  type: Type,
  content: InferType<TypeSchema>
): InferType<TypeSchema> => {
  if (content === undefined || content === null) {
    return content;
  }

  if ("value" in type) {
    return type.value;
  }

  if (!("type" in type)) {
    return undefined;
  }

  if (type.type === "object" && "keys" in type) {
    const result: Record<string, unknown> = {};
    for (const key in type.keys) {
      const val = getPruned(type.keys[key], content[key]);
      if (val !== undefined && val !== null) {
        const { mapped } = type.keys[key];
        if (mapped) {
          result[mapped] = val;
        } else {
          result[key] = val;
        }
      }
    }
    if (!checkType(result, type)) {
      return undefined;
    }
    return result;
  }

  if (type.type === "array" && content?.map) {
    const result = content.map((item: unknown) => getPruned(type.items, item));
    if (!checkType(result, type)) {
      return undefined;
    }
    return result;
  }

  if (type.type === "object" && !("keys" in type)) {
    const result = {} as Record<string, unknown>;
    for (const key in content) {
      result[key] = getPruned(type.values, content[key]);
    }
    if (!checkType(result, type)) {
      return undefined;
    }
    return result;
  }

  if (type.type === "oneOf") {
    for (const alt of type.alternatives) {
      const result = getPruned(alt, content);
      if (checkType(result, type) && result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  if (checkType(content, type)) {
    return content;
  }
  return undefined;
};
