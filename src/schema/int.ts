import { Optional, Required, IsRequired, Schema, Type } from "./utilTypes";

class Int<Required extends IsRequired> extends Schema<number, Required> {
  constructor(type?: Type) {
    super();
    this.type = type || {
      type: "int",
    };
  }
  type: Type;
  readonly __type: number;
  readonly __required: Required;
  optional() {
    this.type.optional = true;
    return new Int<Optional>(this.type);
  }
}
export const int = (): Int<Required> => {
  return new Int();
};
