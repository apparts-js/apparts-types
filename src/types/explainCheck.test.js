import { explainCheck } from "./explainCheck";
import {
  object,
  array,
  email,
  phoneISD,
  string,
  bool,
  base64,
  hex,
  float,
  uuid,
  int,
  any,
  oneOf,
  value,
} from "./tests/types";
import * as types from "../schema";
const checkType = (a, b) => !explainCheck(b, a);
const checkTypeSchema = (a, b) => !explainCheck(b, a.getType());
describe("explainCheck should accept valid input", () => {
  it("should correctly classify value", async () => {
    value(checkType);
  });

  it("should correctly classify any", async () => {
    any(checkType);
  });

  it("should correctly classify int", async () => {
    int(checkType);
  });

  it("should correctly classify uuid", async () => {
    uuid(checkType);
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

  it("should correctly classify boolean", async () => {
    bool(checkType);
  });
  it("should correctly classify string", async () => {
    string(checkType);
  });
  it("should correctly classify email", async () => {
    email(checkType);
  });

  it("should correctly classify phoneISD", async () => {
    phoneISD(checkType);
  });

  it("should correctly classify array", async () => {
    array(checkType);
  });

  it("should correctly classify object", async () => {
    object(checkType);
  });

  it("should correctly classify oneOf", async () => {
    oneOf(checkType);
  });
});

describe("should accept undefined for optional", () => {
  it("should accept int", async () => {
    expect(checkTypeSchema(types.int().optional(), undefined)).toBe(true);
  });
  it("should accept object", async () => {
    expect(checkTypeSchema(types.obj({}).optional(), undefined)).toBe(true);
  });
  it("should accept array", async () => {
    expect(
      checkTypeSchema(types.array(types.int()).optional(), undefined)
    ).toBe(true);
  });
  it("should accept oneOf", async () => {
    expect(
      checkTypeSchema(types.oneOf([types.int()]).optional(), undefined)
    ).toBe(true);
  });
  it("should accept objValues", async () => {
    expect(
      checkTypeSchema(types.objValues(types.int()).optional(), undefined)
    ).toBe(true);
  });
  it("should accept value", async () => {
    expect(checkTypeSchema(types.value(3).optional(), undefined)).toBe(true);
  });
});

describe("should not accept undefined for non optional", () => {
  it("should accept int", async () => {
    expect(checkTypeSchema(types.int(), undefined)).toBe(false);
  });
  it("should accept object", async () => {
    expect(checkTypeSchema(types.obj({}), undefined)).toBe(false);
  });
  it("should accept array", async () => {
    expect(checkTypeSchema(types.array(types.int()), undefined)).toBe(false);
  });
  it("should accept oneOf", async () => {
    expect(checkTypeSchema(types.oneOf([types.int()]), undefined)).toBe(false);
  });
  it("should accept objValues", async () => {
    expect(checkTypeSchema(types.objValues(types.int()), undefined)).toBe(
      false
    );
  });
  it("should accept value", async () => {
    expect(checkTypeSchema(types.value(3), undefined)).toBe(false);
  });
});
