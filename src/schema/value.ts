import { Schema } from "./Schema";
import { Required, IsRequired, Type } from "./utilTypes";

export class Value<T, R extends IsRequired> extends Schema<T, R> {
  constructor(value: T, type?: Type) {
    super();
    this.type = type || {
      value,
    };
    this.value = value;
  }
  type: Type;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __type: T;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __required: R;
  private value: T;

  cloneWithType<R extends IsRequired>(type: Type) {
    return new Value<T, R>(this.value, type);
  }
}
export const value = <T extends string | number | boolean>(
  value: T
): Value<T, Required> => {
  type A = Readonly<typeof value>;
  return new Value<A, Required>(value);
};
