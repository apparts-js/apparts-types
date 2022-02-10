export type BaseTypeName =
  | "id"
  | "uuidv4"
  | "int"
  | "time"
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

export abstract class Schema<SchemaType, Required extends IsRequired> {
  abstract cloneWithType(type: Type): Schema<SchemaType, Required>;
  abstract optional(): Schema<SchemaType, Optional>;

  description(description: string) {
    return this.cloneWithType({ ...this.type, description });
  }

  default(defaultF: SchemaType | (() => SchemaType)) {
    return this.cloneWithType({ ...this.type, default: defaultF });
  }

  public() {
    return this.cloneWithType({ ...this.type, public: true });
  }

  auto() {
    return this.cloneWithType({ ...this.type, auto: true });
  }

  key() {
    return this.cloneWithType({ ...this.type, key: true });
  }

  derived(derived: (...ps: any) => SchemaType) {
    return this.cloneWithType({ ...this.type, derived });
  }

  mapped(mapped: string) {
    return this.cloneWithType({ ...this.type, mapped });
  }

  readOnly() {
    return this.cloneWithType({ ...this.type, readOnly: true });
  }

  readonly __type: SchemaType;
  readonly __required: Required;
  protected type: Type;

  getType() {
    return this.type;
  }
}
