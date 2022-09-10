import { Required, Public, FlagsType, Type, Derived } from "./utilTypes";
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

  optional() {
    return this.cloneWithType<Exclude<Flags, Required>>({
      ...this.type,
      optional: true,
    });
  }

  description(description: string) {
    return this.cloneWithType<Flags>({ ...this.type, description });
  }

  title(title: string) {
    return this.cloneWithType<Flags>({ ...this.type, title });
  }

  default(defaultF: SchemaType | (() => SchemaType)) {
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

  auto() {
    return this.cloneWithType<Flags>({ ...this.type, auto: true });
  }

  key() {
    return this.cloneWithType<Flags>({ ...this.type, key: true });
  }

  derived(derived: (...ps: any) => SchemaType | Promise<SchemaType>) {
    return this.cloneWithType<Flags | Derived>({ ...this.type, derived });
  }

  mapped(mapped: string) {
    return this.cloneWithType<Flags>({ ...this.type, mapped });
  }

  readOnly() {
    return this.cloneWithType<Flags>({ ...this.type, readOnly: true });
  }

  readonly __type: SchemaType;
  readonly __publicType: PublicType;
  readonly __notDerivedType: NotDerivedType;

  readonly __flags: Flags;
  protected type: Type;

  getType() {
    return this.type;
  }

  fillInDefaults(subject: unknown) {
    return fillInDefaults(this.type, subject, subject);
  }
}
