import { value, InferType } from "./index";

describe("value type", () => {
  it("should infer type correctly", async () => {
    const valueSchema = value(3);
    type MyValueType = InferType<typeof valueSchema>;
    const f = (a: MyValueType) => a;

    f(3);
    // @ts-expect-error
    f(4);
    // @ts-expect-error
    f("3");
    // @ts-expect-error
    f(true);
    // @ts-expect-error
    f([]);
  });
});
