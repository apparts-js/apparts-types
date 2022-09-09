import { typeSchema } from "./typeSchema";
import { rtype } from "./typeType";

describe("typeSchema", () => {
  it("should match type with rtype", async () => {
    expect(typeSchema.getType()).toMatchObject(rtype);
  });
});
