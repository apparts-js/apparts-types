import { Schema } from "./Schema";
import { Required, FlagsType, Type } from "./utilTypes";

export class Value<Flags extends FlagsType, T> extends Schema<Flags, T> {
  constructor(value: T, type?: Type) {
    super();
    this.type = type || {
      value,
    };
    this.value = value;
  }
  type: Type;
  readonly __type: T;
  private value: T;

  cloneWithType<Flags extends FlagsType>(type: Type) {
    return new Value<Flags, T>(this.value, type);
  }
}
export const value = <T extends string | number | boolean>(
  value: T
): Value<Required, T> => {
  type A = Readonly<typeof value>;
  return new Value<Required, A>(value);
};
