import { Type, ObjType } from "../../schema";

const description = { type: "string", optional: true };

const rtype = {
  type: "oneOf" as const,
  alternatives: [] as ObjType[],
};

const oneOf = {
  type: "object" as const,
  keys: {
    type: { value: "oneOf" as const },
    description,
    alternatives: {
      type: "array" as const,
      items: rtype,
    },
  },
};

const objectKeys = {
  type: "object" as const,
  keys: {
    type: { value: "object" as const },
    description,
    keys: {
      type: "object" as const,
      values: {
        type: "oneOf" as const,
        alternatives: [] as Type[],
      },
    },
  },
};
const objectValues = {
  type: "object" as const,
  keys: {
    type: { value: "object" as const },
    description,
    values: rtype,
  },
};

const array = {
  type: "object" as const,
  keys: {
    type: { value: "array" as const },
    items: rtype,
    description,
  },
};

const directType = {
  type: "object" as const,
  keys: {
    description,
    type: {
      type: "oneOf" as const,
      alternatives: [
        { value: "id" as const },
        { value: "uuidv4" as const },
        { value: "/" as const },
        { value: "int" as const },
        { value: "float" as const },
        { value: "hex" as const },
        { value: "base64" as const },
        { value: "bool" as const },
        { value: "boolean" as const },
        { value: "string" as const },
        { value: "email" as const },
        { value: "array_int" as const },
        { value: "array_id" as const },
        { value: "password" as const },
        { value: "time" as const },
        { value: "array_time" as const },
        { value: "null" as const },
      ],
    },
  },
};

const valuedType = {
  type: "object" as const,
  keys: {
    description,
    value: { type: "/" as const },
  },
};

rtype.alternatives = [
  oneOf as ObjType,
  objectKeys as ObjType,
  objectValues as ObjType,
  array as ObjType,
  directType as ObjType,
  valuedType as ObjType,
];

objectKeys.keys.keys.values.alternatives = rtype.alternatives.map((t) => ({
  ...t,
  keys: {
    ...t.keys,
    optional: { type: "boolean" as const, optional: true },
  },
}));

export {
  rtype,
  oneOf,
  objectKeys,
  objectValues,
  array,
  directType,
  valuedType,
};
