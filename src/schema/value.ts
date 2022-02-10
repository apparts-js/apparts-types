import { Optional, Required, IsRequired, Schema, Type } from "./utilTypes";

class Value<T, R extends IsRequired> extends Schema<T, R> {
  constructor(value: T, type?: Type) {
    super();
    this.type = type || {
      value,
    };
    this.value = value;
  }
  type: Type;
  readonly __type: T;
  readonly __required: R;
  private value: T;

  optional() {
    this.type.optional = true;
    return new Value<T, Optional>(this.value, this.type);
  }
  cloneWithType(type: Type) {
    return new Value<T, R>(this.value, type);
  }
}
export const value = <T extends string | number | boolean>(
  value: T
): Value<T, Required> => {
  type A = Readonly<typeof value>;
  return new Value<A, Required>(value);
};
