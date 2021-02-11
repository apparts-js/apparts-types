const checkTypes = require("./types.js");

const checked = {};

const allChecked = (funktionContainer, functionName) => {
  const types = funktionContainer[functionName].options.returns;
  if (
    checked[functionName] &&
    checked[functionName]
      .filter((_, i) => types[i].error !== "Fieldmissmatch")
      .reduce((a, b) => a && b, true)
  ) {
    return true;
  }
  throw new Error(
    `Not all possible return combinations for ### ${functionName} ### have been tested!\nMISSING: ` +
      JSON.stringify(
        types
          .filter((_, i) => !checked[functionName][i])
          .filter((tipe) => tipe.error !== "Fieldmissmatch"),
        undefined,
        2
      )
  );
};

const checkType = (funktionContainer, response, functionName) => {
  const types = funktionContainer[functionName].options.returns;
  if (!types) {
    console.log("No types found for ###", functionName, "###");
    return false;
  }
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    if (
      type.status === response.statusCode &&
      (JSON.stringify({ error: type.error }) ===
        JSON.stringify({
          ...response.body,
          description: undefined,
        }) ||
        recursiveCheck(response.body, type))
    ) {
      checked[functionName] = checked[functionName] || types.map((_) => false);
      checked[functionName][i] = true;
      return true;
    }
  }
  throw new Error(
    "Returntype for ### " +
      functionName +
      " ### does not match any given pattern!\nMISSMATCH: " +
      "Code: " +
      response.statusCode +
      " Body: " +
      JSON.stringify(response.body) +
      "\nEXPECTED TYPES: " +
      JSON.stringify(
        types.filter((tipe) => tipe.error !== "Fieldmissmatch"),
        undefined,
        2
      )
  );
};

const recursiveCheck = (response, type) => {
  if (type.type === "array" && checkTypes.array.check(response)) {
    if (response.reduce((a, b) => a && recursiveCheck(b, type.value), true)) {
      return true;
    } else {
      return false;
    }
  }
  if (type.type === "object") {
    const responseIsObject = typeof response === "object";
    const deepValues = typeof type.values === "object";
    const flatValues = typeof type.values === "string";

    if (responseIsObject && deepValues) {
      const allExistingValuesCorrectlyTyped = Object.keys(response).reduce(
        (a, b) =>
          a && type.values[b] && recursiveCheck(response[b], type.values[b]),
        true
      );
      const allRequiredValuesExist = Object.keys(type.values).reduce(
        (a, b) => (response[b] !== undefined || type.values[b].optional) && a,
        true
      );
      if (allExistingValuesCorrectlyTyped && allRequiredValuesExist) {
        return true;
      } else {
        return false;
      }
    } else if (
      responseIsObject &&
      flatValues &&
      Object.keys(response).reduce(
        (a, b) => a && checkTypes[type.values].check(response[b]),
        true
      )
    ) {
      return true;
    } else {
      return false;
    }
  }
  if (type.value) {
    if (JSON.stringify(type.value) === JSON.stringify(response)) {
      return true;
    } else {
      return false;
    }
  }
  if (
    type.type &&
    checkTypes[type.type] &&
    checkTypes[type.type].check(response)
  ) {
    return true;
  }
  return false;
};

module.exports = { checkType, allChecked };
