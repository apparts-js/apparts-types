import { Optional, Required, IsRequired, Type } from "./utilTypes";
import { fillInDefaults } from "../utils/fillInDefaults";

export type FlagsType = "__public" | "__required";

export abstract class Schema<SchemaType, PublicType, Flags extends FlagsType> {
  abstract cloneWithType<Flags extends FlagsType>(
    type: Type
  ): Schema<SchemaType, PublicType, Flags>;

  optional() {
    return this.cloneWithType<Exclude<Flags, "__required">>({
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
    return this.cloneWithType<Flags | "__required">({
      ...this.type,
      default: defaultF,
    });
  }

  public() {
    return this.cloneWithType<Flags | "__public">({
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
    return this.cloneWithType<Flags>({ ...this.type, derived });
  }

  mapped(mapped: string) {
    return this.cloneWithType<Flags>({ ...this.type, mapped });
  }

  readOnly() {
    return this.cloneWithType<Flags>({ ...this.type, readOnly: true });
  }

  readonly __type: SchemaType;
  readonly __publicType: PublicType;
  readonly __flags: Flags;
  protected type: Type;

  getType() {
    return this.type;
  }

  fillInDefaults(subject: unknown) {
    return fillInDefaults(this.type, subject, subject);
  }
}
