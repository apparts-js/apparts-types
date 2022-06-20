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

export abstract class Schema<SchemaType, R extends IsRequired> {
  abstract cloneWithType<R extends IsRequired>(
    type: Type
  ): Schema<SchemaType, R>;

  optional() {
    return this.cloneWithType<Optional>({ ...this.type, optional: true });
  }

  description(description: string) {
    return this.cloneWithType<R>({ ...this.type, description });
  }

  title(title: string) {
    return this.cloneWithType<R>({ ...this.type, title });
  }

  default(defaultF: SchemaType | (() => SchemaType)) {
    return this.cloneWithType<Optional>({ ...this.type, default: defaultF });
  }

  public() {
    return this.cloneWithType<R>({ ...this.type, public: true });
  }

  auto() {
    return this.cloneWithType<R>({ ...this.type, auto: true });
  }

  key() {
    return this.cloneWithType<R>({ ...this.type, key: true });
  }

  derived(derived: (...ps: any) => SchemaType | Promise<SchemaType>) {
    return this.cloneWithType<R>({ ...this.type, derived });
  }

  mapped(mapped: string) {
    return this.cloneWithType<R>({ ...this.type, mapped });
  }

  readOnly() {
    return this.cloneWithType<R>({ ...this.type, readOnly: true });
  }

  readonly __type: SchemaType;
  readonly __required: R;
  protected type: Type;

  getType() {
    return this.type;
  }
}
