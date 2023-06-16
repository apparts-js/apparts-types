import { Schema } from "./Schema";
import {
  Required,
  FlagsType,
  Type,
  Public,
  Derived,
  _Optional,
  Auto,
} from "./utilTypes";

export class BaseType<Flags extends FlagsType, T> extends Schema<Flags, T> {
  constructor(type: Type) {
    super();
    this.type = type;
  }
  type: Type;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __type: T;
  // @ts-expect-error This value is just here to make the type accessible
  readonly __flags: Flags;

  cloneWithType<Flags extends FlagsType>(type: Type) {
    return new BaseType<Flags, T>(type);
  }

  clone(type: Type) {
    return this.cloneWithType<Flags>(type) as this;
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

  derived(derived: (...ps: any) => T | Promise<T>) {
    return this.cloneWithType<Flags | Derived>({ ...this.type, derived });
  }

  auto() {
    return this.cloneWithType<Flags | Auto>({ ...this.type, auto: true });
  }
}

export const int = (): BaseType<Required, number> => {
  return new BaseType({
    type: "int",
  });
};

export const float = (): BaseType<Required, number> => {
  return new BaseType({
    type: "float",
  });
};

export const boolean = (): BaseType<Required, boolean> => {
  return new BaseType({
    type: "boolean",
  });
};

export const string = (): BaseType<Required, string> => {
  return new BaseType({
    type: "string",
  });
};

export const hex = (): BaseType<Required, string> => {
  return new BaseType({
    type: "hex",
  });
};

export const uuidv4 = (): BaseType<Required, string> => {
  return new BaseType({
    type: "uuidv4",
  });
};

export const base64 = (): BaseType<Required, string> => {
  return new BaseType({
    type: "base64",
  });
};

export const email = (): BaseType<Required, string> => {
  return new BaseType({
    type: "email",
  });
};

export const phoneISD = (): BaseType<Required, string> => {
  return new BaseType({
    type: "phoneISD",
  });
};

export const nill = (): BaseType<Required, null> => {
  return new BaseType({
    type: "null",
  });
};

export const any = (): BaseType<Required, any> => {
  return new BaseType({
    type: "/",
  });
};
