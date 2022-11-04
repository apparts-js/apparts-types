import { fillInDefaultsStrict } from "./fillInDefaultsStrict";

describe("obj", () => {
  it("should keep empty input w/o direct default", async () => {
    expect(
      fillInDefaultsStrict(
        {
          type: "object",
          keys: {
            a: { type: "string", default: "test" },
          },
        },
        undefined
      )
    ).toStrictEqual(undefined);
    expect(
      fillInDefaultsStrict(
        {
          type: "object",
          default: { a: "outerdef" },
          keys: {
            a: { type: "string", default: "innerdef" },
          },
        },
        undefined
      )
    ).toStrictEqual({ a: "outerdef" });
  });

  it("should fill empty object", async () => {
    expect(
      fillInDefaultsStrict(
        {
          type: "object",
          default: { a: "deftest" },
          keys: {
            a: { type: "string", default: "test" },
          },
        },
        {}
      )
    ).toStrictEqual({ a: "test" });
  });
  it("should fill in non-empty obj", async () => {
    expect(
      fillInDefaultsStrict(
        {
          type: "object",
          keys: {
            a: { type: "string", default: "test" },
            b: { type: "string", default: "test1" },
            c: {
              type: "object",
              keys: {
                d: { type: "string", default: "innerdef" },
              },
            },
          },
        },
        { a: "here", c: {} }
      )
    ).toStrictEqual({ a: "here", b: "test1", c: { d: "innerdef" } });
  });

  it("should not fill in empty valueObj", async () => {
    expect(
      fillInDefaultsStrict({
        type: "object",
        values: { type: "string", default: "test" },
      })
    ).toStrictEqual(undefined);
  });
  it("should fill in valueObj with default", async () => {
    expect(
      fillInDefaultsStrict({
        type: "object",
        values: { type: "string", default: "test" },
        default: { yay: "uff" },
      })
    ).toStrictEqual({ yay: "uff" });
  });

  it("should leave non-obj that has default", async () => {
    expect(
      fillInDefaultsStrict(
        {
          type: "object",
          keys: {},
          default: {},
        },
        []
      )
    ).toStrictEqual([]);
  });

  it("should not set optional value wo default", async () => {
    const result = fillInDefaultsStrict(
      {
        type: "object",
        keys: {
          opt: {
            type: "string",
            optional: true,
          },
          req: { type: "string", default: "bla" },
        },
      },
      {}
    );

    expect(result).toStrictEqual({ req: "bla" });
    expect("opt" in result).toBe(false);
  });
});

describe("array", () => {
  it("should fill in missing array that has default", async () => {
    expect(
      fillInDefaultsStrict({
        type: "array",
        values: { type: "string", default: "test" },
        default: ["yay"],
      })
    ).toStrictEqual(["yay"]);
  });

  it("should keep existing array that has default", async () => {
    expect(
      fillInDefaultsStrict(
        {
          type: "array",
          values: { type: "string", default: "test" },
          default: ["yay"],
        },
        []
      )
    ).toStrictEqual([]);
  });

  it("should keep missing array that has no default", async () => {
    expect(
      fillInDefaultsStrict({
        type: "array",
        values: { type: "string", default: "test" },
      })
    ).toStrictEqual(undefined);
  });
});

describe("others", () => {
  it("should leave field without value or default alone", async () => {
    expect(
      fillInDefaultsStrict({
        type: "oneOf",
        alternatives: [{ value: 3 }, { value: 3 }],
      })
    ).toStrictEqual(undefined);
    expect(
      fillInDefaultsStrict({
        type: "boolean",
      })
    ).toStrictEqual(undefined);
  });

  it("should fill in oneOf that has a default", async () => {
    expect(
      fillInDefaultsStrict(
        {
          type: "oneOf",
          alternatives: [{ value: 3 }, { value: 3 }],
          default: 3,
        },
        undefined
      )
    ).toStrictEqual(3);
  });

  it("should leave wrongly typed input despite default", async () => {
    expect(
      fillInDefaultsStrict(
        {
          type: "oneOf",
          alternatives: [{ value: 3 }, { value: 3 }],
          default: 3,
        },
        []
      )
    ).toStrictEqual([]);
  });

  it("should insert value with default", async () => {
    expect(
      fillInDefaultsStrict({
        value: 3,
        default: 3,
      })
    ).toStrictEqual(3);
  });
  it("should keep wrong value with default", async () => {
    expect(
      fillInDefaultsStrict(
        {
          value: 3,
          default: 3,
        },
        4
      )
    ).toStrictEqual(4);
  });
});

describe("should run default function", () => {
  it("should run default function ", async () => {
    expect(
      fillInDefaultsStrict({
        type: "oneOf",
        alternatives: [{ value: 3 }, { value: 3 }],
        default: () => 3,
      })
    ).toStrictEqual(3);
  });
  it("should run default function with defaultFnParams ", async () => {
    expect(
      fillInDefaultsStrict(
        {
          type: "oneOf",
          alternatives: [{ value: 3 }, { value: 3 }],
          default: (n) => n,
        },
        undefined,
        77
      )
    ).toStrictEqual(77);
  });
});
