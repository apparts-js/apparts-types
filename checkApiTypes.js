const checkTypes = require("./types.js");

const checked = {};

const allChecked = (funktionContainer, functionName) => {
  const types = funktionContainer[functionName].returns;
  if (
    checked[functionName] &&
    checked[functionName].reduce((a, b) => a && b, true)
  ) {
    return true;
  }
  console.log(
    "Not all possible return combinations for ###",
    functionName,
    "### have been tested! \nMISSING:",

    JSON.stringify(
      types.filter((_, i) => !checked[functionName][i]),
      undefined,
      2
    )
  );
  return false;
};

const checkType = (funktionContainer, response, functionName) => {
  const types = funktionContainer[functionName].returns;
  if (!types) {
    console.log("No types found for ###", functionName, "###");
    return false;
  }
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    if (
      type.status === response.statusCode &&
      (JSON.stringify({ error: type.error }) ===
        JSON.stringify(response.body) ||
        recursiveCheck(response.body, type))
    ) {
      checked[functionName] = checked[functionName] || types.map((_) => false);
      checked[functionName][i] = true;
      return true;
    }
  }
  console.log(
    "Returntype for ###",
    functionName,
    "### does not match any given pattern! \nMISSMATCH:",
    "Code:",
    response.statusCode,
    "Body:",
    JSON.stringify(response.body),
    "\nEXPECTED TYPES:",
    JSON.stringify(types, undefined, 2)
  );
  return false;
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
    if (
      typeof response === "object" &&
      typeof type.values === "object" &&
      Object.keys(response).reduce(
        (a, b) =>
          a && type.values[b] && recursiveCheck(response[b], type.values[b]),
        true
      ) &&
      Object.keys(response).length === Object.keys(type.values).length
    ) {
      return true;
    } else if (
      typeof response === "object" &&
      typeof type.values === "string" &&
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
