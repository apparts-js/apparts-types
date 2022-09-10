import { Schema } from "./Schema";
import { Required, CustomTypes, FlagsType, Type } from "./utilTypes";

type ArrayType<
  T extends Schema<any, Required>,
  CustomType extends CustomTypes
> = T[CustomType][];

export class Array<
  Flags extends FlagsType,
  T extends Schema<Required, any>,
  PublicType extends Schema<Required, any> = T,
  NotDerivedType extends Schema<Required, any> = T
> extends Schema<
  Flags,
  ArrayType<T, "__type">,
  ArrayType<T, "__publicType">,
  ArrayType<T, "__notDerivedType">
> {
  constructor(items: T, type?: Type) {
    super();
    this.type = type || {
      type: "array",
      items: items.getType(),
    };
  }
  type: Type;

  readonly __type: ArrayType<T, "__type">;
  readonly __publicType: ArrayType<T, "__publicType">;
  readonly __notDerivedType: ArrayType<T, "__notDerivedType">;

  cloneWithType<Flags extends FlagsType>(type: Type) {
    return new Array<Flags, T, PublicType, NotDerivedType>(this.items, type);
  }

  private items: T;
}
export const array = <T extends Schema<Required, any>>(
  items: T
): Array<Required, T> => {
  return new Array(items);
};
