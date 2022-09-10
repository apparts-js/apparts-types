/*import { Schema } from "./Schema";
import { Required, IsRequired, Type } from "./utilTypes";

type ArrayType<T extends Schema<any, Required>> = T["__type"][];

export class Array<
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

  cloneWithType<R extends IsRequired>(type: Type) {
    return new Array<T, R>(this.items, type);
  }

  private items: T;
}
export const array = <T extends Schema<any, Required>>(
  items: T
): Array<T, Required> => {
  return new Array(items);
};
*/
