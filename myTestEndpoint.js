const preparator = require("./preparator");
const { HttpError } = require("@apparts/error");
const express = require("express");

const myEndpoint = preparator(
  {
    body: {
      name: { type: "string", default: "no name" },
    },
    query: {
      filter: { type: "string", optional: true },
    },
    params: {
      id: { type: "id" },
    },
  },
  async ({ body: { name }, query: { filter }, params: { id } }) => {
    if (name.length > 100) {
      return new HttpError(400, "Name too long");
    }
    // filter might not be defined, as it is optional
    if (filter) {
      // Return values are JSONified automatically!
      return {
        arr: [{ a: 1 }, { a: 2 }],
        foo: "really!",
        boo: true,
      };
    }
    // This produces "ok" (literally, with the quotes)
    return "ok";
  }
);
myEndpoint.returns = [
  { status: 200, value: "ok" },
  { status: 400, error: "Name too long" },
  {
    status: 200,
    type: "object",
    values: {
      foo: { value: "really!" },
      boo: { type: "bool" },
      arr: {
        type: "array",
        value: {
          type: "object",
          values: {
            a: { type: "int" },
          },
        },
      },
    },
  },
];

const myFaultyEndpoint = preparator(
  {
    body: {
      name: { type: "string", default: "no name" },
    },
    query: {
      filter: { type: "string", optional: true },
    },
    params: {
      id: { type: "id" },
    },
  },
  async ({ body: { name }, query: { filter }, params: { id } }) => {
    if (name.length > 100) {
      return new HttpError(400, "Name is too long");
    }
    // filter might not be defined, as it is optional
    if (filter === "wrongType") {
      // Return values are JSONified automatically!
      return {
        arr: [{ a: true }, { a: 2 }],
        boo: true,
      };
    }
    if (filter === "tooMuch") {
      return {
        arr: [{ a: 2 }, { a: 2 }],
        boo: true,
        tooMuch: true,
      };
    }
    if (filter === "tooLittle") {
      return {
        arr: [{ a: 2 }, { a: 2 }],
      };
    }
    // This produces "ok" (literally, with the quotes)
    return "whut?";
  }
);
myFaultyEndpoint.returns = [
  { status: 200, value: "ok" },
  { status: 400, error: "Name too long" },
  {
    status: 200,
    type: "object",
    values: {
      boo: { type: "bool" },
      arr: {
        type: "array",
        value: {
          type: "object",
          values: {
            a: { type: "int" },
          },
        },
      },
    },
  },
];

const myTypelessEndpoint = preparator({}, async ({}) => {
  return "ok";
});

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.post("/v/1/endpoint/:id", myEndpoint);
app.post("/v/1/faultyendpoint/:id", myFaultyEndpoint);
app.post("/v/1/typelessendpoint", myTypelessEndpoint);

module.exports = { myEndpoint, myFaultyEndpoint, myTypelessEndpoint, app };
