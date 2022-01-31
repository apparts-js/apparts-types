import { Required, Optional, IsRequired, Schema, Type } from "./utilTypes";

type ArrayType<T extends Schema<any, Required>> = T["__type"][];

class Array<
  T extends Schema<any, Required>,
  R extends IsRequired
> extends Schema<ArrayType<T>, R> {
  constructor(items: T, type?: Type) {
    super();
    this.type = type || {
      type: "array",
      items: items.getType(),
    };
  }
  type: Type;
  readonly __type: ArrayType<T>;
  readonly __required: R;

  optional() {
    this.type.optional = true;
    return new Array<T, Optional>(this.items, this.type);
  }
  private items: T;
}
export const array = <T extends Schema<any, Required>>(
  items: T
): Array<T, Required> => {
  return new Array(items);
};
