import { Required, Optional, IsRequired, Schema, Type } from "./utilTypes";

interface Keys {
  [T: string]: Schema<any, any>;
}

/* this seems to force TS to show the full type instead of all the wrapped generics */
type _<T> = T extends object ? { [k in keyof T]: T[k] } : T;

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

class Obj<T extends Keys, R extends IsRequired> extends Schema<
  ObjKeyType<T>,
  R
> {
  constructor(keys: T, type?: Type) {
    super();
    if (!type) {
      const typeKeys = {};
      for (const key in keys) {
        typeKeys[key as string] = keys[key].getType();
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
  protected type: Type;
  readonly __type: ObjKeyType<T>;
  readonly __required: R;
  private keys: T;
}

type ObjValueType<T extends Schema<any, Required>> = {
  [key: string]: T["__type"];
};

class ObjValues<
  T extends Schema<any, Required>,
  R extends IsRequired
> extends Schema<ObjValueType<T>, R> {
  constructor(values: T, type?: Type) {
    super();
    if (!type) {
      this.type = {
        type: "object",
        values: values.getType(),
      };
    } else {
      this.type = type;
    }
    this.values = values;
  }
  optional() {
    this.type.optional = true;
    return new ObjValues<T, Optional>(this.values, this.type);
  }
  protected type: Type;
  readonly __type: ObjValueType<T>;
  readonly __required: R;
  private values: T;
}

export const obj = <T extends Keys>(keys: T): Obj<T, Required> => {
  return new Obj(keys);
};

export const objValues = <T extends Schema<any, Required>>(
  values: T
): ObjValues<T, Required> => {
  return new ObjValues(values);
};
