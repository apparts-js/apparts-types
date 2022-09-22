import { Type } from "../schema";
import { checkType } from "../types/checkType";

const getDefaultFromType = (type: Type, defaultFnParam?: unknown) =>
  typeof type.default === "function"
    ? type.default(defaultFnParam)
    : type.default;

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
        subject?.[key],
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
