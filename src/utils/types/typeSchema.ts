// A schema that describes a type
import { rtype } from "./typeType";
import {
  any,
  string,
  obj,
  objValues,
  value,
  oneOf,
  array,
  OneOf,
  Value,
  Obj,
  ObjValues,
  Schema,
  Array,
  BaseType,
} from "../../schema";

type TypeSchemaType = OneOf<
  [
    Obj<
      {
        type: Value<"object", true>;
        description: Schema<string, false>;
        keys: ObjValues<TypeSchemaType, true>;
      },
      true
    >,
    Obj<
      {
        type: Value<"object", true>;
        description: Schema<string, false>;
        values: TypeSchemaType;
      },
      true
    >,
    Obj<
      {
        type: Value<"oneOf", true>;
        description: Schema<string, false>;
        alernatives: Array<TypeSchemaType, true>;
      },
      true
    >,
    Obj<
      {
        type: Value<"array", true>;
        items: TypeSchemaType;
        description: Schema<string, false>;
      },
      true
    >,
    Obj<
      {
        description: Schema<string, false>;
        value: BaseType<any, true>;
      },
      true
    >,
    Obj<
      {
        description: Schema<string, false>;
        type: OneOf<
          (
            | Value<"id", true>
            | Value<"uuidv4", true>
            | Value<"/", true>
            | Value<"int", true>
            | Value<"float", true>
            | Value<"hex", true>
            | Value<"base64", true>
            | Value<"bool", true>
            | Value<"boolean", true>
            | Value<"string", true>
            | Value<"email", true>
            | Value<"array_int", true>
            | Value<"array_id", true>
            | Value<"password", true>
            | Value<"time", true>
            | Value<"array_time", true>
            | Value<"null", true>
          )[],
          true
        >;
      },
      true
    >
  ],
  true
>;

const description = string().optional();

const typeSchemaOneOfArray = [];
export const typeSchema: TypeSchemaType = new OneOf(
  typeSchemaOneOfArray,
  rtype
) as TypeSchemaType;

export const objectKeysSchema = obj({
  type: value("object"),
  description,
  keys: objValues(typeSchema),
});

export const objectValuesSchema = obj({
  type: value("object"),
  description,
  values: typeSchema,
});

export const oneOfSchema = obj({
  type: value("oneOf"),
  description,
  alernatives: array(typeSchema),
});

export const arraySchema = obj({
  type: value("array"),
  items: typeSchema,
  description,
});

export const valueSchema = obj({
  description,
  value: any(),
});

export const directSchema = obj({
  description,
  type: oneOf([
    value("id"),
    value("uuidv4"),
    value("/"),
    value("int"),
    value("float"),
    value("hex"),
    value("base64"),
    value("bool"),
    value("boolean"),
    value("string"),
    value("email"),
    value("array_int"),
    value("array_id"),
    value("password"),
    value("time"),
    value("array_time"),
    value("null"),
  ]),
});

typeSchemaOneOfArray.push(oneOfSchema);
typeSchemaOneOfArray.push(objectKeysSchema);
typeSchemaOneOfArray.push(objectValuesSchema);
typeSchemaOneOfArray.push(arraySchema);
typeSchemaOneOfArray.push(directSchema);
typeSchemaOneOfArray.push(valueSchema);

// should be the same as Type from schema/utilTypes:
// export type TypeType = InferType<typeof typeSchema>;
