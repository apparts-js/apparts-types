"use strict";

const config = require("@apparts/config").get("types-config");

const btrue = function (value) {
  return /^((?:true)|1)$/i.test(value);
};

const bfalse = function (value) {
  return /^((?:false)|0)$/i.test(value);
};

const types = {
  "/": { check: () => true },
  int: {
    check: (x) => typeof x === "number" && Math.round(x) === x,
    conv: (x) => {
      const parsed = parseInt(x);
      if (parsed != x || !types.int.check(parsed)) {
        throw "Not an int";
      }
      return parsed;
    },
  },
  float: {
    check: (x) => typeof x === "number",
    conv: (x) => {
      const parsed = parseFloat(x);
      if (parsed != x || !types.float.check(parsed)) {
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
  // https://en.wikipedia.org/wiki/List_of_country_calling_codes
  // https://stackoverflow.com/questions/5066329/regex-for-valid-international-mobile-phone-number
  phoneISD: {
    check: (x) => /^\+[1-9]{1}[0-9\s-]{3,20}$/.test(x),
  },
  array: {
    conv: (x) => {
      const conved = JSON.parse(x);
      if (!types.array.check(conved)) {
        throw "Not an array";
      }
      return conved;
    },
    check: (x) => Array.isArray(x),
  },
  object: {
    conv: (x) => {
      const conved = JSON.parse(x);
      if (!types.object.check(conved)) {
        throw "Not an object";
      }
      return conved;
    },
    check: (x) => typeof x === "object" && x !== null && !Array.isArray(x),
  },
  oneOf: {
    conv: (x) => {
      try {
        return JSON.parse(x);
      } catch (e) {
        return x;
      }
    },
  },
  array_int: {
    conv: (x) => {
      const conved = JSON.parse(x);
      if (!types.array_int.check(conved)) {
        throw "Not an array_int";
      }
      return conved;
    },
    check: (x) => {
      if (!Array.isArray(x)) {
        return false;
      }
      return x.reduce((a, v) => a && types.int.check(v), true);
    },
  },
  array_id: {
    conv: (x) => {
      const conved = JSON.parse(x);
      if (!types.array_id.check(conved)) {
        throw "Not an array_id";
      }
      return conved;
    },
    check: (x) => {
      if (!Array.isArray(x)) {
        return false;
      }
      return x.reduce((a, v) => a && types.id.check(v), true);
    },
  },
  password: { check: (x) => typeof x === "string" },
  date: {
    check: (x) => types.int.check(x),
    conv: (x) => types.int.conv(x),
  },
  time: {
    check: (x) => types.int.check(x),
    conv: (x) => types.int.conv(x),
  },
  daytime: {
    check: (x) => types.int.check(x),
    conv: (x) => types.int.conv(x),
  },
  array_time: {
    check: (x) => types.array_int.check(x),
    conv: (x) => types.array_int.conv(x),
  },
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

switch (config.idType) {
  case "string":
    types.id = { check: (x) => types.string.check(x) };
    break;
  case "UUIDv4":
    types.id = { check: (x) => types.uuidv4.check(x) };
    break;
  case undefined:
  case "int":
    types.id = {
      check: (x) => types.int.check(x),
      conv: (x) => types.int.conv(x),
    };
    break;
  default:
    types.id = { check: (x) => new RegExp(config.idType).test(x) };
}

export { types };
