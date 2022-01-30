import { bool, array, InferType } from "./index";

describe("array type", () => {
  it("should fail on optional items-type", async () => {
    // @ts-expect-error
    array(bool().optional());
  });

  it("should infer type correctly", async () => {
    const arrayType = array(bool());
    type MyArr = InferType<typeof arrayType>;
    const f = (a: MyArr) => a;

    f([true, false]);
    f([]);
    // @ts-expect-error
    f([1]);
  });
});
