"use strict";

const { HttpError, exceptionTo } = require("@apparts/error");
const prepare = require("./preparator");
const { basicAuth, bearerAuth } = require("./authorizationHeader.js");

let verifyJWT = function () {
  throw '@apparts/types: Missing peer dependency: "jsonwebtoken"\nPlease install manually with \n\tnpm i --save jsonwebtoken\n\n';
};
try {
  verifyJWT = require("jsonwebtoken").verify;
} catch (e) {}

let NotFound;
const _prepauth = (assertions, fun, options, usePw, useUser) => {
  return prepare(
    assertions,
    async (req) => {
      let [email, token] = basicAuth(req);
      if (!email || !token) {
        return new HttpError(400, "Authorization wrong");
      }
      const [, User] = useUser(req.dbs);
      const user = new User();
      try {
        await user.load({ email: email.toLowerCase(), deleted: false });
        if (usePw) {
          await user.checkAuthPw(token);
        } else {
          await user.checkAuth(token);
        }
      } catch (e) {
        return exceptionTo(NotFound, e, new HttpError(401, "User not found"));
      }
      return fun(req, user);
    },
    options
  );
};
_prepauth.returns = [
  { status: 401, error: "User not found" },
  { status: 400, error: "Authorization wrong" },
  { status: 401, error: "Unauthorized" },
];

const prepauthToken = (useUser, assertions, fun, options) => {
  try {
    NotFound = require("@apparts/model").NotFound;
  } catch (e) {
    throw '@apparts/types: Missing peer dependency: "@apparts/model"\nPlease install manually with \n\tnpm i --save @apparts/model\n\n';
  }

  return _prepauth(assertions, fun, options, false, useUser);
};
prepauthToken.returns = _prepauth.returns;

const prepauthPW = (useUser, assertions, fun, options) => {
  try {
    NotFound = require("@apparts/model").NotFound;
  } catch (e) {
    throw '@apparts/types: Missing peer dependency: "@apparts/model"\nPlease install manually with \n\tnpm i --save @apparts/model\n\n';
  }

  return _prepauth(assertions, fun, options, true, useUser);
};
prepauthPW.returns = _prepauth.returns;

const prepauthTokenJWT = (webtokenkey) => (assertions, fun, options) => {
  return prepare(
    assertions,
    async (req, res) => {
      let token = bearerAuth(req);
      if (!token) {
        return new HttpError(401);
      }
      let jwt;
      try {
        jwt = verifyJWT(token, webtokenkey);
      } catch (err) {
        console.log(err);
        return new HttpError(401);
      }
      const { action } = jwt;
      if (action !== "login") {
        return new HttpError(401);
      } else {
        return await fun(req, jwt, res);
      }
    },
    options
  );
};
prepauthTokenJWT.returns = [{ status: 401, error: "Unauthorized" }];

module.exports = {
  prepauthToken,
  prepauthPW,
  prepauthTokenJWT,
};
