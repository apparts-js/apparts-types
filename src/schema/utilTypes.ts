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
  | "phoneISD"
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

export type Optional = false;
export type Required = true;
export type IsRequired = Optional | Required;
