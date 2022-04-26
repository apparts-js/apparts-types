"use strict";

const config = require("@apparts/config").get("types-config");

const btrue = function (value) {
  return /^((?:true)|1)$/i.test(value);
};

const bfalse = function (value) {
  return /^((?:false)|0)$/i.test(value);
};

let id;
switch (config.idType) {
  case "string":
    id = { check: (x) => module.exports.string.check(x) };
    break;
  case "UUIDv4":
    id = { check: (x) => module.exports.uuidv4.check(x) };
    break;
  case undefined:
  case "int":
    id = {
      check: (x) => module.exports.int.check(x),
      conv: (x) => module.exports.int.conv(x),
    };
    break;
  default:
    id = { check: (x) => new RegExp(config.idType).test(x) };
}

module.exports = {
  "/": { check: () => true },
  int: {
    check: (x) => typeof x === "number" && Math.round(x) === x,
    conv: (x) => {
      const parsed = parseInt(x);
      if (parsed != x || !module.exports.int.check(parsed)) {
        throw "Not an int";
      }
      return parsed;
    },
  },
  float: {
    check: (x) => typeof x === "number",
    conv: (x) => {
      const parsed = parseFloat(x);
      if (parsed != x || !module.exports.float.check(parsed)) {
        throw "Not a float";
      }
      return parsed;
    },
  },
  hex: { check: (x) => typeof x === "string" && /^[0-9a-f]+$/i.test(x) },
  base64: {
    check: (x) =>
      typeof x === "string" &&
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/i.test(
        x
      ),
  },
  bool: {
    check: (x) => typeof x === "boolean",
    conv: (x) => {
      const t = btrue(x);
      if (t || bfalse(x)) {
        return t;
      }
      throw "Not a boolean";
    },
  },
  boolean: {
    check: (x) => typeof x === "boolean",
    conv: (x) => {
      const t = btrue(x);
      if (t || bfalse(x)) {
        return t;
      }
      throw "Not a boolean";
    },
  },
  string: {
    check: (x) => {
      return typeof x === "string";
    },
  },
  email: {
    check: (x) =>
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        x
      ),
  },
  array: {
    conv: (x) => {
      const conved = JSON.parse(x);
      if (!module.exports.array.check(conved)) {
        throw "Not an array";
      }
      return conved;
    },
    check: (x) => Array.isArray(x),
  },
  object: {
    conv: (x) => {
      const conved = JSON.parse(x);
      if (!module.exports.object.check(conved)) {
        throw "Not an object";
      }
      return conved;
    },
    check: (x) => typeof x === "object" && x !== null && !Array.isArray(x),
  },
  array_int: {
    conv: (x) => {
      const conved = JSON.parse(x);
      if (!module.exports.array_int.check(conved)) {
        throw "Not an array_int";
      }
      return conved;
    },
    check: (x) => {
      if (!Array.isArray(x)) {
        return false;
      }
      return x.reduce((a, v) => a && module.exports.int.check(v), true);
    },
  },
  array_id: {
    conv: (x) => {
      const conved = JSON.parse(x);
      if (!module.exports.array_id.check(conved)) {
        throw "Not an array_id";
      }
      return conved;
    },
    check: (x) => {
      if (!Array.isArray(x)) {
        return false;
      }
      return x.reduce((a, v) => a && module.exports.id.check(v), true);
    },
  },
  password: { check: (x) => typeof x === "string" },
  time: {
    check: (x) => module.exports.int.check(x),
    conv: (x) => module.exports.int.conv(x),
  },
  array_time: {
    check: (x) => module.exports.array_int.check(x),
    conv: (x) => module.exports.array_int.conv(x),
  },
  id,
  uuidv4: {
    check: (x) =>
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
        x
      ),
  },
  null: {
    check: (x) => x === null,
  },
};
