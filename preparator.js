"use strict";

const xss = require("xss");
const { HttpError } = require('@apparts/error');
const uuidv1 = require('uuid/v1');

const authorizationHeader = require('./authorizationHeader.js');
const types = require('./types');

const config = require('@apparts/config').get('types-config');
const logger = require('@apparts/logger');

/**
 * Stuffs type-assertions before the call of the 'next'-function
 * @param {Object} assertions
 * @callback next recieves (request) and must return Promise
 * @param {Object} [options] Options
 * @param {bool} [options.strap] If true all parameters will be
 * strapped out of the request, if they where not specified in
 * assertions
 */
var prepare = (assertions, next, options) => {

  return function(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.status(200);
    // iterate over the fields specified in the API's assertions
    for (var field in assertions) {
      if (field == 'security' || !assertions.hasOwnProperty(field)) {
        continue;
      }
      if (!req.hasOwnProperty(field)) {
        req[field] = {};
      }
      // THIS IS A HACK! REMOVE AS SOON AS THE GUYS AT EXPRESS GET THEIR SHIT TOGETHER
      //      req[field].hasOwnProperty = Object.prototype.hasOwnProperty;

      var c = check(assertions[field], req[field]);
      if (c !== true) {
        var r = {};
        r[field] = c;
        res.status(400)
          .send({ error: 'Fieldmissmatch',
                  field: field,
                  message: c});
        return;
      }
      if (options) {
        if (options.strap) {
          for (var key in req[field]) {
            if (Object.hasOwnProperty.call(req[field], key)
                && assertions[field].hasOwnProperty(key)) {
              continue;
            }
            delete req[field][key];
          }
        }
      }
    }
    next(req)
      .then(data => {
        if(typeof data === 'object' && data.type === 'HttpError'){
          res.status(data.code);
          res.send(JSON.stringify({ error: data.message }));
        } else {
          res.send(JSON.stringify(data));
        }
      })
      .catch(e => {
        if(typeof e === 'object' && e.type === 'HttpError'){
          res.status(e.code);
          res.send(JSON.stringify({ error: e.message }));
          return;
        }

        const errorObj = constructErrorObj(req, e);
        logger.error(errorObj);
        res.status(500);
        res.send(`SERVER ERROR! ${ errorObj.ID } Please consider sending`
                 + ` this error-message along with a description of what`
                 + ` happend and what you where doing to this email-address:`
                 + ` ${ config.bugreportEmail }.`);
      });
  };
};

/**
 * Performs the type-assertion-check and applies default values
 *
 * @param {Object} wanted
 * @param {Object} given
 * @return {bool} 'true' if everything matched, Error Description if not
 */
const check = (wanted, given) => {

  // iterate over wanted parameters
  var keys = Object.keys(wanted);
  for (var i = 0; i < keys.length; i++) {
    var param = keys[i];

    var exists = Object.hasOwnProperty.call(given, param) && given[param] !== undefined; // is the parameter given?
    var foundMatch = false;
    // parameter is mandatory, if it is not optional
    // parameter is optional, if it has a default value, or it is explicitly marked so
    var mandatory = !( wanted[param].hasOwnProperty('default') ||
                      (wanted[param].hasOwnProperty('optional') &&
                       wanted[param]['optional'] === true) );
    if (exists) {
      // does the argument only have one possible type...
      if (wanted[param].hasOwnProperty('type')) {
        // does the argument match the prescribed type?
        if(types[wanted[param]['type']].conv){
          try {
            const temp = types[wanted[param]['type']].conv(given[param]);
            if (types[wanted[param]['type']].check(temp)) {
              given[param] = temp;
              foundMatch = true;
            }
          } finally { }
        }
      } else
      // ... or can it have multiple types?
/*      if (wanted[param].hasOwnProperty('types')) {
        for (var i = 0; i < wanted[param]['types'].length; i++) {
          var type = wanted[param]['types'][i];
          if (types[type].check(given[param])) {
            foundMatch = true;
            if(types[type].conv){
              given[param] = types[type].conv(given[param]);
            }
            break;
          }
        }
      } */
      // note, if this doesn't apply, programm will jump right to return true
      if (!foundMatch) {
        var res = {};
        res[param] = 'expected '+wanted[param]['type'];
        return res;
      } else {
        // xss sanitizer
        if (wanted[param].hasOwnProperty('xss')) {
          given[param] = xss(given[param]);
        }
      }
    } else {
      // parameter is not given but was mandatory
      if (mandatory) {
        var res = {};
        res[param] = 'missing';
        return res;
      } else
      // param not given but optional and default value is provided -> apply it!
      if ( wanted[param].hasOwnProperty('default') ) {
        given[param] = wanted[param]['default'];
      }
    }
  }

  return true;
};

const constructErrorObj = (req, error) => {
  const errorObj = {
    ID: uuidv1(),
    USER: authorizationHeader(req)[0],
    REQUEST: {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    },
    ERROR: error,
    TRACE: (error || {}).stack
  };
  if(Object.keys(req.body).length > 0){
    errorObj.REQUEST.body = req.body;
  }
  if(Object.keys(req.params).length > 0){
    errorObj.REQUEST.params = req.params;
  }
  if(Object.keys(req.cookies).length > 0){
    errorObj.REQUEST.cookies = req.cookies;
  }
  return errorObj;
};

module.exports = prepare;
