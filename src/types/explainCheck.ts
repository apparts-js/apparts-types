import { recursiveCheck } from "./recursiveCheck";
import { types as checkTypes } from "./types";
import { Type } from "../schema";

export const explainCheck = (response: unknown, type: Type) => {
  const result = recursiveCheck(type, response);

  if (result === true) {
    return false;
  }
  const resultKeyName = result.key ? `'${result.key}'` : "Value";

  const prettyValue = JSON.stringify(result.isValue, undefined, 2);
  if (!result.shouldType) {
    return `❌ ➕ Too much: Found ${resultKeyName} with value ${prettyValue}. Should not be there.`;
  }
  if (
    (result.isValue === null || result.isValue === undefined) &&
    result.shouldType
  ) {
    return `❌ ➖ Missing: ${resultKeyName} is not present.`;
  }

  if ("value" in result.shouldType) {
    return `❌ Value wrong: ${resultKeyName} should be '${result.shouldType.value}', but got '${response}'`;
  }
  if (result.shouldType.type === "object") {
    if (!("keys" in result.shouldType || "values" in result.shouldType)) {
      return `❌ Invalid Type: ${resultKeyName} with type '${result.shouldType}' has neither values nor keys.`;
    }
  }

  if (result.shouldType.type === "oneOf") {
    if (!("keys" in result.shouldType || "values" in result.shouldType)) {
      return `❌ No alternative matches: ${resultKeyName} is ${prettyValue} but does not match any type of oneOf.`;
    }
  }

  if (!checkTypes[result.shouldType.type]) {
    return `❌ Unkown type: ${resultKeyName} has unknown type '${JSON.stringify(
      result.shouldType.type
    )}'`;
  }

  if (result.reason) {
    return `❌ Custom check failed: ${resultKeyName} ${result.reason}`;
  }

  return `❌ Type missmatch: ${resultKeyName} is ${prettyValue} but should be of type '${JSON.stringify(
    result.shouldType,
    undefined,
    2
  )}'`;
};

export const explainSchemaCheck = (response, schema) => {
  return explainCheck(response, schema.getType());
};
