import { Schema } from "./Schema";
import { FlagsType, CustomTypes, Required, Type } from "./utilTypes";

// https://dev.to/shakyshane/2-ways-to-create-a-union-from-an-array-in-typescript-1kd6
type Schemas = Array<Schema<Required, any>>;

export type OneOfType<T extends Schemas, CustomType extends CustomTypes> = {
  [key in keyof T]: T[key] extends Schema<Required, any>
    ? T[key][CustomType]
    : never;
}[number];

export class OneOf<
  Flags extends FlagsType,
  T extends Schema<any, Required>[],
  PublicType extends Schema<Required, any>[] = T,
  NotDerivedType extends Schema<Required, any>[] = T
> extends Schema<
  Flags,
  OneOfType<T, "__type">,
  OneOfType<T, "__publicType">,
  OneOfType<T, "__notDerivedType">
> {
  constructor(alternatives: T, type?: Type) {
    super();
    this.type = type || {
      type: "oneOf",
      alternatives: alternatives.map((alt) => alt.getType()),
    };
  }
  type: Type;

  readonly __type: OneOfType<T, "__type">;
  readonly __publicType: OneOfType<T, "__publicType">;
  readonly __notDerivedType: OneOfType<T, "__notDerivedType">;

  cloneWithType<Flags extends FlagsType>(type: Type) {
    return new OneOf<Flags, T, PublicType, NotDerivedType>(this.items, type);
  }

  private items: T;
}
export const oneOf = <T extends Schema<Required, any>[]>(
  alternatives: T
): OneOf<Required, T> => {
  return new OneOf(alternatives);
};
