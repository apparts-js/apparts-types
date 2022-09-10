import { Schema } from "./Schema";
import { Required, FlagsType, Type, HasType } from "./utilTypes";

export class BaseType<Flags extends FlagsType, T> extends Schema<Flags, T> {
  constructor(type: Type) {
    super();
    this.type = type;
  }
  type: Type;
  readonly __type: T;
  readonly __flags: Flags;

  cloneWithType<Flags extends FlagsType>(type: Type) {
    return new BaseType<Flags, T>(type);
  }
}

export class Int<Flags extends FlagsType> extends BaseType<Flags, number> {
  semantic(type: "time" | "daytime" | "date" | "id") {
    (this.type as HasType).type = type;
    return this;
  }
  cloneWithType<Flags extends FlagsType>(type: Type) {
    return new Int<Flags>(type);
  }
}

export const int = (): Int<Required> => {
  return new Int({
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

export class Strring<Flags extends FlagsType> extends BaseType<Flags, string> {
  semantic(type: "password" | "id") {
    (this.type as HasType).type = type;
    return this;
  }
  cloneWithType<Flags extends FlagsType>(type: Type) {
    return new Strring<Flags>(type);
  }
}

export const string = (): Strring<Required> => {
  return new Strring({
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
