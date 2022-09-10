import { Schema } from "./Schema";
import { Required, IsRequired, Type, ObjType } from "./utilTypes";

interface Keys {
  [T: string]: Schema<any, any, any, any>;
}

/* this seems to force TS to show the full type instead of all the wrapped generics */
type _<T> = T extends object ? { [k in keyof T]: T[k] } : T;

type Flags = "__public" | "__required";

type MakeKeys<T extends Keys> = {
  [Key in keyof T]: T[Key] extends never ? never : Key;
}[keyof T];

type WithFlag<T extends Keys, Flag extends Flags> = {
  [Key in keyof T]: false extends T[Key][Flag] ? never : T[Key];
};
type WOFlag<T extends Keys, Flag extends Flags> = {
  [Key in keyof T]: false extends T[Key][Flag] ? T[Key] : never;
};

/*type ObjKeyType<T extends Keys> = _<
  {
    // optional keys
    [Key in MakeKeys<WOFlag<T, "__required">> as T[Key] extends never
      ? never
      : Key]?: T[Key]["__type"];
  } & {
    // required keys
    [Key in MakeKeys<WithFlag<T, "__required">> as T[Key] extends never
      ? never
      : Key]: T[Key]["__type"];
  }
>;*/

type CustomTypes = "__type" | "__publicType";
type ObjKeyTypeWithFlags<
  T extends Keys,
  CustomType extends CustomTypes,
  FlagList extends Flags
> = _<
  {
    // optional keys
    [Key in MakeKeys<
      WOFlag<WithFlag<T, FlagList>, "__required">
    > as T[Key] extends never ? never : Key]?: T[Key][CustomType];
  } & {
    // required keys
    [Key in MakeKeys<
      WithFlag<WithFlag<T, FlagList>, "__required">
    > as T[Key] extends never ? never : Key]-?: T[Key][CustomType];
  }
>;

//type ObjKeyCustomType<
//  T extends Keys,
//  CustomType extends "__type" | "__publicType"
//> = _<
//  {
//    [Property in OptionalKeys<T> as T[Property] extends never
//      ? never
//      : Property]?: T[Property][CustomType];
//  } & {
//    [Property in RequiredKeys<T> as T[Property] extends never
//      ? never
//      : Property]: T[Property][CustomType];
//  }
//>;

export class Obj<
  T extends Keys,
  PublicType extends Keys,
  R extends IsRequired,
  P extends boolean
> extends Schema<
  ObjKeyTypeWithFlags<PublicType, "__publicType", never>,
  ObjKeyTypeWithFlags<PublicType, "__publicType", "__public">,
  R,
  P
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
  cloneWithType<R extends IsRequired, P extends boolean>(type: Type) {
    return new Obj<T, PublicType, R, P>(this.keys, type);
  }

  protected type: Type;
  readonly __type: ObjKeyTypeWithFlags<PublicType, "__publicType", never>;
  readonly __publicType: ObjKeyTypeWithFlags<
    PublicType,
    "__publicType",
    "__public"
  >;

  readonly __required: R;
  readonly __public: P;

  private keys: T;

  getModelType() {
    return (this.type as ObjType).keys;
  }
}

export const obj = <T extends Keys>(keys: T): Obj<T, T, Required, false> => {
  return new Obj(keys);
};

/*type ObjValueType<T extends Schema<any, any, Required, any>> = {
  [key: string]: T["__type"];
};

export class ObjValues<
  T extends Schema<any, Required, any>,
  R extends IsRequired,
  P extends boolean
> extends Schema<ObjValueType<T>, R, P> {
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
  cloneWithType<R extends IsRequired, P extends boolean>(type: Type) {
    return new ObjValues<T, R, P>(this.values, type);
  }
  protected type: Type;
  readonly __type: ObjValueType<T>;
  readonly __required: R;
  private values: T;
}


export const objValues = <T extends Schema<any, Required, any>>(
  values: T
): ObjValues<T, Required, any> => {
  return new ObjValues(values);
};
*/
