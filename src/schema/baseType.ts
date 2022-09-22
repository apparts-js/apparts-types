import { Schema } from "./Schema";
import { Required, FlagsType, Type } from "./utilTypes";

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
