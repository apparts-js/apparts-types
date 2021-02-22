const rtype = {
  type: "oneOf",
};

const oneOf = {
  type: "object",
  keys: {
    type: { value: "oneOf" },
    alternatives: {
      type: "array",
      items: rtype,
    },
  },
};

const objectKeys = {
  type: "object",
  keys: {
    type: { value: "object" },
    keys: {
      type: "object",
      values: {
        type: "oneOf",
      },
    },
  },
};
const objectValues = {
  type: "object",
  keys: {
    type: { value: "object" },
    values: rtype,
  },
};

const array = {
  type: "object",
  keys: {
    type: { value: "array" },
    items: rtype,
  },
};

const directType = {
  type: "object",
  keys: {
    type: {
      type: "oneOf",
      alternatives: [
        { value: "id" },
        { value: "uuidv4" },
        { value: "/" },
        { value: "int" },
        { value: "float" },
        { value: "hex" },
        { value: "base64" },
        { value: "bool" },
        { value: "boolean" },
        { value: "string" },
        { value: "email" },
        { value: "array_int" },
        { value: "array_id" },
        { value: "password" },
        { value: "time" },
        { value: "array_time" },
      ],
    },
  },
};

const valuedType = {
  type: "object",
  keys: {
    value: { type: "/" },
  },
};

rtype.alternatives = [
  oneOf,
  objectKeys,
  objectValues,
  array,
  directType,
  valuedType,
];

objectKeys.keys.keys.values.alternatives = rtype.alternatives.map((t) => ({
  ...t,
  keys: {
    ...t.keys,
    optional: { type: "boolean", optional: true },
  },
}));

module.exports = {
  rtype,
  oneOf,
  objectKeys,
  objectValues,
  array,
  directType,
  valuedType,
};
