import { Optional, Required, IsRequired, Type } from "./utilTypes";
import { fillInDefaults } from "../utils/fillInDefaults";

export abstract class Schema<SchemaType, R extends IsRequired> {
  abstract cloneWithType<R extends IsRequired>(
    type: Type
  ): Schema<SchemaType, R>;

  optional() {
    return this.cloneWithType<Optional>({ ...this.type, optional: true });
  }

  description(description: string) {
    return this.cloneWithType<R>({ ...this.type, description });
  }

  title(title: string) {
    return this.cloneWithType<R>({ ...this.type, title });
  }

  default(defaultF: SchemaType | (() => SchemaType)) {
    return this.cloneWithType<Required>({ ...this.type, default: defaultF });
  }

  public() {
    return this.cloneWithType<R>({ ...this.type, public: true });
  }

  auto() {
    return this.cloneWithType<R>({ ...this.type, auto: true });
  }

  key() {
    return this.cloneWithType<R>({ ...this.type, key: true });
  }

  derived(derived: (...ps: any) => SchemaType | Promise<SchemaType>) {
    return this.cloneWithType<R>({ ...this.type, derived });
  }

  mapped(mapped: string) {
    return this.cloneWithType<R>({ ...this.type, mapped });
  }

  readOnly() {
    return this.cloneWithType<R>({ ...this.type, readOnly: true });
  }

  readonly __type: SchemaType;
  readonly __required: R;
  protected type: Type;

  getType() {
    return this.type;
  }

  fillInDefaults(subject: unknown) {
    return fillInDefaults(this.type, subject, subject);
  }
}
