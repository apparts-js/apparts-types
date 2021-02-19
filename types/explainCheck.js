const checkTypes = require("./types.js");

const errorField = (error, field) => {
  error[field] = {};
  return error[field];
};

const errorArray = (error, field, index) => {
  error[field] = error[field] || [];
  error[field][index] = {};
  return error[field][index];
};

const recursiveCheck = (response, type, error = {}) => {
  if (type.type === "oneOf" && Array.isArray(type.alternatives)) {
    if (
      type.alternatives.reduce(
        (a, b, i) =>
          a || recursiveCheck(response, b, errorArray(error, "oneOf", i)),
        false
      )
    ) {
      delete error.oneOf;
      return true;
    } else {
      return false;
    }
  }
  if (type.type === "array") {
    if (checkTypes.array.check(response)) {
      if (
        response.reduce(
          (a, b, i) =>
            a && recursiveCheck(b, type.items, errorArray(error, "items", i)),
          true
        )
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      error.values = "Expected an array, found " + typeof response;
      return false;
    }
  }
  if (type.type === "object") {
    const responseIsObject = typeof response === "object";
    const hasKeys = typeof type.keys === "object";
    const hasValues = typeof type.values === "object";

    if (responseIsObject && hasKeys) {
      const allExistingValuesCorrectlyTyped = Object.keys(response).reduce(
        (a, b) => {
          if (!type.keys[b]) {
            error[b] = `Did not expect key "${b}"`;
          }
          return (
            a &&
            type.keys[b] &&
            recursiveCheck(response[b], type.keys[b], errorField(error, b))
          );
        },
        true
      );
      const allRequiredValuesExist = Object.keys(type.keys).reduce((a, b) => {
        if (response[b] !== undefined || type.keys[b].optional) {
          return a;
        } else {
          error[b] = "Key is missing";
          return false;
        }
      }, true);

      if (allExistingValuesCorrectlyTyped && allRequiredValuesExist) {
        for (const key in error) {
          delete error[key];
        }
        return true;
      } else {
        return false;
      }
    } else if (
      responseIsObject &&
      hasValues &&
      Object.keys(response).reduce(
        (a, b) =>
          a && recursiveCheck(response[b], type.values, errorField(error, b)),
        true
      )
    ) {
      return true;
    } else {
      if (!responseIsObject) {
        error.object = "Not an object";
      }
      if (!hasValues) {
        error.object = "No values specified";
      }

      return false;
    }
  }
  if (type.value) {
    if (JSON.stringify(type.value) === JSON.stringify(response)) {
      return true;
    } else {
      error.value = `Value missmatch: Expected "${type.value}", got "${response}"`;
      return false;
    }
  }
  if (type.type) {
    if (checkTypes[type.type] && checkTypes[type.type].check(response)) {
      return true;
    } else {
      error.type = `Type missmatch: Expected "${type.type}".`;
    }
  }
  return false;
};

module.exports = recursiveCheck;
