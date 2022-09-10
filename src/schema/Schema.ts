import { Optional, Required, IsRequired, Type } from "./utilTypes";
import { fillInDefaults } from "../utils/fillInDefaults";

export abstract class Schema<
  SchemaType,
  PublicType,
  R extends IsRequired,
  P extends boolean
> {
  abstract cloneWithType<R extends IsRequired, P extends boolean>(
    type: Type
  ): Schema<SchemaType, PublicType, R, P>;

  optional() {
    return this.cloneWithType<Optional, P>({ ...this.type, optional: true });
  }

  description(description: string) {
    return this.cloneWithType<R, P>({ ...this.type, description });
  }

  title(title: string) {
    return this.cloneWithType<R, P>({ ...this.type, title });
  }

  default(defaultF: SchemaType | (() => SchemaType)) {
    return this.cloneWithType<Required, P>({ ...this.type, default: defaultF });
  }

  public() {
    return this.cloneWithType<R, true>({ ...this.type, public: true });
  }

  auto() {
    return this.cloneWithType<R, P>({ ...this.type, auto: true });
  }

  key() {
    return this.cloneWithType<R, P>({ ...this.type, key: true });
  }

  derived(derived: (...ps: any) => SchemaType | Promise<SchemaType>) {
    return this.cloneWithType<R, P>({ ...this.type, derived });
  }

  mapped(mapped: string) {
    return this.cloneWithType<R, P>({ ...this.type, mapped });
  }

  readOnly() {
    return this.cloneWithType<R, P>({ ...this.type, readOnly: true });
  }

  readonly __type: SchemaType;
  readonly __publicType: PublicType;
  readonly __required: R;
  readonly __public: P;
  protected type: Type;

  getType() {
    return this.type;
  }

  fillInDefaults(subject: unknown) {
    return fillInDefaults(this.type, subject, subject);
  }
}
