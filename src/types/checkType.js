import { recursiveCheck } from "./recursiveCheck";

export const checkType = (response, type) => {
  return recursiveCheck(type, response) === true;
};

export const checkSchema = (response, schema) => {
  return checkType(response, schema.getType());
};
