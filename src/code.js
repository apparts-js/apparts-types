"use strict";

class HttpCode {
  constructor(code, message) {
    this.code = code;
    this.type = "HttpCode";
    if (message) {
      this.message = message;
    } else {
      this.message = this.getDefaultMessage(code);
    }
  }

  getDefaultMessage(code) {
    switch (code) {
      default:
        return "";
    }
  }
}

class DontRespond {
  constructor() {
    this.type = "DontRespond";
  }
}

module.exports = { HttpCode, DontRespond };
