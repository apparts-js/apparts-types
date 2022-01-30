import { Optional, Required, IsRequired, Schema, Type } from "./utilTypes";

class Value<T, Required extends IsRequired> extends Schema<T, Required> {
  constructor(value: T, type?: Type) {
    super();
    this.type = type || {
      type: "value",
      value,
    };
    this.value = value;
  }
  type: Type;
  readonly __type: T;
  readonly __required: Required;
  private value: T;

  optional() {
    this.type.optional = true;
    return new Value<T, Optional>(this.value, this.type);
  }
}
export const value = <T extends string | number | boolean>(
  value: T
): Value<T, Required> => {
  type A = Readonly<typeof value>;
  return new Value<A, Required>(value);
};
