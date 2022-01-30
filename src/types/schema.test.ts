import { int, bool, obj, InferType } from "./schema";

//export interface Test extends InferType<typeof testSchema> {}
//let a: Test2;

describe("ts type", () => {
  it("should match", () => {
    const testSchema = obj({
      keys: {
        isTrue: bool(),
        isMaybeTrue: bool({ optional: true }),
        isMaybeThree: int({ optional: true }),
        anObj: obj({
          keys: {
            isMaybeTrue: bool({ optional: true }),
            isThree: int({}),
          },
        }),
      },
    });
    const testSchema2 = obj({
      keys: {
        maybe: bool({ optional: true }),
        just: bool(),
      },
    });
    expect(testSchema.type).toStrictEqual({
      type: "object",
      keys: {
        isTrue: { type: "boolean" },
        isMaybeTrue: { type: "boolean", optional: true },
        isMaybeThree: { type: "int", optional: true },
        anObj: {
          type: "object",
          keys: {
            isMaybeTrue: { type: "boolean", optional: true },
            isThree: { type: "int" },
          },
        },
      },
    });
  });

  it("should defer optional correctly", async () => {
    const hasOptionals = obj({
      optional: undefined,
      keys: {
        just: bool(),
        just2: bool({}),
        just3: bool({ optional: undefined }),
        maybe: bool({ optional: true }),
      },
    });
    type HasOptionals = InferType<typeof hasOptionals>;
    const f = (a: HasOptionals) => a;

    f({
      just: true,
      just2: true,
      just3: true,
      maybe: true,
    });

    f({
      just: true,
      just2: true,
      just3: true,
    });

    // @ts-expect-error
    f({
      just2: true,
      just3: true,
      maybe: true,
    });

    // @ts-expect-error
    f({
      just: true,
      just3: true,
      maybe: true,
    });

    // @ts-expect-error
    f({
      just: true,
      just2: true,
      maybe: true,
    });

    /*
      This test is here because in development there was a WTF moment,
      when optional-inferred types were correct when the type was
      created indirectly (keys where assigned to there own variable
      first), but were incorrect when created directly (keys were
      written as inline object in the obj({}) definition).

      To make sure, there is no difference in both approaches, this
      test is here.
    */

    const keys = {
      just: bool({}),
      maybe: bool({ optional: true }),
    };
    const indirectlyCreated = obj({ keys });
    type IndirectType = InferType<typeof indirectlyCreated>;

    const g = (a: IndirectType) => a;
    g({ just: true });
    g({ just: true, maybe: true });
    // @ts-expect-error
    g({ maybe: true });
  });
});
