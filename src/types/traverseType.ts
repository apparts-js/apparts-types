import { Type, ObjType, OneOfType, ObjValueType, ArrayType } from "../schema";

export const traverseType = (
  type: Type | undefined,
  fn: (t: Type, parent: Type | undefined) => Type | undefined,
  parent?: Type | undefined
): Type | undefined => {
  if (!type) {
    return undefined;
  }
  const res = fn(type, parent);
  if (!res) {
    return res;
  }
  if ("value" in type) {
    return res;
  } else if (type.type === "object") {
    if ("keys" in type) {
      const keys: ObjType["keys"] = {};
      for (const key in type.keys) {
        const keyRes = traverseType(type.keys[key], fn, type);
        if (keyRes) {
          keys[key] = keyRes;
        }
      }
      return { ...(res as ObjType), keys };
    } else {
      const valuesRes = traverseType(type.values, fn, type);
      return valuesRes
        ? { ...(res as ObjValueType), values: valuesRes }
        : undefined;
    }
  } else if (type.type === "array") {
    const itemsRes = traverseType(type.items, fn, type);
    return itemsRes ? { ...(res as ArrayType), items: itemsRes } : undefined;
  } else if (type.type === "oneOf") {
    const alternatives: OneOfType["alternatives"] = [];
    for (const alt of type.alternatives) {
      const altRes = traverseType(alt, fn, type);
      if (altRes) {
        alternatives.push(altRes);
      }
    }
    return { ...(res as OneOfType), alternatives };
  }
  return res;
};
