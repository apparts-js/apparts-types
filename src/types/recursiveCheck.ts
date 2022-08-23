import { types as checkTypes } from "./types";
import { Type } from "../schema";

const unique = (list: string[]) => {
  const set: Record<string, true> = {};
  for (const item of list) {
    set[item] = true;
  }
  return Object.keys(set);
};

type Issue = {
  key: string;
  shouldType: Type;
  isValue: unknown;
};

export const recursiveCheck = (
  type: Type | undefined,
  response: unknown,
  key = ""
): true | Issue => {
  if (!type) {
    return { key, shouldType: type, isValue: response };
  }

  if ("value" in type) {
    const matches = JSON.stringify(type.value) === JSON.stringify(response);
    if (matches === true) {
      return true;
    }
    return { key, shouldType: type, isValue: response };
  }

  if (type.type === "oneOf" && Array.isArray(type.alternatives)) {
    return type.alternatives.reduce(
      (a: true | Issue, b) =>
        a === true ? a : recursiveCheck(b, response, key),
      { key, shouldType: type, isValue: response }
    );
  }
  if (type.type === "array" && checkTypes.array.check(response)) {
    return (response as unknown[]).reduce(
      (a: true | Issue, b, i) =>
        a === true ? recursiveCheck(type.items, b, key + `[${i}]`) : a,
      true
    );
  }
  if (type.type === "object") {
    const responseIsObject =
      typeof response === "object" &&
      !Array.isArray(response) &&
      response !== null;
    const hasKeys =
      "keys" in type && typeof type.keys === "object" && type.keys !== null;
    const hasValues =
      "values" in type &&
      typeof type.values === "object" &&
      type.values !== null;

    if (!responseIsObject || (!hasKeys && !hasValues)) {
      return { key, shouldType: type, isValue: response };
    }

    if (hasKeys) {
      const notOptionalAndNull = (key) =>
        !(response[key] === null && type.keys[key] && type.keys[key].optional);

      const allKeysToCheck = unique([
        ...Object.keys(response),
        ...Object.keys(type.keys).filter(notOptionalAndNull),
      ]);

      const matches = allKeysToCheck.reduce(
        (a: true | Issue, b) =>
          a === true
            ? recursiveCheck(
                type.keys[b],
                response[b],
                (key ? key + "." : "") + b
              )
            : a,
        true
      );
      if (matches !== true) {
        return matches;
      }
    }
    if (hasValues) {
      return Object.keys(response).reduce(
        (a: true | Issue, b) =>
          a === true ? recursiveCheck(type.values, response[b]) : a,
        true
      );
    }
  }
  if (type.type) {
    const matches =
      checkTypes[type.type] && checkTypes[type.type].check(response);
    if (matches) {
      return true;
    }
  }
  return { key, shouldType: type, isValue: response };
};

export const recursiveCheckSchema = (response, schema) => {
  return recursiveCheck(schema.getType(), response);
};
