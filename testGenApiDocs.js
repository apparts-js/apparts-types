const { app } = require("./myTestEndpoint");
const express = require("express");
const {
  genApiDocs: { getApi, apiToHtml },
} = require("./");

const docs = apiToHtml(getApi(app));
console.log(docs);
