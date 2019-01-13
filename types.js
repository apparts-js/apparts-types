"use strict";

const btrue = function (value) {
  return /^((?:true)|1)$/i.test(value);
};

const bfalse = function (value) {
  return /^((?:false)|0)$/i.test(value);
};


module.exports = {
  '/': { check: x => true },
  'int': { check: (x) => /^-?\d+$/.test(x),
           conv: x => parseInt(x) },
  'float': { check: (x) => /^-?\d+(\.\d+)?$/.test(x),
           conv: x => parseInt(x) },

  'hex': { check: x => /^[0-9a-f]+$/i.test(x)
         },
  'base64': { check: x =>
              /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/i.test(x)
  },
  'bool': { check: x => btrue(x) || bfalse(x),
            conv: x => btrue(x)
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
  'array': { check: x => Array.isArray(x) },
  'array_id': { check: x => Array.isArray(x)
                && x.reduce((acc, v) => acc
                            && module.exports.hex.check(v), true)
              },
  'arrayS': { conv: x => JSON.parse(x),
              check: x => {
                var changes;
                try {
                  changes = JSON.parse(x);
                } catch (e) {
                  return false;
                }
                if (!Array.isArray(changes)) {
                  return false;
                }
                return true;
              }},
  'password': { check: x => {
    if (x.length < 5) {
      return false;
    }
    return /^(.*\d.*\D.*)|(.*\D.*\d.*)$/i.test(x);
  }},
  'time': { check: x => module.exports.int.check(x),
            conv: x => module.exports.int.conv(x) },
  'id': { check: x => module.exports.int.check(x),
          conv: x => module.exports.int.conv(x)}
};
