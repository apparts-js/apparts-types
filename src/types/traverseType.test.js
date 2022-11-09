import { traverseType } from "./traverseType";

describe("traverseType", () => {
  it("should traverse undefined", async () => {
    const fn = jest.fn().mockImplementation((t) => t);
    expect(traverseType(undefined, fn)).toBe(undefined);
    expect(fn.mock.calls.length).toBe(0);
  });
  it("should traverse atomic type", async () => {
    const fn = jest.fn().mockImplementation((t) => t);
    expect(traverseType({ type: "int" }, fn)).toMatchObject({ type: "int" });
    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0]).toMatchObject({ type: "int" });
  });
  it("should traverse nested types", async () => {
    const fn = jest.fn().mockImplementation((t) => t);
    const complexType = {
      type: "object",
      keys: {
        anObject: {
          type: "object",
          keys: {
            a1: { type: "int" },
          },
        },
        anObjectWOKeys: {
          type: "object",
          values: { type: "float" },
        },
        anArray: {
          type: "array",
          items: {
            type: "boolean",
          },
        },
        aOneOf: {
          type: "oneOf",
          alternatives: [{ type: "email" }, { value: 4 }],
        },
      },
    };
    expect(traverseType(complexType, fn)).toMatchObject(complexType);
    expect(fn.mock.calls.length).toBe(10);
    expect(fn.mock.calls[0][0]).toMatchObject(complexType);
    expect(fn.mock.calls[1][0]).toMatchObject(complexType.keys.anObject);
    expect(fn.mock.calls[2][0]).toMatchObject(
      complexType.keys.anObject.keys.a1
    );
    expect(fn.mock.calls[3][0]).toMatchObject(complexType.keys.anObjectWOKeys);
    expect(fn.mock.calls[4][0]).toMatchObject(
      complexType.keys.anObjectWOKeys.values
    );
    expect(fn.mock.calls[5][0]).toMatchObject(complexType.keys.anArray);
    expect(fn.mock.calls[6][0]).toMatchObject(complexType.keys.anArray.items);
    expect(fn.mock.calls[7][0]).toMatchObject(complexType.keys.aOneOf);
    expect(fn.mock.calls[8][0]).toMatchObject(
      complexType.keys.aOneOf.alternatives[0]
    );
    expect(fn.mock.calls[9][0]).toMatchObject(
      complexType.keys.aOneOf.alternatives[1]
    );
  });
});

describe("pruning behavior", () => {
  it("should prune array if items type is returned as undefined", async () => {
    const fn = jest
      .fn()
      .mockImplementation((t) => (t.type === "int" ? undefined : t));
    expect(traverseType({ type: "array", items: { type: "int" } }, fn)).toBe(
      undefined
    );
    expect(fn.mock.calls.length).toBe(2);
  });
  it("should prune objValue if values type is returned as undefined", async () => {
    const fn = jest
      .fn()
      .mockImplementation((t) => (t.type === "int" ? undefined : t));
    expect(traverseType({ type: "object", values: { type: "int" } }, fn)).toBe(
      undefined
    );
    expect(fn.mock.calls.length).toBe(2);
  });
  it("should not use undefined for oneOf alternative", async () => {
    const fn = jest
      .fn()
      .mockImplementation((t) => (t.type === "int" ? undefined : t));
    expect(
      traverseType(
        { type: "oneOf", alternatives: [{ type: "int" }, { type: "boolean" }] },
        fn
      )
    ).toMatchObject({ type: "oneOf", alternatives: [{ type: "boolean" }] });
    expect(fn.mock.calls.length).toBe(3);
  });
  it("should not use undefined for obj keys", async () => {
    const fn = jest
      .fn()
      .mockImplementation((t) => (t.type === "int" ? undefined : t));
    expect(
      traverseType(
        {
          type: "object",
          keys: { a: { type: "int" }, b: { type: "boolean" } },
        },
        fn
      )
    ).toStrictEqual({ type: "object", keys: { b: { type: "boolean" } } });
    expect(fn.mock.calls.length).toBe(3);
  });
});
