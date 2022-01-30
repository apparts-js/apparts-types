import { obj, oneOf, boolean, int, InferType } from "./index";

describe("obj type", () => {
  it("should defer type correctly", async () => {
    const oneOfSchema = oneOf([boolean(), int()]);
    type OneOf = InferType<typeof oneOfSchema>;
    const f = (a: OneOf) => a;

    f(true);
    f(3);
    // @ts-expect-error
    f({ maybe: true });
    // @ts-expect-error
    f("test");
  });

  it("should defer type correctly with obj", async () => {
    const oneOfSchema = oneOf([
      obj({
        testNumber: int(),
      }),
      obj({
        testBool: boolean(),
      }),
    ]);
    type OneOf = InferType<typeof oneOfSchema>;
    const f = (a: OneOf) => a;

    f({ testBool: true });
    // @ts-expect-error
    f({});
    // @ts-expect-error
    f(3);
  });
});
