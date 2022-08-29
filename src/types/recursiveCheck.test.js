import { recursiveCheck } from "./recursiveCheck";
const checkType = (a, b) => recursiveCheck(a, b) === true;

import {
  object,
  time,
  array,
  email,
  string,
  bool,
  base64,
  hex,
  float,
  uuidv4,
  int,
  any,
  value,
  oneOf,
} from "./tests/types";

// TODO:
// - array children
// - oneOf children
// - objValue children

describe("recursiveCheck, explain wrong type", () => {
  it("should explain wrong value", async () => {
    expect(recursiveCheck({ value: "test" }, "Test")).toStrictEqual({
      key: "",
      shouldType: { value: "test" },
      isValue: "Test",
    });
  });
  it("should explain wrong type", async () => {
    expect(recursiveCheck({ type: "int" }, 7.5)).toStrictEqual({
      key: "",
      shouldType: { type: "int" },
      isValue: 7.5,
    });
  });
  it("should explain wrong array type", async () => {
    expect(
      recursiveCheck({ type: "array", items: { type: "/" } }, 7.5)
    ).toStrictEqual({
      key: "",
      shouldType: { type: "array", items: { type: "/" } },
      isValue: 7.5,
    });
  });
  it("should explain wrong object type", async () => {
    expect(
      recursiveCheck({ type: "object", keys: { test: { type: "/" } } }, 7.5)
    ).toStrictEqual({
      key: "",
      shouldType: { type: "object", keys: { test: { type: "/" } } },
      isValue: 7.5,
    });
  });
  it("should explain wrong objectValue type", async () => {
    expect(
      recursiveCheck({ type: "object", values: { type: "/" } }, 7.5)
    ).toStrictEqual({
      key: "",
      shouldType: { type: "object", values: { type: "/" } },
      isValue: 7.5,
    });
  });
});

describe("recursiveCheck, explain obj wrong child", () => {
  it("should explain too many children", async () => {
    expect(
      recursiveCheck(
        { type: "object", keys: { test: { type: "/" } } },
        { test: 1, other: 2 }
      )
    ).toStrictEqual({
      key: "other",
      shouldType: undefined,
      isValue: 2,
    });
  });
  it("should explain too few children", async () => {
    expect(
      recursiveCheck({ type: "object", keys: { test: { type: "string" } } }, {})
    ).toStrictEqual({
      key: "test",
      shouldType: { type: "string" },
      isValue: undefined,
    });
  });
  it("should explain wrong children", async () => {
    expect(
      recursiveCheck(
        { type: "object", keys: { test: { type: "int" } } },
        { test: 6.6 }
      )
    ).toStrictEqual({
      key: "test",
      shouldType: { type: "int" },
      isValue: 6.6,
    });
  });
  it("should explain wrong child one level deep", async () => {
    expect(
      recursiveCheck(
        {
          type: "object",
          keys: {
            test: {
              type: "object",
              keys: {
                deep: { type: "int" },
              },
            },
          },
        },
        { test: {} }
      )
    ).toStrictEqual({
      key: "test.deep",
      shouldType: { type: "int" },
      isValue: undefined,
    });
  });
});

describe("recursiveCheck should accept valid input", () => {
  it("should correctly classify value", async () => {
    value(checkType);
  });

  it("should correctly classify any", async () => {
    any(checkType);
  });

  it("should correctly classify int", async () => {
    int(checkType);
  });
  it("should correctly classify id", async () => {
    int(checkType, "id");
  });

  it("should correctly classify uuid", async () => {
    uuidv4(checkType);
  });

  it("should correctly classify float", async () => {
    float(checkType);
  });

  it("should correctly classify hex", async () => {
    hex(checkType);
  });

  it("should correctly classify base64", async () => {
    base64(checkType);
  });

  it("should correctly classify bool", async () => {
    bool(checkType, "bool");
  });
  it("should correctly classify boolean", async () => {
    bool(checkType, "boolean");
  });
  it("should correctly classify string", async () => {
    string(checkType);
  });
  it("should correctly classify password", async () => {
    string(checkType, "password");
  });

  it("should correctly classify email", async () => {
    email(checkType);
  });

  it("should correctly classify array", async () => {
    array(checkType);
  });

  it("should correctly classify time", async () => {
    time(checkType);
  });

  it("should correctly classify object", async () => {
    object(checkType);
  });

  it("should correctly classify oneOf", async () => {
    oneOf(checkType);
  });
});
