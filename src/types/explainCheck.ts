import { recursiveCheck } from "./recursiveCheck";
import { types as checkTypes } from "./types";
import { Type } from "../schema";

export const explainCheck = (response: unknown, type: Type) => {
  const result = recursiveCheck(type, response);

  if (result === true) {
    return false;
  }

  const prettyValue = JSON.stringify(result.isValue, undefined, 2);
  if (!result.shouldType) {
    return `❌ ➕ Too much: Found '${result.key}' with value ${prettyValue}. Should not be there.`;
  }
  if (
    (result.isValue === null || result.isValue === undefined) &&
    result.shouldType
  ) {
    return `❌ ➖ Missing: '${result.key}' is not present.`;
  }

  if ("value" in result.shouldType) {
    return `❌ Value wrong: '${result.key}' should be '${result.shouldType.value}', but got '${response}'`;
  }
  if (result.shouldType.type === "object") {
    if (!("keys" in result.shouldType || "values" in result.shouldType)) {
      return `❌ Invalid Type: '${result.key}' with type '${result.shouldType}' has neither values nor keys.`;
    }
  }

  if (result.shouldType.type === "oneOf") {
    if (!("keys" in result.shouldType || "values" in result.shouldType)) {
      return `❌ No alternative matches: '${result.key}' is ${prettyValue} but does not match any type of oneOf.`;
    }
  }

  if (!checkTypes[result.shouldType.type]) {
    return `❌ Unkown type: '${result.key}' has unknown type '${result.shouldType.type}'`;
  }

  if (result.reason) {
    return `❌ Custom check failed: '${result.key}' ${result.reason}`;
  }

  return `❌ Type missmatch: '${result.key}' is ${prettyValue} but should be of type '${result.shouldType}'`;
};

export const explainSchemaCheck = (response, schema) => {
  return explainCheck(response, schema.getType());
};
