import { boolean, array, InferType } from "./index";

describe("array type", () => {
  it("should fail on optional items-type", async () => {
    // @ts-expect-error test type
    array(boolean().optional());
  });

  it("should infer type correctly", async () => {
    const arrayType = array(boolean());
    type MyArr = InferType<typeof arrayType>;
    const f = (a: MyArr) => a;

    f([true, false]);
    f([]);
    // @ts-expect-error test type
    f([1]);
  });
});
