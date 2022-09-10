import { Schema } from "./Schema";
import { Required, FlagsType, Type, HasType } from "./utilTypes";

export class BaseType<T, PublicType, Flags extends FlagsType> extends Schema<
  T,
  PublicType,
  Flags
> {
  constructor(type: Type) {
    super();
    this.type = type;
  }
  type: Type;
  readonly __type: T;
  readonly __publicType: PublicType;
  readonly __flags: Flags;

  cloneWithType<Flags extends FlagsType>(type: Type) {
    return new BaseType<T, PublicType, Flags>(type);
  }
}
/*
export class Int<R extends IsRequired> extends BaseType<number, R> {
  semantic(type: "time" | "daytime" | "date" | "id") {
    (this.type as HasType).type = type;
    return this;
  }
  cloneWithType<R extends IsRequired>(type: Type) {
    return new Int<R>(type);
  }
}

export const int = (): Int<Required> => {
  return new Int({
    type: "int",
  });
};

export const float = (): BaseType<number, Required> => {
  return new BaseType({
    type: "float",
  });
};
*/
export const boolean = (): BaseType<boolean, boolean, Required> => {
  return new BaseType({
    type: "boolean",
  });
};

/*
export class Strring<R extends IsRequired> extends BaseType<string, R> {
  semantic(type: "password" | "id") {
    (this.type as HasType).type = type;
    return this;
  }
  cloneWithType<R extends IsRequired>(type: Type) {
    return new Strring<R>(type);
  }
}

export const string = (): Strring<Required> => {
  return new Strring({
    type: "string",
  });
};

export const hex = (): BaseType<string, Required> => {
  return new BaseType({
    type: "hex",
  });
};

export const uuidv4 = (): BaseType<string, Required> => {
  return new BaseType({
    type: "uuidv4",
  });
};

export const base64 = (): BaseType<string, Required> => {
  return new BaseType({
    type: "base64",
  });
};

export const email = (): BaseType<string, Required> => {
  return new BaseType({
    type: "email",
  });
};

export const nill = (): BaseType<null, Required> => {
  return new BaseType({
    type: "null",
  });
};

export const any = (): BaseType<any, Required> => {
  return new BaseType({
    type: "/",
  });
};
*/
