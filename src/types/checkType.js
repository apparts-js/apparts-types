const checkTypes = require("./types.js");

const recursiveCheck = (response, type) => {
  if (type.type === "oneOf" && Array.isArray(type.alternatives)) {
    return type.alternatives.reduce(
      (a, b) => a || recursiveCheck(response, b),
      false
    );
  }
  if (type.type === "array" && checkTypes.array.check(response)) {
    return response.reduce((a, b) => a && recursiveCheck(b, type.items), true);
  }
  if (type.type === "object") {
    const responseIsObject =
      typeof response === "object" &&
      !Array.isArray(response) &&
      response !== null;
    const hasKeys = typeof type.keys === "object" && type.keys !== null;
    const hasValues = typeof type.values === "object" && type.values !== null;

    if (responseIsObject && hasKeys) {
      const notOptionalAndNull = (key) =>
        !(response[key] === null && type.keys[key] && type.keys[key].optional);

      const allExistingValuesCorrectlyTyped = Object.keys(response)
        .filter(notOptionalAndNull)
        .reduce(
          (a, b) =>
            a && type.keys[b] && recursiveCheck(response[b], type.keys[b]),
          true
        );
      const allRequiredValuesExist = Object.keys(type.keys).reduce(
        (a, b) => a && (response[b] !== undefined || type.keys[b].optional),
        true
      );
      return allExistingValuesCorrectlyTyped && allRequiredValuesExist;
    } else {
      return (
        responseIsObject &&
        hasValues &&
        Object.keys(response).reduce(
          (a, b) => a && recursiveCheck(response[b], type.values),
          true
        )
      );
    }
  }
  if ("value" in type) {
    return JSON.stringify(type.value) === JSON.stringify(response);
  }
  if (type.type) {
    return checkTypes[type.type] && checkTypes[type.type].check(response);
  }
  return false;
};

module.exports = recursiveCheck;
