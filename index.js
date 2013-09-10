var crypto = require('crypto')
  , qs = require('querystring')
  ;

function sha1 (key, body) {
  return crypto.createHmac('sha1', key).update(body).digest('base64')
}

function rfc3986 (str) {
  return encodeURIComponent(str)
    .replace(/!/g,'%21')
    .replace(/\*/g,'%2A')
    .replace(/\(/g,'%28')
    .replace(/\)/g,'%29')
    .replace(/'/g,'%27')
    ;
}

function hmacsign (httpMethod, base_uri, params, consumer_secret, token_secret) {
  // adapted from https://dev.twitter.com/docs/auth/oauth and 
  // https://dev.twitter.com/docs/auth/creating-signature

  // encode before sorting.
  // see http://tools.ietf.org/html/rfc5849#section-3.4.1.3.2
  // e.g. c2 < c@, but c2 > c%40.
  var querystring = Object.keys(params).sort(function(a, b){
    // simplified compare function because keys are unique
    return (rfc3986(a) > rfc3986(b)) ? 1 : -1
  }).reduce(function(map, key){
    // querystring builds value as an array for same keys
    // e.g. 'a3=a&c2&a3=2+q' becomes { a3: ['2 q', 'a'], c2: '' }
    if (Array.isArray(params[key])) {
      params[key].map(rfc3986).sort().forEach(function(val){
        map.push(escape(rfc3986(key)) + "%3D" + escape(val))
      })
    } else {
      // big WTF here with the escape + encoding but it's what twitter wants
      map.push(escape(rfc3986(key)) + "%3D" + escape(rfc3986(params[key])))
    }
    return map;
  }, []).join('%26')

  var base = [
    httpMethod ? httpMethod.toUpperCase() : 'GET',
    rfc3986(base_uri),
    querystring
  ].join('&')

  var key = [
    consumer_secret,
    token_secret || ''
  ].map(rfc3986).join('&')

  return sha1(key, base)
}

exports.hmacsign = hmacsign
exports.rfc3986 = rfc3986
