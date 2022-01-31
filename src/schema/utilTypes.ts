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

export type Type = (
  | {
      type: BaseTypeName;
    }
  | {
      type: "object";
      keys: {
        [T: string]: Type;
      };
    }
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
    }
  | {
      type: "value";
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
  abstract optional(): Schema<SchemaType, Optional>;

  description(description: string) {
    this.type.description = description;
    return this;
  }

  default(defaultF: SchemaType | (() => SchemaType)) {
    this.type.default = defaultF;
    return this;
  }

  public() {
    this.type.public = true;
    return this;
  }

  auto() {
    this.type.auto = true;
    return this;
  }

  key() {
    this.type.key = true;
    return this;
  }

  derived(derived: (...ps: any) => SchemaType) {
    this.type.derived = derived;
    return this;
  }

  mapped(mapped: string) {
    this.type.mapped = mapped;
    return this;
  }

  readOnly() {
    this.type.readOnly = true;
    return this;
  }

  readonly __type: SchemaType;
  readonly __required: Required;
  protected type: Type;

  getType() {
    return this.type;
  }
}
