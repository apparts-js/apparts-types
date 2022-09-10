import { Schema } from "./Schema";
import {
  Required,
  Public,
  FlagsType,
  Type,
  ObjType,
  Derived,
  CustomTypes,
} from "./utilTypes";

interface Keys {
  [T: string]: Schema<any, any, any>;
}

/* this seems to force TS to show the full type instead of all the wrapped generics */
type _<T> = T extends object ? { [k in keyof T]: T[k] } : T;

type MakeKeys<T extends Keys> = {
  [Key in keyof T]: T[Key] extends never ? never : Key;
}[keyof T];

type WithFlag<T extends Keys, Flag extends FlagsType> = {
  [Key in keyof T]: [Flag] extends [T[Key]["__flags"]] ? T[Key] : never;
};
type WOFlag<T extends Keys, Flag extends FlagsType> = {
  [Key in keyof T]: [Flag] extends [T[Key]["__flags"]] ? never : T[Key];
};

type ObjKeyTypeWithFlags<
  T extends Keys,
  CustomType extends CustomTypes,
  WithFlagList extends FlagsType = never,
  WOFlagList extends FlagsType = FlagsType
> = _<
  {
    // optional keys
    [Key in MakeKeys<
      WOFlag<WOFlag<WithFlag<T, WithFlagList>, WOFlagList>, Required>
    > as T[Key] extends never ? never : Key]?: T[Key][CustomType];
  } & {
    // required keys
    [Key in MakeKeys<
      WithFlag<WOFlag<WithFlag<T, WithFlagList>, WOFlagList>, Required>
    > as T[Key] extends never ? never : Key]-?: T[Key][CustomType];
  }
>;

export class Obj<
  Flags extends FlagsType,
  T extends Keys,
  PublicType extends Keys = T,
  NotDerivedType extends Keys = T
> extends Schema<
  Flags,
  ObjKeyTypeWithFlags<T, "__type", never>,
  ObjKeyTypeWithFlags<PublicType, "__publicType", Public>,
  ObjKeyTypeWithFlags<NotDerivedType, "__notDerivedType", never, Derived>
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
  cloneWithType<Flags extends FlagsType>(type: Type) {
    return new Obj<Flags, T, PublicType, NotDerivedType>(this.keys, type);
  }

  protected type: Type;
  readonly __type: ObjKeyTypeWithFlags<T, "__type", never>;
  readonly __publicType: ObjKeyTypeWithFlags<
    PublicType,
    "__publicType",
    Public
  >;
  readonly __notDerivedType: ObjKeyTypeWithFlags<
    NotDerivedType,
    "__notDerivedType",
    never,
    Derived
  >;

  readonly __Flags: Flags;

  private keys: T;

  getModelType() {
    return (this.type as ObjType).keys;
  }
}

export const obj = <T extends Keys>(keys: T): Obj<Required, T> => {
  return new Obj(keys);
};

type ObjValueType<T extends Schema<any, any, Required, any>> = {
  [key: string]: T["__type"];
};

export class ObjValues<
  Flags extends FlagsType,
  T extends Schema<any, Required, any>
> extends Schema<Flags, ObjValueType<T>> {
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
  cloneWithType<Flags extends FlagsType>(type: Type) {
    return new ObjValues<Flags, T>(this.values, type);
  }
  protected type: Type;
  readonly __type: ObjValueType<T>;
  private values: T;
}

export const objValues = <T extends Schema<Required, any>>(
  values: T
): ObjValues<Required, T> => {
  return new ObjValues(values);
};
