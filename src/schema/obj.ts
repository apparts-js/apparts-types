import { fillInDefaults } from "../utils/fillInDefaults";
import { SubjectMaybeObj } from "../utils/fillInDefaultsShared";
import { Schema } from "./Schema";
import {
  Required,
  Public,
  FlagsType,
  Type,
  ObjType,
  Derived,
  CustomTypes,
  _Optional,
  Auto,
  HasDefault,
  IsKey,
} from "./utilTypes";

interface Keys {
  [T: string]: Schema<any, any, any, any, any, any>;
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
  NotDerivedType extends Keys = T,
  AutoType extends Keys = T,
  DefaultType extends Keys = T,
  KeyType extends Keys = T
> extends Schema<
  Flags,
  ObjKeyTypeWithFlags<T, "__type", never>,
  ObjKeyTypeWithFlags<PublicType, "__publicType", Public>,
  ObjKeyTypeWithFlags<NotDerivedType, "__notDerivedType", never, Derived>,
  ObjKeyTypeWithFlags<AutoType, "__autoType", Auto>,
  ObjKeyTypeWithFlags<DefaultType, "__defaultType", HasDefault>
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
    return new Obj<
      Flags,
      T,
      PublicType,
      NotDerivedType,
      AutoType,
      DefaultType,
      KeyType
    >(this.keys, type);
  }

  clone(type: Type) {
    return this.cloneWithType<Flags>(type) as this;
  }

  protected type: Type;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __type: ObjKeyTypeWithFlags<T, "__type", never>;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __publicType: ObjKeyTypeWithFlags<
    PublicType,
    "__publicType",
    Public
  >;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __notDerivedType: ObjKeyTypeWithFlags<
    NotDerivedType,
    "__notDerivedType",
    never,
    Derived
  >;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __autoType: ObjKeyTypeWithFlags<AutoType, "__autoType", Auto>;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __defaultType: ObjKeyTypeWithFlags<
    DefaultType,
    "__defaultType",
    HasDefault
  >;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __keyType: ObjKeyTypeWithFlags<KeyType, "__type", IsKey>;

  // @ts-expect-error This value is just here to make the type accessible
  readonly __Flags: Flags;

  private keys: T;

  getModelType() {
    return (this.type as ObjType).keys;
  }

  getType() {
    return this.type as ObjType;
  }

  getKeys() {
    return this.keys;
  }

  optional() {
    return this.cloneWithType<Exclude<Flags, Required> | _Optional>({
      ...this.type,
      optional: true,
    });
  }

  required() {
    const {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      optional: _,
      ...newType
    } = this.type;
    return this.cloneWithType<Exclude<Flags, _Optional> | Required>(newType);
  }

  default(
    defaultF:
      | ObjKeyTypeWithFlags<T, "__type", never>
      | (() => ObjKeyTypeWithFlags<T, "__type", never>)
  ) {
    return this.cloneWithType<Flags | Required | HasDefault>({
      ...this.type,
      default: defaultF,
    });
  }

  public() {
    return this.cloneWithType<Flags | Public>({
      ...this.type,
      public: true,
    });
  }

  private() {
    return this.cloneWithType<Exclude<Flags, Public>>({
      ...this.type,
      public: false,
    });
  }

  derived() {
    return this.cloneWithType<Flags | Derived>({ ...this.type, derived: true });
  }
  auto() {
    return this.cloneWithType<Flags | Auto>({ ...this.type, auto: true });
  }
  key() {
    return this.cloneWithType<Flags | IsKey>({ ...this.type, key: true });
  }

  fillInDefaults(
    subject: SubjectMaybeObj<
      Schema<
        Flags,
        ObjKeyTypeWithFlags<T, "__type", never>,
        ObjKeyTypeWithFlags<PublicType, "__publicType", Public>,
        ObjKeyTypeWithFlags<NotDerivedType, "__notDerivedType", never, Derived>,
        ObjKeyTypeWithFlags<AutoType, "__autoType", Auto>,
        ObjKeyTypeWithFlags<DefaultType, "__defaultType", HasDefault>
      >
    >
  ): ObjKeyTypeWithFlags<T, "__type", never> {
    return fillInDefaults(this.getType(), subject, subject);
  }
}

export const obj = <T extends Keys>(keys: T): Obj<Required, T> => {
  return new Obj(keys);
};
