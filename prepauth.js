"use strict";

const { HttpError, exceptionTo } = require('apparts-error');
const { NotFound } = require('apparts-model');

const prepare = require('./preperator');
const authorizationHeader = require('./authorizationHeader.js');


let User = function(){
  throw "Prepauth: Usermodel not set";
};

module.exports.setUserModel = (pUser) => {
  User = pUser;
};

module.exports = (dbs, assertions, fun, options, usePw) => {
  return prepare(
    assertions,
    async (req) => {
      let [email, token] = authorizationHeader(req);
      if(email){
        const user = new (User(dbs))();
        try {
          await user.loadOne({ email });
        } catch(e) {
          return exceptionTo(NotFound, e, new HttpError(401));
        }
        if(usePw){
          await user.checkAuthPw(token);
        } else {
          await user.checkAuth(token);
        }
        return fun(req, user);
      }
      return new HttpError(400, "Authorization wrong");
    },
    options);
};
