"use strict";

const config = require('@apparts/config').get('types-config');

const btrue = function (value) {
  return /^((?:true)|1)$/i.test(value);
};

const bfalse = function (value) {
  return /^((?:false)|0)$/i.test(value);
};

let id;
switch (config.idType) {
case 'string':
  id = { check: x => module.exports.string.check(x) };
  break;
case 'UUIDv4':
  id = { check: x =>
         /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(x)
       };
  break;
case undefined:
case 'int':
  id = { check: x => module.exports.int.check(x),
             conv: x => module.exports.int.conv(x)};
  break;
default:
  id = { check: x => new RegExp(config.idType).test(x) };
}

module.exports = {
  '/': { check: x => true },
  'int': { check: (x) => typeof x === 'number' && Math.round(x) === x,
           conv: x => parseInt(x) },
  'float': { check: (x) => typeof x === 'number',
           conv: x => parseFloat(x) },
  'hex': { check: x => /^[0-9a-f]+$/i.test(x) },
  'base64': { check: x =>
              /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/i.test(x)
  },
  'bool': { check: x => typeof x === "boolean",
            conv: x => {
              const t = btrue(x);
              if(t || bfalse(x)){
                return t;
              }
              throw "Not a boolean";
            }
  },
  'string': { check: x => {
    try {
      return x+'' == x;
    } catch (e) {
      return false;
    }
  }},
  'email': { check: x =>
             /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(x)
  },
  'array': { conv: x => JSON.parse(x),
             check: x => Array.isArray(x) },
  'array_int': { conv: x => JSON.parse(x),
                 check: x => {
                   if (!Array.isArray(x)) {
                     return false;
                   }
                   return x.reduce((a, v) => a && module.exports.int.check(v),
                                   true);
                 },
               },
  'array_id': { conv: x => JSON.parse(x),
                check: x => {
                  if (!Array.isArray(x)) {
                    return false;
                  }
                  return x.reduce((a, v) => a
                                  && module.exports.id.check(v), true);
                }
              },
  'password': { check: x => typeof x === 'string'},
  'time': { check: x => module.exports.int.check(x),
            conv: x => module.exports.int.conv(x) },
  'array_time': { check: x => module.exports.array_int.check(x),
            conv: x => module.exports.array_int.conv(x) },
  id
};
