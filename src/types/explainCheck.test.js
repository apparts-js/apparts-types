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

const checkType = (a, b) => !explainCheck(b, a);
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
