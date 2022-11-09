import { Schema } from "./Schema";
import { Required, IsRequired, Type } from "./utilTypes";

// https://dev.to/shakyshane/2-ways-to-create-a-union-from-an-array-in-typescript-1kd6
type Schemas = Array<Schema<any, Required>>;
type OneOfType<T extends Schemas> = {
  [key in keyof T]: T[key] extends Schema<any, Required>
    ? T[key]["__type"]
    : never;
}[number];

export class OneOf<
  T extends Schema<any, Required>[],
  R extends IsRequired
> extends Schema<OneOfType<T>, R> {
  constructor(alternatives: T, type?: Type) {
    super();
    this.alternatives = alternatives;
    this.type = type || {
      type: "oneOf",
      alternatives: alternatives.map((alt) => alt.getType()),
    };
  }
  type: Type;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __type: OneOfType<T>;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __required: R;

  cloneWithType<R extends IsRequired>(type: Type) {
    return new OneOf<T, R>(this.alternatives, type);
  }

  private alternatives: T;
}
export const oneOf = <T extends Schema<any, Required>[]>(
  alternatives: T
): OneOf<T, Required> => {
  return new OneOf(alternatives);
};
