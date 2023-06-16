type TypeParameters = {
  optional?: true;
  description?: string;
  title?: string;
  public?: boolean;
  auto?: boolean;
  key?: boolean;
  derived?: (...ps: any) => any;
  default?: any | ((...ps: any) => any);
  check?: (value: unknown) => boolean | string;
  mapped?: string;
  readOnly?: boolean;
  semantic?: string;
};

export type BaseTypeName =
  | "id"
  | "uuidv4"
  | "int"
  | "time"
  | "daytime"
  | "date"
  | "float"
  | "boolean"
  | "string"
  | "password"
  | "null"
  | "/"
  | "email"
  | "phoneISD"
  | "hex"
  | "base64";

export type SimpleType = {
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

export type HasType =
  | SimpleType
  | ObjType
  | ObjValueType
  | ArrayType
  | OneOfType;

export type ValueType = {
  value: any;
} & TypeParameters;

export type Type = HasType | ValueType;

// Not for usage, just for making sure, that Flags is not nothing
export type _Optional = "__optional";

export type Required = "__required";
export type Public = "__public";
export type Derived = "__derived";
export type Auto = "__auto";
export type HasDefault = "__default";

export type FlagsType =
  | Public
  | _Optional
  | Auto
  | HasDefault
  | Required
  | Derived
  // __all is for enabling a default value on the WOFlag type in
  // obj.ts. It should not be used manually anywhere and does not
  // transport meaning. It just makes sure, that no Flag combination
  // satisfies [FlagTypes] extends [FlagCombination].
  | "__all";

export type CustomTypes =
  | "__type"
  | "__publicType"
  | "__notDerivedType"
  | "__autoType"
  | "__defaultType";
