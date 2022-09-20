import { explainCheck } from "./explainCheck";
import {
  object,
  time,
  array,
  email,
  phoneISD,
  string,
  bool,
  base64,
  hex,
  float,
  uuidv4,
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

  it("should correctly classify phoneISD", async () => {
    phoneISD(checkType);
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
