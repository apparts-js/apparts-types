export type Type = (
  | {
      type: "int" | "boolean";
    }
  | {
      type: "object";
      keys: {
        [T: string]: Type;
      };
    }
) & {
  optional?: true;
  description?: string;
};

export interface Params {
  optional?: true;
  description?: string;
  semantic?: string;
}

export type Optional = false;
export type Required = true;
export type IsRequired = Optional | Required;

export abstract class Schema<SchemaType, Required extends IsRequired> {
  abstract optional(): Schema<SchemaType, Optional>;
  description(description: string) {
    this.type.description = description;
  }
  readonly __type: SchemaType;
  readonly __required: Required;
  type: Type;
}
