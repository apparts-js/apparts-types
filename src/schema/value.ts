import { Schema } from "./Schema";
import { fillInDefaults } from "../utils/fillInDefaults";
import { SubjectMaybe } from "../utils/fillInDefaultsShared";
import {
  Required,
  FlagsType,
  Type,
  _Optional,
  Public,
  Derived,
  Auto,
  HasDefault,
  IsKey,
} from "./utilTypes";

export class Value<Flags extends FlagsType, T> extends Schema<Flags, T> {
  constructor(value: T, type?: Type) {
    super();
    this.type = type || {
      value,
    };
    this.value = value;
  }
  type: Type;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __type: T;
  private value: T;

  cloneWithType<Flags extends FlagsType>(type: Type) {
    return new Value<Flags, T>(this.value, type);
  }

  clone(type: Type) {
    return this.cloneWithType<Flags>(type) as this;
  }

  getValue() {
    return this.value;
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

  default(defaultF: T | (() => T)) {
    return this.cloneWithType<Flags | Required | HasDefault>({
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

  derived() {
    return this.cloneWithType<Flags | Derived>({ ...this.type, derived: true });
  }

  auto() {
    return this.cloneWithType<Flags | Auto>({ ...this.type, auto: true });
  }

  key() {
    return this.cloneWithType<Flags | IsKey>({ ...this.type, key: true });
  }

  fillInDefaults(subject: SubjectMaybe<Schema<Flags, T>>): T {
    return fillInDefaults(this.getType(), subject, subject);
  }
}
export const value = <T extends string | number | boolean>(
  value: T
): Value<Required, T> => {
  type A = Readonly<typeof value>;
  return new Value<Required, A>(value);
};
