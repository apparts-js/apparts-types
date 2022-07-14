import { fillInDefaults } from "./fillInDefaults";

describe("obj", () => {
  it("should fill empty input with", async () => {
    expect(
      fillInDefaults({
        type: "object",
        keys: {
          a: { type: "string", default: "test" },
        },
      })
    ).toStrictEqual({ a: "test" });
    expect(
      fillInDefaults({
        type: "object",
        default: { a: "deftest" },
        keys: {
          a: { type: "string", default: "test" },
        },
      })
    ).toStrictEqual({ a: "deftest" });
  });

  it("should fill empty object", async () => {
    expect(
      fillInDefaults(
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
      fillInDefaults(
        {
          type: "object",
          keys: {
            a: { type: "string", default: "test" },
            b: { type: "string", default: "test1" },
          },
        },
        { a: "here" }
      )
    ).toStrictEqual({ a: "here", b: "test1" });
  });

  it("should fill in empty valueObj", async () => {
    expect(
      fillInDefaults({
        type: "object",
        values: { type: "string", default: "test" },
      })
    ).toStrictEqual({});
  });
  it("should fill in valueObj with default", async () => {
    expect(
      fillInDefaults({
        type: "object",
        values: { type: "string", default: "test" },
        default: { yay: "uff" },
      })
    ).toStrictEqual({ yay: "uff" });
  });
});

describe("array", () => {
  it("should fill in missing array", async () => {
    expect(
      fillInDefaults({
        type: "array",
        values: { type: "string", default: "test" },
        default: ["yay"],
      })
    ).toStrictEqual(["yay"]);
  });

  it("should keep existing array", async () => {
    expect(
      fillInDefaults(
        {
          type: "array",
          values: { type: "string", default: "test" },
          default: ["yay"],
        },
        []
      )
    ).toStrictEqual([]);
  });
});

describe("others", () => {
  it("should leave field without value or default alone", async () => {
    expect(
      fillInDefaults({
        type: "oneOf",
        alternatives: [{ value: 3 }, { value: 3 }],
      })
    ).toStrictEqual(undefined);
  });

  it("should fill in oneOf", async () => {
    expect(
      fillInDefaults(
        {
          type: "oneOf",
          alternatives: [{ value: 3 }, { value: 3 }],
          default: 3,
        },
        []
      )
    ).toStrictEqual(3);
  });
});

describe("should run default function", () => {
  it("should run default function ", async () => {
    expect(
      fillInDefaults({
        type: "oneOf",
        alternatives: [{ value: 3 }, { value: 3 }],
        default: () => 3,
      })
    ).toStrictEqual(3);
  });
  it("should run default function with defaultFnParams ", async () => {
    expect(
      fillInDefaults(
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
