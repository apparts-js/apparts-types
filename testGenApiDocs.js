const { app } = require("./myTestEndpoint");
const express = require("express");
const { genApiDocs } = require("./");

const docs = genApiDocs(app);
console.log(docs);
