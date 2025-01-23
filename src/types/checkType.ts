import { Type, Schema } from "../schema";
import { recursiveCheck } from "./recursiveCheck";

export const checkType = (response: unknown, type: Type) => {
  return recursiveCheck(type, response) === true;
};

export const checkSchema = (response: unknown, schema: Schema<any, any>) => {
  return checkType(response, schema.getType());
};
