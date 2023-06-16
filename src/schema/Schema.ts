import { fillInDefaults } from "../utils/fillInDefaults";
import { FlagsType, Type, Required, _Optional } from "./utilTypes";
import { Obj } from "./obj";
import { ObjValues } from "./objValues";
import { Array } from "./array";
import { OneOf } from "./oneOf";
import { Value } from "./value";
import { BaseType } from "./baseType";

export type CloneWithFlagsReturn<X, Flags extends FlagsType> = X extends Obj<
  any,
  infer SchemaType,
  infer PublicType,
  infer NotDerivedType,
  infer AutoType
>
  ? Obj<Flags, SchemaType, PublicType, NotDerivedType, AutoType>
  : X extends ObjValues<
      any,
      infer SchemaType,
      infer PublicType,
      infer NotDerivedType,
      infer AutoType
    >
  ? ObjValues<Flags, SchemaType, PublicType, NotDerivedType, AutoType>
  : X extends Array<
      any,
      infer SchemaType,
      infer PublicType,
      infer NotDerivedType,
      infer AutoType
    >
  ? Array<Flags, SchemaType, PublicType, NotDerivedType, AutoType>
  : X extends OneOf<
      any,
      infer SchemaType,
      infer PublicType,
      infer NotDerivedType,
      infer AutoType
    >
  ? OneOf<Flags, SchemaType, PublicType, NotDerivedType, AutoType>
  : X extends Value<any, infer SchemaType>
  ? Value<Flags, SchemaType>
  : X extends BaseType<any, infer SchemaType>
  ? BaseType<Flags, SchemaType>
  : never;

export abstract class Schema<
  Flags extends FlagsType,
  SchemaType,
  PublicType = SchemaType,
  NotDerivedType = SchemaType,
  AutoType = SchemaType
> {
  // cloneWithType is defined in the non-abstract classes. It must not
  // be used in this abstract class as it would here only return a
  // Schema, not the correct instance class. In the non-abstract
  // classes cloneWithType is overwritten in such a way that the
  // instance class is returned. Hence, in the non-abstract classes it
  // can (and has to be) used.
  abstract cloneWithType<Flags extends FlagsType>(
    type: Type
  ): CloneWithFlagsReturn<this, Flags>;

  // Clone can be used here as it returns the instance type
  // (this). This is possible as we do not need to change any flags.
  abstract clone(type: Type): this;

  // Here are the functions that manipulate the type but not the
  // flags. We can define them here as we have clone accessible in
  // here. Functions like optional or derived can not be defined here
  // as they need the cloneWithType function that we cannot correctly
  // type here in a way that it returns instance classes instead of
  // Schema.
  description(description: string) {
    return this.clone({ ...this.type, description });
  }

  title(title: string) {
    return this.clone({ ...this.type, title });
  }

  key() {
    return this.clone({ ...this.type, key: true });
  }

  mapped(mapped: string) {
    return this.clone({ ...this.type, mapped });
  }

  readOnly() {
    return this.clone({ ...this.type, readOnly: true });
  }

  semantic(semantic: string) {
    return this.clone({ ...this.type, semantic });
  }

  // @ts-expect-error This value is just here to make the type accessible
  readonly __type: SchemaType;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __publicType: PublicType;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __notDerivedType: NotDerivedType;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __autoType: AutoType;

  // @ts-expect-error This value is just here to make the type accessible
  readonly __flags: Flags;
  // @ts-expect-error This value is set in constructor of derived classes
  protected type: Type;

  getType() {
    return this.type;
  }

  fillInDefaults(subject: unknown) {
    return fillInDefaults(this.type, subject, subject);
  }

  optional() {
    return this.cloneWithType<Exclude<Flags, Required> | _Optional>({
      ...this.type,
      optional: true,
    });
  }
}
