import { InferType, Schema, Type } from "../schema";
import { checkType } from "../types/checkType";
import { getDefaultFromType, SubjectMaybe } from "./fillInDefaultsShared";

export const fillInDefaultsSchema = <FullS extends Schema<any, any>>(
  schema: FullS,
  subject: SubjectMaybe<FullS>,
  defaultFnParam?: unknown
): InferType<FullS> => {
  const type = schema.getType();
  return fillInDefaults(type, subject, defaultFnParam);
};

export const fillInDefaults = (
  type: Type,
  subject: unknown,
  defaultFnParam?: unknown
) => {
  if (checkType(subject, type)) {
    return subject;
  }

  if ("value" in type) {
    return type.value;
  }

  if (type.type === "object" && "keys" in type) {
    const subjIsObj = typeof subject === "object";
    if (!subjIsObj && "default" in type) {
      return getDefaultFromType(type, defaultFnParam);
    }
    const values = {
      ...(subjIsObj ? subject : null),
    };
    for (const key in type.keys) {
      values[key] = fillInDefaults(
        type.keys[key],
        values?.[key],
        defaultFnParam
      );
    }
    return values;
  }

  if ("default" in type) {
    return getDefaultFromType(type, defaultFnParam);
  }

  if (type.type === "array") {
    return [];
  }

  if (type.type === "object" && !("keys" in type)) {
    return {};
  }

  if (type.type === "boolean") {
    return false;
  }

  return undefined;
};
