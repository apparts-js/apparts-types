import { Schema } from "./Schema";
import {
  Required,
  _Optional,
  CustomTypes,
  FlagsType,
  Type,
  Public,
  Derived,
  Auto,
  HasDefault,
} from "./utilTypes";

type ArrayType<
  T extends Schema<any, Required>,
  CustomType extends CustomTypes
> = T[CustomType][];

export class Array<
  Flags extends FlagsType,
  T extends Schema<Required, any>,
  PublicType extends Schema<Required, any> = T,
  NotDerivedType extends Schema<Required, any> = T,
  AutoType extends Schema<Required, any> = T,
  DefaultType extends Schema<Required, any> = T
> extends Schema<
  Flags,
  ArrayType<T, "__type">,
  ArrayType<T, "__publicType">,
  ArrayType<T, "__notDerivedType">,
  ArrayType<T, "__autoType">,
  ArrayType<T, "__defaultType">
> {
  constructor(items: T, type?: Type) {
    super();
    this.items = items;
    this.type = type || {
      type: "array",
      items: items.getType(),
    };
  }
  type: Type;

  // @ts-expect-error This value is just here to make the type accessible
  readonly __type: ArrayType<T, "__type">;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __publicType: ArrayType<T, "__publicType">;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __notDerivedType: ArrayType<T, "__notDerivedType">;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __autoType: ArrayType<T, "__autoType">;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __defaultType: ArrayType<T, "__defaultType">;

  private items: T;

  getItems() {
    return this.items;
  }

  cloneWithType<Flags extends FlagsType>(type: Type) {
    return new Array<
      Flags,
      T,
      PublicType,
      NotDerivedType,
      AutoType,
      DefaultType
    >(this.items, type);
  }

  clone(type: Type) {
    return this.cloneWithType<Flags>(type) as this;
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

  default(defaultF: ArrayType<T, "__type"> | (() => ArrayType<T, "__type">)) {
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

  derived(
    derived: (
      ...ps: any
    ) => ArrayType<T, "__type"> | Promise<ArrayType<T, "__type">>
  ) {
    return this.cloneWithType<Flags | Derived>({ ...this.type, derived });
  }

  auto() {
    return this.cloneWithType<Flags | Auto>({ ...this.type, auto: true });
  }
}
export const array = <T extends Schema<Required, any>>(
  items: T
): Array<Required, T> => {
  return new Array(items);
};
