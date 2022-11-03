import { Type } from "../schema";
import { checkType } from "../types/checkType";

const getDefaultFromType = (type: Type, defaultFnParam?: unknown) =>
  typeof type.default === "function"
    ? type.default(defaultFnParam)
    : type.default;

export const fillInDefaultsStrict = (
  type: Type,
  subject: unknown,
  defaultFnParam?: unknown
) => {
  if (checkType(subject, type)) {
    return subject;
  }

  if ("value" in type) {
    if (subject === undefined) {
      return getDefaultFromType(type, defaultFnParam);
    }
    return subject;
  }

  if (type.type === "object" && "keys" in type) {
    const subjIsObj =
      typeof subject === "object" &&
      subject !== null &&
      !Array.isArray(subject);
    if (subject === undefined && "default" in type) {
      return getDefaultFromType(type, defaultFnParam);
    }
    if (!subjIsObj) {
      return subject;
    }
    const values = { ...subject };
    for (const key in type.keys) {
      if ("default" in type.keys[key]) {
        values[key] = fillInDefaultsStrict(
          type.keys[key],
          subject?.[key],
          defaultFnParam
        );
      }
    }
    return values;
  }

  if ("default" in type && subject === undefined) {
    return getDefaultFromType(type, defaultFnParam);
  }
  return subject;
};
