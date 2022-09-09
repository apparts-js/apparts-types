import { typeSchema } from "./typeSchema";
import { rtype } from "./typeType";
import { checkSchema } from "../../types/checkType";
import { explainCheck } from "../../types/explainCheck";

describe("typeSchema", () => {
  it("should match type with rtype", async () => {
    expect(typeSchema.getType()).toMatchObject(rtype);
  });

  it("should check type", async () => {
    expect(
      checkSchema(
        {
          type: "object",
          keys: {
            anArray: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
        typeSchema
      )
    ).toBeTruthy();

    expect(
      checkSchema(
        {
          type: "object",
          keys: {
            anArray: {
              type: "array",
            },
          },
        },
        typeSchema
      )
    ).toBeFalsy();
  });

  it("should explain check type", async () => {
    expect(
      explainCheck(
        {
          type: "object",
          keys: {
            anArray: {
              type: "array",
              items: {
                type: "string",
              },
            },
          },
        },
        typeSchema
      )
    ).toBeTruthy();

    expect(
      typeof explainCheck(
        {
          type: "object",
          keys: {
            anArray: {
              type: "array",
            },
          },
        },
        typeSchema
      )
    ).toBe("string");
  });
});
