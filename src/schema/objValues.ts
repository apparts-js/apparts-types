import { Schema } from "./Schema";
import {
  Auto,
  CustomTypes,
  Derived,
  FlagsType,
  Public,
  Required,
  Type,
  _Optional,
} from "./utilTypes";

type ObjValueType<
  T extends Schema<any, any, Required, any>,
  CustomType extends CustomTypes
> = {
  [key: string]: T[CustomType];
};

export class ObjValues<
  Flags extends FlagsType,
  T extends Schema<any, Required, any>,
  PublicType extends Schema<Required, any> = T,
  NotDerivedType extends Schema<Required, any> = T,
  AutoType extends Schema<Required, any> = T
> extends Schema<
  Flags,
  ObjValueType<T, "__type">,
  ObjValueType<T, "__publicType">,
  ObjValueType<T, "__notDerivedType">,
  ObjValueType<T, "__autoType">
> {
  constructor(values: T, type?: Type) {
    super();
    if (!type) {
      this.type = {
        type: "object",
        values: values.getType(),
      };
    } else {
      this.type = type;
    }
    this.values = values;
  }
  cloneWithType<Flags extends FlagsType>(type: Type) {
    return new ObjValues<Flags, T, PublicType, NotDerivedType, AutoType>(
      this.values,
      type
    );
  }
  clone(type: Type) {
    return new ObjValues<Flags, T, PublicType, NotDerivedType, AutoType>(
      this.values,
      type
    ) as this;
  }

  protected type: Type;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __type: ObjValueType<T, "__type">;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __publicType: ObjValueType<T, "__publicType">;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __notDerivedType: ObjValueType<T, "__notDerivedType">;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __autoType: ObjValueType<T, "__autoType">;

  private values: T;

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

  default(
    defaultF: ObjValueType<T, "__type"> | (() => ObjValueType<T, "__type">)
  ) {
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
    ) => ObjValueType<T, "__type"> | Promise<ObjValueType<T, "__type">>
  ) {
    return this.cloneWithType<Flags | Derived>({ ...this.type, derived });
  }

  auto() {
    return this.cloneWithType<Flags | Auto>({ ...this.type, auto: true });
  }
}

export const objValues = <T extends Schema<Required, any>>(
  values: T
): ObjValues<Required, T> => {
  return new ObjValues(values);
};
