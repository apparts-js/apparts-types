const recursiveCheck = require("../types/checkType");

const useChecks = (funktionContainer) => {
  const checked = {};

  if (!funktionContainer || Object.keys(funktionContainer).length === 0) {
    throw new Error("useChecks: The functionContainer is null or empty.");
  }

  const allChecked = (functionName) => {
    if (!funktionContainer[functionName]) {
      throw new Error(
        `Function ### "${functionName}" ### could not be found, maybe you misspelled it?`
      );
    }
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

  const checkType = (response, functionName) => {
    if (!funktionContainer[functionName]) {
      throw new Error(
        `Function ### "${functionName}" ### could not be found, maybe you misspelled it?`
      );
    }
    const types = funktionContainer[functionName].options.returns;
    if (!types) {
      console.log("No types found for ###", functionName, "###");
      return false;
    }
    const errors = [];
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      errors.push({});
      if (
        type.status === response.statusCode &&
        (JSON.stringify({ error: type.error }) ===
          JSON.stringify({
            ...response.body,
            description: undefined,
          }) ||
          recursiveCheck(response.body, type))
      ) {
        checked[functionName] = checked[functionName] || types.map(() => false);
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
  return { checkType, allChecked };
};

module.exports = { useChecks };
