const checkTypes = require("./types.js");

const pad = (str, len = 10) => " ".repeat(Math.max(len - (str + "").length, 0));

export const explainCheck = (response, type) => {
  if (type.type === "oneOf" && Array.isArray(type.alternatives)) {
    const res = type.alternatives.map((b) => explainCheck(response, b));
    return res.some((a) => a === false) ? false : res;
  }

  if (type.type === "array" && checkTypes.array.check(response)) {
    const res = response.map((b) => explainCheck(b, type.items));
    return res.every((a) => a === false)
      ? false
      : res.map((a) => (a === false ? "✔" : a));
  }

  if (type.type === "object") {
    const responseIsObject = typeof response === "object" && response !== null;
    const hasKeys = typeof type.keys === "object" && type.keys !== null;
    const hasValues = typeof type.values === "object" && type.values !== null;

    if (!responseIsObject) {
      return "❌ Expected Object";
    }

    const resp = {};
    if (hasKeys) {
      for (const key in response) {
        if (!type.keys[key]) {
          resp[key] = "❌ ➕ Too much";
          return resp;
        }

        const typeWrong = explainCheck(response[key], type.keys[key]);
        resp[key] = "✔";
        if (typeWrong) {
          resp[key] = typeWrong;
          return resp;
        }
      }
      for (const key in type.keys) {
        const missing = response[key] === undefined && !type.keys[key].optional;
        if (missing) {
          resp[key] = "❌ ➖ Missing";
          return resp;
        }
      }
      return false;
    }

    if (hasValues) {
      for (const key in response) {
        const typeWrong = explainCheck(response[key], type.values);
        resp[key] = "✔";
        if (typeWrong) {
          resp[key] = typeWrong;
          return resp;
        }
      }
      return false;
    }
    return "❌ Has neither values nor keys";
  }

  if (type.value) {
    if (JSON.stringify(type.value) !== JSON.stringify(response)) {
      return `❌ Value wrong: Expected '${type.value}', ${pad(
        type.value
      )} got '${response}'`;
    }
    return false;
  }
  if (type.type) {
    if (!checkTypes[type.type]) {
      return `❌ Unkown type: "${type.type}"`;
    }
    if (!checkTypes[type.type].check(response)) {
      return `❌ Type missmatch: Expected '${type.type}', ${pad(
        type.value
      )}got '${response}'`;
    }
    return false;
  }
  return `❌ Wrong assertion`;
};
