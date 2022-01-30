import { Required, Optional, IsRequired, Schema, Type } from "./utilTypes";

interface Keys {
  [T: string]: Schema<any, any>;
}

/* this seems to force TS to show the full type instead of all the wrapped generics */
type _<T> = T extends {} ? { [k in keyof T]: T[k] } : T;

type OptionalKeys<T extends Keys> = {
  [Property in keyof T]: Optional extends T[Property]["__required"]
    ? Property
    : never;
}[keyof T];

type RequiredKeys<T extends Keys> = Exclude<keyof T, OptionalKeys<T>>;
type ObjKeyType<T extends Keys> = _<
  {
    [Property in OptionalKeys<T> as T[Property] extends never
      ? never
      : Property]?: T[Property]["__type"];
  } & {
    [Property in RequiredKeys<T> as T[Property] extends never
      ? never
      : Property]: T[Property]["__type"];
  }
>;

class Obj<T extends Keys, Required extends IsRequired> extends Schema<
  ObjKeyType<T>,
  Required
> {
  constructor(keys: T, type?: Type) {
    super();
    if (!type) {
      const typeKeys = {};
      for (const key in keys) {
        typeKeys[key as string] = keys[key].type;
      }
      this.type = {
        type: "object",
        keys: typeKeys,
      };
    } else {
      this.type = type;
    }
    this.keys = keys;
  }
  optional() {
    this.type.optional = true;
    return new Obj<T, Optional>(this.keys, this.type);
  }
  type: Type;
  readonly __type: ObjKeyType<T>;
  readonly __required: Required;
  private keys: T;
}

export const obj = <T extends Keys>(keys: T): Obj<T, Required> => {
  return new Obj(keys);
};
