import {
  Required,
  Public,
  FlagsType,
  Type,
  Derived,
  _Optional,
} from "./utilTypes";
import { fillInDefaults } from "../utils/fillInDefaults";

export abstract class Schema<
  Flags extends FlagsType,
  SchemaType,
  PublicType = SchemaType,
  NotDerivedType = SchemaType
> {
  abstract cloneWithType<Flags extends FlagsType>(
    type: Type
  ): Schema<Flags, SchemaType, PublicType, NotDerivedType>;

  abstract clone(type: Type): this;

  description(description: string) {
    return this.clone({ ...this.type, description });
  }

  title(title: string) {
    return this.clone({ ...this.type, title });
  }

  auto() {
    return this.clone({ ...this.type, auto: true });
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
  __flags: Flags;
  // @ts-expect-error This value is set in constructor of derived classes
  protected type: Type;

  getType() {
    return this.type;
  }

  fillInDefaults(subject: unknown) {
    return fillInDefaults(this.type, subject, subject);
  }
}
