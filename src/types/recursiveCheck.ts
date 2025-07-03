import { types as checkTypes } from "./types";
import { Type, Schema } from "../schema";

const unique = (list: string[]) => {
  const set: Record<string, true> = {};
  for (const item of list) {
    set[item] = true;
  }
  return Object.keys(set);
};

type Issue = {
  key: string;
  shouldType: Type | undefined;
  isValue: unknown;
  reason?: string;
};

const runCheck = (type: Type, response: unknown, key: string): true | Issue => {
  if (type.check) {
    const result = type.check(response);
    if (result !== true) {
      return {
        key,
        shouldType: type,
        isValue: response,
        reason: result || "not accepted by check function",
      };
    }
  }
  return true;
};

export const recursiveCheck = (
  type: Type | undefined,
  response: unknown,
  key = ""
): true | Issue => {
  if (!type) {
    return { key, shouldType: type, isValue: response };
  }
  if (type.optional && response === undefined) {
    return true;
  }

  if ("value" in type) {
    const matches = JSON.stringify(type.value) === JSON.stringify(response);
    if (matches === true) {
      return runCheck(type, response, key);
    }
    return { key, shouldType: type, isValue: response };
  }

  if (type.type === "oneOf" && Array.isArray(type.alternatives)) {
    const matches = type.alternatives.reduce(
      (a: true | Issue, b) => {
        return a === true ? a : recursiveCheck(b, response, key);
      },
      { key, shouldType: type, isValue: response }
    );
    if (matches === true) {
      return runCheck(type, response, key);
    }
    return { key, shouldType: type, isValue: response };
  }
  if (type.type === "array" && Array.isArray(response)) {
    const matches = (response as unknown[]).reduce(
      (a: true | Issue, b, i) =>
        a === true ? recursiveCheck(type.items, b, key + `[${i}]`) : a,
      true
    );
    if (matches === true) {
      return runCheck(type, response, key);
    }
    return matches;
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
      const allKeysToCheck = unique([
        ...Object.keys(response),
        ...Object.keys(type.keys).filter((key) => !type.keys[key].optional),
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
      if (matches === true) {
        return runCheck(type, response, key);
      }
      return matches;
    }
    if (hasValues) {
      const matches = Object.keys(response).reduce(
        (a: true | Issue, b) =>
          a === true ? recursiveCheck(type.values, response[b]) : a,
        true
      );
      if (matches === true) {
        return runCheck(type, response, key);
      }
      return matches;
    }
  }
  if (type.type) {
    const matches =
      checkTypes[type.type] &&
      checkTypes[type.type].check &&
      checkTypes[type.type].check(response);

    if (matches === true) {
      return runCheck(type, response, key);
    }
  }
  return { key, shouldType: type, isValue: response };
};

export const recursiveCheckSchema = (
  response: unknown,
  schema: Schema<any, any>
) => {
  return recursiveCheck(schema.getType(), response);
};
