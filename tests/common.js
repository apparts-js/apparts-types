const request = require("supertest");
const prepare = require("../preparator");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const expectSuccess = async (path, body) => {
  const res = await request(app)
    .post(path)
    .send(body)
    .expect("Content-Type", "application/json; charset=utf-8");
  expect(res.body).toBe("ok");
  expect(res.status).toBe(200);
  return res;
};

const expectMiss = async (path, body, paramType, field, fType) => {
  const res = await request(app)
    .post(path)
    .send(body)
    .expect("Content-Type", "application/json; charset=utf-8");
  expect(res.body).toMatchObject({
    error: "Fieldmissmatch",
    description: `missing ${fType} for field "${field}" in ${paramType}`,
  });
  expect(res.status).toBe(400);
  return res;
};

const expectWrong = async (path, body, paramType, field, fType) => {
  const res = await request(app)
    .post(path)
    .send(body)
    .expect("Content-Type", "application/json; charset=utf-8");
  expect(res.body).toMatchObject({
    error: "Fieldmissmatch",
    description: `expected ${fType} for field "${field}" in ${paramType}`,
  });
  expect(res.status).toBe(400);
  return res;
};

const expectError = async (path, body, code, resBody) => {
  const res = await request(app)
    .post(path)
    .send(body)
    .expect("Content-Type", "application/json; charset=utf-8");
  expect(res.body).toMatchObject(resBody);
  expect(res.status).toBe(code);
  return res;
};

let lastPath = 0;

const defPrep = (path, assumptions, tipe) => {
  lastPath++;
  app.post(
    "/a" + lastPath + "/" + path,
    prepare(assumptions, async ({ body, query, params }) => {
      if (tipe) {
        const val = { ...body, ...query, ...params }["myField"];
        switch (tipe) {
          case "hex":
          case "base64":
          case "uuidv4":
          case "string":
          case "email":
          case "password":
            return typeof val === "string" ? "ok" : "nope";

          case "id":
          case "int":
          case "float":
          case "time":
            return typeof val === "number" ? "ok" : "nope";

          case "bool":
            return typeof val === "boolean" ? "ok" : "nope";

          case "array":
          case "arrayInt":
          case "arrayId":
          case "arrayTime":
            return Array.isArray(val) ? "ok" : "nope";
        }
      }
      return "ok";
    })
  );
  return "/a" + lastPath + "/";
};

module.exports = {
  defPrep,
  expectWrong,
  expectMiss,
  expectSuccess,
  app,
  expectError,
};
