type TypeParameters = {
  optional?: true;
  description?: string;
  title?: string;
  public?: boolean;
  auto?: boolean;
  key?: boolean;
  derived?: (...ps: any) => any;
  default?: any | ((...ps: any) => any);
  mapped?: string;
  readOnly?: boolean;
};

export type BaseTypeName =
  | "id"
  | "uuidv4"
  | "int"
  | "time"
  | "daytime"
  | "date"
  | "float"
  | "bool"
  | "boolean"
  | "string"
  | "password"
  | "null"
  | "/"
  | "email"
  | "hex"
  | "base64";

export type BaseType = {
  type: BaseTypeName;
} & TypeParameters;

export type ObjType = {
  type: "object";
  keys: {
    [T: string]: Type;
  };
} & TypeParameters;

export type ObjValueType = {
  type: "object";
  values: Type;
} & TypeParameters;

export type ArrayType = {
  type: "array";
  items: Type;
} & TypeParameters;

export type OneOfType = {
  type: "oneOf";
  alternatives: Type[];
} & TypeParameters;

export type HasType = BaseType | ObjType | ObjValueType | ArrayType | OneOfType;

export type ValueType = {
  value: any;
} & TypeParameters;

export type Type = HasType | ValueType;

export type Optional = false;
export type Required = true;
export type IsRequired = Optional | Required;
