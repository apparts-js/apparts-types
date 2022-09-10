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

export type ObjType = {
  type: "object";
  keys: {
    [T: string]: Type;
  };
};
export type HasType =
  | {
      type: BaseTypeName;
    }
  | ObjType
  | {
      type: "object";
      values: Type;
    }
  | {
      type: "array";
      items: Type;
    }
  | {
      type: "oneOf";
      alternatives: Type[];
    };
export type Type = (
  | HasType
  | {
      value: any;
    }
) & {
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

export type Required = "__required";
export type Public = "__public";
export type Derived = "__derived";
export type FlagsType =
  | Public
  | Required
  | Derived
  // __all is for enabling a default value on the WOFlag type in
  // obj.ts. It should not be used manually anywhere and does not
  // transport meaning. It just makes sure, that no Flag combination
  // satisfies [FlagTypes] extends [FlagCombination].
  | "__all";
