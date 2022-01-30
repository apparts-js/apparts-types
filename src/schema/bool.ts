import { Optional, Required, IsRequired, Schema, Type } from "./utilTypes";

class Bool<Required extends IsRequired> extends Schema<boolean, Required> {
  constructor(type?: Type) {
    super();
    this.type = type || {
      type: "boolean",
    };
  }
  type: Type;
  readonly __type: boolean;
  readonly __required: Required;
  optional() {
    this.type.optional = true;
    return new Bool<Optional>(this.type);
  }
}
export const bool = (): Bool<Required> => {
  return new Bool();
};
