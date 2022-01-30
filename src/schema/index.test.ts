import { int, bool, obj, InferType } from "./index";

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
  });

  it("should defer optinals when created indirectly", async () => {
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

  it("should defer optionals with description", async () => {
    const hasDesc = obj({
      keys: {
        just: bool({ description: "Test" }),
        maybe: bool({ optional: true, description: "Test" }),
      },
    });
    type HasDesc = InferType<typeof hasDesc>;
    const f = (a: HasDesc) => a;

    f({ just: true, maybe: true });
    f({ just: true });
    // @ts-expect-error
    f({});
  });

  it("should defer optionals obj obj", async () => {
    const hasDesc = obj({
      keys: {
        maybe: obj({
          optional: true,
          keys: {
            key: bool(),
          },
        }),
        just: obj({
          keys: { key: bool() },
        }),
      },
    });
    type HasDesc = InferType<typeof hasDesc>;
    const f = (a: HasDesc) => a;

    f({ just: { key: true }, maybe: { key: true } });
    f({ just: { key: true } });
    // @ts-expect-error
    f({});
  });
});
