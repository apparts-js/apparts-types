import { Required, Optional, IsRequired, Schema, Type } from "./utilTypes";

// https://dev.to/shakyshane/2-ways-to-create-a-union-from-an-array-in-typescript-1kd6
type Schemas = Array<Schema<any, Required>>;
export type OneOfType<T extends Schemas> = {
  [key in keyof T]: T[key] extends Schema<any, Required>
    ? T[key]["__type"]
    : never;
}[number];

class OneOf<
  T extends Schema<any, Required>[],
  R extends IsRequired
> extends Schema<OneOfType<T>, R> {
  constructor(alternatives: T, type?: Type) {
    super();
    this.type = type || {
      type: "oneOf",
      alternatives: alternatives.map((alt) => alt.getType()),
    };
  }
  type: Type;
  readonly __type: OneOfType<T>;
  readonly __required: R;

  optional() {
    this.type.optional = true;
    return new OneOf<T, Optional>(this.items, this.type);
  }
  private items: T;
}
export const oneOf = <T extends Schema<any, Required>[]>(
  alternatives: T
): OneOf<T, Required> => {
  return new OneOf(alternatives);
};
