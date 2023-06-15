import { Schema } from "./Schema";
import {
  FlagsType,
  CustomTypes,
  Required,
  Type,
  Derived,
  Public,
  _Optional,
  Auto,
} from "./utilTypes";

// https://dev.to/shakyshane/2-ways-to-create-a-union-from-an-array-in-typescript-1kd6
type Schemas = Array<Schema<Required, any, any, any, any>>;

export type InferOneOf<T extends Schemas, CustomType extends CustomTypes> = {
  [key in keyof T]: T[key] extends Schema<Required, any>
    ? T[key][CustomType]
    : never;
}[number];

export class OneOf<
  Flags extends FlagsType,
  T extends Schema<any, Required>[],
  PublicType extends Schema<Required, any>[] = T,
  NotDerivedType extends Schema<Required, any>[] = T,
  AutoType extends Schema<Required, any>[] = T
> extends Schema<
  Flags,
  InferOneOf<T, "__type">,
  InferOneOf<T, "__publicType">,
  InferOneOf<T, "__notDerivedType">,
  InferOneOf<T, "__autoType">
> {
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
  readonly __type: InferOneOf<T, "__type">;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __publicType: InferOneOf<T, "__publicType">;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __notDerivedType: InferOneOf<T, "__notDerivedType">;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __autoType: InferOneOf<T, "__autoType">;

  cloneWithType<Flags extends FlagsType>(type: Type) {
    return new OneOf<Flags, T, PublicType, NotDerivedType, AutoType>(
      this.alternatives,
      type
    );
  }
  clone(type: Type) {
    return new OneOf<Flags, T, PublicType, NotDerivedType, AutoType>(
      this.alternatives,
      type
    ) as this;
  }

  optional() {
    return this.cloneWithType<Exclude<Flags, Required> | _Optional>({
      ...this.type,
      optional: true,
    });
  }

  required() {
    const {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      optional: _,
      ...newType
    } = this.type;
    return this.cloneWithType<Exclude<Flags, _Optional> | Required>(newType);
  }

  default(defaultF: InferOneOf<T, "__type"> | (() => InferOneOf<T, "__type">)) {
    return this.cloneWithType<Flags | Required>({
      ...this.type,
      default: defaultF,
    });
  }

  public() {
    return this.cloneWithType<Flags | Public>({
      ...this.type,
      public: true,
    });
  }

  private() {
    return this.cloneWithType<Exclude<Flags, Public>>({
      ...this.type,
      public: false,
    });
  }

  derived(
    derived: (
      ...ps: any
    ) => InferOneOf<T, "__type"> | Promise<InferOneOf<T, "__type">>
  ) {
    return this.cloneWithType<Flags | Derived>({ ...this.type, derived });
  }
  private alternatives: T;

  auto() {
    return this.cloneWithType<Flags | Auto>({ ...this.type, auto: true });
  }

  getAlternatives() {
    return this.alternatives;
  }
}
export const oneOf = <T extends Schema<Required, any>[]>(
  alternatives: T
): OneOf<Required, T> => {
  return new OneOf(alternatives);
};
