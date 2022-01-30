import {
  Optional,
  Required,
  IsRequired,
  Schema,
  Type,
  BaseTypeName,
} from "./utilTypes";

class BaseType<T, R extends IsRequired> extends Schema<T, R> {
  constructor(type: Type) {
    super();
    this.type = type;
  }
  type: Type;
  readonly __type: T;
  readonly __required: R;
  optional() {
    this.type.optional = true;
    return new BaseType<T, Optional>(this.type);
  }
}

class Int<R extends IsRequired> extends BaseType<number, R> {
  semantic(type: "time") {
    this.type.type = type;
    return this;
  }
  optional() {
    this.type.optional = true;
    return new Int<Optional>(this.type);
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

export const boolean = (): BaseType<boolean, Required> => {
  return new BaseType({
    type: "boolean",
  });
};

class String<R extends IsRequired> extends BaseType<string, R> {
  semantic(type: "password") {
    this.type.type = type;
    return this;
  }
  optional() {
    this.type.optional = true;
    return new String<Optional>(this.type);
  }
}

export const string = (): String<Required> => {
  return new String({
    type: "string",
  });
};

export const hex = (): BaseType<string, Required> => {
  return new BaseType({
    type: "hex",
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
